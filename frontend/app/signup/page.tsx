'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { useUIStore } from '@/store/uiStore'

export default function SignupPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const setAuthModal = useUIStore((s) => s.setAuthModal)

  useEffect(() => {
    if (user) { router.replace('/dashboard'); return }
    if (!loading) setAuthModal('signup')
  }, [user, loading])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--blue) transparent transparent transparent' }} />
      </div>
    </div>
  )
}
