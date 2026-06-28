'use client'
import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useAuthStore } from '@/store/authStore'
import { useRouter, usePathname } from 'next/navigation'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const AuthCtx = createContext<any>(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const didRun = useRef(false)
  const pathnameRef = useRef(pathname)

  useEffect(() => { pathnameRef.current = pathname }, [pathname])

  const handleAuth = async (userId: string) => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
    return profile
  }

  const runRedirect = (profile: any) => {
    if (!profile) return
    const p = pathnameRef.current
    const onOnboarding = p === '/onboarding'
    const onLoginOrSignup = p === '/login' || p === '/signup'

    if (!profile.onboarding_complete && !onOnboarding) {
      router.replace('/onboarding')
    } else if (profile.onboarding_complete && (onOnboarding || onLoginOrSignup)) {
      router.replace('/dashboard')
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await handleAuth(session.user.id)
        setAuth(session.user, profile, session.access_token)
        if (!didRun.current) {
          didRun.current = true
          runRedirect(profile)
        }
      }
      setLoading(false)
    }, () => { setLoading(false) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const profile = await handleAuth(session.user.id)
        setAuth(session.user, profile, session.access_token)
        runRedirect(profile)
      } else if (event === 'SIGNED_OUT') {
        clearAuth()
        router.replace('/')
      } else if (session) {
        const profile = await handleAuth(session.user.id)
        setAuth(session.user, profile, session.access_token)
      }
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, full_name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name } }
    })
    if (error) throw error
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    clearAuth()
    didRun.current = false
    router.push('/')
  }

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) throw error
  }

  const { user, profile } = useAuthStore()

  return (
    <AuthCtx.Provider value={{ user, profile, loading, signUp, signIn, signOut, signInWithOAuth, supabase }}>
      {children}
    </AuthCtx.Provider>
  )
}
