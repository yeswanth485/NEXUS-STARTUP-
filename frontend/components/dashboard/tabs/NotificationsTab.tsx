'use client'
import { useNotifications } from '@/hooks/useNotifications'
import { CheckCheck } from 'lucide-react'

export function NotificationsTab() {
  const { notifications, markRead, markAllRead } = useNotifications()

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Notifications</h2>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text3)' }}>No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} onClick={() => !n.read && markRead(n.id)}
              className="p-4 rounded-xl border cursor-pointer transition-all"
              style={n.read ? { background: 'var(--card)', borderColor: 'var(--border)' } : { background: 'rgba(37,99,235,0.05)', borderColor: 'rgba(37,99,235,0.2)' }}>
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{n.title}</p>
                  {n.body && <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{n.body}</p>}
                </div>
                <span className="text-xs shrink-0 ml-auto" style={{ color: 'var(--text4)' }}>
                  {new Date(n.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
