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
  const didInit = useRef(false)

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    return data
  }

  const redirectUser = (profile: any) => {
    if (!profile) return
    const p = window.location.pathname
    const onOnboarding = p === '/onboarding'
    const onAuthPage = p === '/login' || p === '/signup' || p === '/'

    if (!profile.onboarding_complete && !onOnboarding) {
      router.replace('/onboarding')
    } else if (profile.onboarding_complete && (onOnboarding || onAuthPage)) {
      router.replace('/dashboard')
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data.user) {
      const profile = await fetchProfile(data.user.id)
      setAuth(data.user, profile, data.session?.access_token ?? '')
      redirectUser(profile)
    }
    return data
  }

  const handleSignUp = async (email: string, password: string, full_name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name } }
    })
    if (error) throw error
    if (data.user) {
      const profile = await fetchProfile(data.user.id)
      setAuth(data.user, profile, data.session?.access_token ?? '')
      redirectUser(profile)
    }
    return data
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    clearAuth()
    router.push('/')
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) throw error
  }

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setAuth(session.user, profile, session.access_token)
        if (!didInit.current) {
          didInit.current = true
          redirectUser(profile)
        }
      }
      setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const profile = await fetchProfile(session.user.id)
        setAuth(session.user, profile, session.access_token)
        redirectUser(profile)
      } else if (event === 'SIGNED_OUT') {
        clearAuth()
        router.replace('/')
      } else if (session) {
        const profile = await fetchProfile(session.user.id)
        setAuth(session.user, profile, session.access_token)
      }
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const { user, profile } = useAuthStore()

  return (
    <AuthCtx.Provider value={{
      user, profile, loading,
      signUp: handleSignUp,
      signIn: handleSignIn,
      signOut: handleSignOut,
      signInWithOAuth: handleOAuth,
      supabase
    }}>
      {children}
    </AuthCtx.Provider>
  )
}
