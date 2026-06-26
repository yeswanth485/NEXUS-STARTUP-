'use client'
import { Search } from 'lucide-react'

export function ConversationList({ conversations, activeId, onSelect }: { conversations: any[]; activeId?: string; onSelect: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-lg font-bold text-white mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
          <input placeholder="Search conversations..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: 'var(--text3)' }}>No conversations yet</div>
        ) : (
          conversations.map((conv) => {
            const other = conv.participants?.find((p: any) => p.id !== 'current') || conv.other_user
            const isActive = conv.id === activeId
            return (
              <button key={conv.id} onClick={() => onSelect(conv.id)}
                className="w-full p-4 flex items-start gap-3 text-left transition-all border-b" style={{ borderColor: 'var(--border)', background: isActive ? 'rgba(37,99,235,0.1)' : 'transparent' }}>
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {(other?.full_name || '?')[0]}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ background: other?.is_available ? 'var(--success)' : 'var(--text4)', borderColor: 'var(--bg2)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white truncate">{other?.full_name || 'User'}</p>
                    <span className="text-[10px] shrink-0" style={{ color: 'var(--text4)' }}>{conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString() : ''}</span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text3)' }}>{conv.last_message || 'No messages yet'}</p>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
