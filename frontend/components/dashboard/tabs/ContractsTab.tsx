'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api'

export function ContractsTab() {
  const [contracts, setContracts] = useState<any[]>([])

  useEffect(() => {
    api.get('/contracts').then(({ data }) => setContracts(data || [])).catch(() => {})
  }, [])

  const statusColors: Record<string, string> = { active: '#60A5FA', paused: '#FBBF24', completed: '#34D399', cancelled: '#F87171' }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Active Contracts</h2>
      {contracts.length === 0 ? (
        <div className="text-center py-16"><p className="text-lg text-white">No contracts yet</p></div>
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{c.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text3)' }}>
                    <span>${c.total_amount?.toLocaleString()}</span>
                    <span>Paid: ${c.paid_amount?.toLocaleString()}</span>
                    <span>Escrow: ${c.in_escrow?.toLocaleString()}</span>
                  </div>
                  <div className="mt-3">
                    <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg3)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${c.progress || 0}%` }}
                        className="h-full rounded-full" style={{ background: 'var(--blue)' }} />
                    </div>
                    <span className="text-xs mt-1" style={{ color: 'var(--text3)' }}>{c.progress || 0}% complete</span>
                  </div>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium capitalize" style={{ background: `${statusColors[c.status]}20`, color: statusColors[c.status] || '#94A3B8' }}>
                  {c.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
