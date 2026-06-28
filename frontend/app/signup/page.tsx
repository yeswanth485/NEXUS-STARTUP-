'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { useUIStore } from '@/store/uiStore'

export default function SignupPage() {
  const { user, loading } = useAuth()
  const setAuthModal = useUIStore((s) => s.setAuthModal)
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
      return
    }
    if (!loading) setAuthModal('signup')
  }, [loading, user])

  return null
}
