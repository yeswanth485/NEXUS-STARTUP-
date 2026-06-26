'use client'
import { useState, useEffect, useCallback } from 'react'
import { DollarSign, CreditCard, Lock, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { MetricCard } from '../MetricCard'
import api from '@/lib/api'

export function PaymentsTab() {
  const { profile } = useAuth()
  const [data, setData] = useState<any>({ loading: true, contracts: [], totalPaid: 0, inEscrow: 0 })

  const fetchData = useCallback(async () => {
    try {
      const { data: contracts } = await api.get('/contracts')
      const list = contracts || []
      setData({
        loading: false,
        contracts: list,
        totalPaid: list.reduce((s: number, c: any) => s + (c.paid_amount || 0), 0),
        inEscrow: list.reduce((s: number, c: any) => s + (c.in_escrow || 0), 0),
      })
    } catch { setData((prev: any) => ({ ...prev, loading: false })) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const cards = [
    { label: 'Total Paid', value: `$${data.totalPaid.toLocaleString()}`, icon: DollarSign, color: '#10B981' },
    { label: 'In Escrow', value: `$${data.inEscrow.toLocaleString()}`, icon: Lock, color: '#F59E0B' },
    { label: 'Active Contracts', value: String(data.contracts.filter((c: any) => c.status === 'active').length), icon: CreditCard, color: '#2563EB' },
    { label: 'Completed', value: String(data.contracts.filter((c: any) => c.status === 'completed').length), icon: CheckCircle, color: '#8B5CF6' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Payments</h2>
      {data.loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--card)' }} />)}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(c => <MetricCard key={c.label} {...c} />)}
          </div>
          <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Recent Transactions</h3>
            {data.contracts.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text3)' }}>No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {data.contracts.slice(0, 10).map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="text-sm font-medium text-white">{c.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text3)' }}>{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">${(c.total_amount || 0).toLocaleString()}</p>
                      <p className="text-xs" style={{ color: c.paid_amount ? '#34D399' : '#FBBF24' }}>{c.paid_amount ? 'Paid' : 'Pending'}</p>
                    </div>
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
