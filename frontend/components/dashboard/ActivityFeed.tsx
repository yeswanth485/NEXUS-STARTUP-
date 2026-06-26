'use client'
import { motion } from 'framer-motion'

const icons: Record<string, string> = {
  proposal_accepted: '✅',
  payment_released: '💰',
  new_message: '💬',
  new_proposal: '📨',
  milestone_funded: '🔒',
  review_received: '⭐',
}

export function ActivityFeed({ activities }: { activities: any[] }) {
  return (
    <div className="p-5 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
      {!activities?.length ? (
        <p className="text-sm" style={{ color: 'var(--text3)' }}>No recent activity</p>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 5).map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 text-sm">
              <span className="text-lg">{icons[a.type] || '📌'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{a.title}</p>
                {a.body && <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text3)' }}>{a.body}</p>}
              </div>
              <span className="text-xs shrink-0" style={{ color: 'var(--text4)' }}>
                {new Date(a.created_at).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
