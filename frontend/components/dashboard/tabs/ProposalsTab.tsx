'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import api from '@/lib/api'

export function ProposalsTab() {
  const { profile } = useAuth()
  const [proposals, setProposals] = useState<any[]>([])

  useEffect(() => {
    api.get('/proposals/mine').then(({ data }) => setProposals(data || [])).catch(() => {})
  }, [])

  const statusColors: Record<string, string> = { pending: '#FBBF24', viewed: '#60A5FA', accepted: '#34D399', rejected: '#F87171', withdrawn: '#94A3B8' }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">{profile?.role === 'client' ? 'Received Proposals' : 'My Proposals'}</h2>
      {proposals.length === 0 ? (
        <div className="text-center py-16"><p className="text-lg text-white">No proposals yet</p></div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{p.project?.title || 'Project'}</h3>
                  <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text2)' }}>{p.cover_letter}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text3)' }}>
                    <span>Bid: ${p.bid_amount?.toLocaleString()}</span>
                    <span>Timeline: {p.timeline}</span>
                  </div>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${statusColors[p.status]}20`, color: statusColors[p.status] || '#94A3B8' }}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
