'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { FreelancerProfile } from '@/components/profile/FreelancerProfile'
import { HireModal } from '@/components/modals/HireModal'
import { useUIStore } from '@/store/uiStore'
import api from '@/lib/api'

export default function FreelancerProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { hireModal } = useUIStore()

  useEffect(() => {
    api.get(`/profiles/${id}`).then(({ data }) => {
      setProfile(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <p className="text-lg text-white">Profile not found</p>
    </div>
  )

  return (
    <>
      <FreelancerProfile profile={profile} />
      {hireModal.open && <HireModal />}
    </>
  )
}
