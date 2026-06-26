'use client'

export function MessageBubble({ message, isOwn }: { message: any; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[70%] p-3 rounded-2xl ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'}`}
        style={isOwn ? { background: 'var(--blue)' } : { background: 'var(--bg3)' }}>
        <p className="text-sm text-white">{message.content}</p>
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[10px]" style={{ color: isOwn ? 'rgba(255,255,255,0.7)' : 'var(--text4)' }}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOwn && message.read_by?.length > 1 && <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>✓✓</span>}
        </div>
      </div>
    </div>
  )
}
