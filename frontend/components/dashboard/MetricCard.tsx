'use client'
import { motion } from 'framer-motion'

interface MetricCardProps {
  label: string
  value: string | number
  icon: any
  color?: string
}

export function MetricCard({ label, value, icon: Icon, color = 'var(--blue)' }: MetricCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text3)' }}>{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{typeof value === 'number' && label.toLowerCase().includes('rate') ? `${value}%` : value}</p>
    </motion.div>
  )
}
