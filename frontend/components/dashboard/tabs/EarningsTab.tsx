'use client'
import { useState, useEffect, useCallback } from 'react'
import { DollarSign, TrendingUp, Lock, Wallet, ArrowDown, ArrowUp } from 'lucide-react'
import { MetricCard } from '../MetricCard'
import { useAuth } from '@/providers/AuthProvider'
import api from '@/lib/api'

export function EarningsTab() {
  const { profile } = useAuth()
  const [data, setData] = useState<any>({ loading: true, total: 0, monthly: 0, escrow: 0, available: 0, history: [] })

  const fetchEarnings = useCallback(async () => {
    try {
      const { data: contracts } = await api.get('/contracts')
      const list = contracts || []
      const total = list.reduce((sum: number, c: any) => sum + (c.paid_amount || 0), 0)
      const escrow = list.reduce((sum: number, c: any) => sum + (c.in_escrow || 0), 0)
      const monthly = list
        .filter((c: any) => {
          const d = new Date(c.updated_at || c.created_at)
          const now = new Date()
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        })
        .reduce((sum: number, c: any) => sum + (c.paid_amount || 0), 0)

      setData({ loading: false, total, monthly, escrow, available: total - escrow, history: list })
    } catch { setData((prev: any) => ({ ...prev, loading: false })) }
  }, [])

  useEffect(() => { fetchEarnings() }, [fetchEarnings])

  const summaryCards = [
    { label: 'Total Earned', value: `$${data.total.toLocaleString()}`, icon: DollarSign, color: '#10B981' },
    { label: 'This Month', value: `$${data.monthly.toLocaleString()}`, icon: TrendingUp, color: '#2563EB' },
    { label: 'In Escrow', value: `$${data.escrow.toLocaleString()}`, icon: Lock, color: '#F59E0B' },
    { label: 'Available', value: `$${data.available.toLocaleString()}`, icon: Wallet, color: '#8B5CF6' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Earnings</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>Your payment summary</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'var(--blue)' }}>Withdraw</button>
      </div>
      {data.loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--card)' }} />)}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((c) => <MetricCard key={c.label} {...c} />)}
          </div>
          <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Payment History</h3>
            {data.history.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text3)' }}>No payment history yet</p>
            ) : (
              <div className="space-y-3">
                {data.history.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.paid_amount ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)' }}>
                        {c.paid_amount ? <ArrowDown className="w-4 h-4 text-green-400" /> : <ArrowUp className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{c.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text3)' }}>{new Date(c.updated_at || c.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: c.paid_amount ? '#34D399' : '#FBBF24' }}>
                      {c.paid_amount ? '+' : ''}${(c.paid_amount || c.in_escrow || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
