'use client'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { PostProjectModal } from '@/components/modals/PostProjectModal'
import { SubmitProposalModal } from '@/components/modals/SubmitProposalModal'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { postProjectModal, submitProposalModal } = useUIStore()

  useEffect(() => {
    if (!loading && !user) router.push('/?auth=signin')
  }, [user, loading, router])

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <>
      <DashboardShell />
      {postProjectModal && <PostProjectModal />}
      {submitProposalModal.open && <SubmitProposalModal />}
    </>
  )
}
