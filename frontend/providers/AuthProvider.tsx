'use client'
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
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
  const redirectedRef = useRef(false)

  const handleProfileRedirect = useCallback((profile: any) => {
    if (redirectedRef.current) return
    const isLandingPage = pathname === '/' || pathname === '/login' || pathname === '/signup'
    if (profile && !profile.onboarding_complete && !isLandingPage && pathname !== '/onboarding') {
      redirectedRef.current = true
      router.replace('/onboarding')
    }
  }, [pathname, router])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data: profile }) => {
          setAuth(session.user, profile, session.access_token)
          handleProfileRedirect(profile)
          setLoading(false)
        }, () => {
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    }, () => {
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setAuth(session.user, profile, session.access_token)
        if (event === 'SIGNED_IN') redirectedRef.current = false
        handleProfileRedirect(profile)
      } else {
        clearAuth()
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
    redirectedRef.current = false
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
