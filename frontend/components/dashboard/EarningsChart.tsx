'use client'
import { motion } from 'framer-motion'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const data = [3200, 4800, 5600, 4200, 7100, 6300, 8400]

export function EarningsChart() {
  const max = Math.max(...data)
  return (
    <div className="p-5 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <h3 className="text-sm font-semibold text-white mb-6">Earnings Overview</h3>
      <div className="flex items-end gap-3 h-40">
        {data.map((v, i) => (
          <motion.div key={i} className="flex-1 flex flex-col items-center gap-2">
            <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-full rounded-lg relative group cursor-pointer"
              style={{ background: 'var(--blue)', maxHeight: '100%', minHeight: '4px' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                ${v.toLocaleString()}
              </div>
            </motion.div>
            <span className="text-xs" style={{ color: 'var(--text4)' }}>{months[i]}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
