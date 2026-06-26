'use client'
import { DollarSign, TrendingUp, Lock, Wallet } from 'lucide-react'
import { MetricCard } from '../MetricCard'

export function EarningsTab() {
  const summaryCards = [
    { label: 'Total Earned', value: '$48,200', icon: DollarSign, color: '#10B981' },
    { label: 'This Month', value: '$6,400', icon: TrendingUp, color: '#2563EB' },
    { label: 'In Escrow', value: '$3,200', icon: Lock, color: '#F59E0B' },
    { label: 'Available', value: '$2,100', icon: Wallet, color: '#8B5CF6' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Earnings</h2>
        <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'var(--blue)' }}>Withdraw</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => <MetricCard key={c.label} {...c} />)}
      </div>
      <div className="p-6 rounded-2xl border text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold text-white mb-4">Payment History</h3>
        <p className="text-sm" style={{ color: 'var(--text3)' }}>No payment history yet</p>
      </div>
    </div>
  )
}
