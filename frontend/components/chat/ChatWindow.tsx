'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Phone, Video, Smile } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { useChat } from '@/hooks/useChat'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

export function ChatWindow({ conversationId }: { conversationId?: string }) {
  const { messages, setMessages, isTyping, sendMessage, sendTyping } = useChat(conversationId)
  const userId = useAuthStore((s) => s.user?.id)
  const [input, setInput] = useState('')
  const [conv, setConv] = useState<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (conversationId) {
      api.get(`/messages/${conversationId}`).then(({ data }) => {
        setMessages(data || [])
      }).catch(() => {})
      api.get(`/messages/conversations`).then(({ data }) => {
        const c = (data || []).find((x: any) => x.id === conversationId)
        setConv(c)
      }).catch(() => {})
    }
  }, [conversationId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim() || !conversationId) return
    sendMessage(input.trim())
    setInput('')
    sendTyping(false)
  }

  const other = conv?.participants?.find((p: any) => p.id !== userId)

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Your Messages</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>Select a conversation to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
            {(other?.full_name || '?')[0]}
          </div>
          {isTyping.length > 0 && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ background: 'var(--success)', borderColor: 'var(--bg2)' }} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{other?.full_name || 'User'}</p>
          <p className="text-xs" style={{ color: 'var(--text3)' }}>{isTyping.length > 0 ? 'Typing...' : (other?.is_available ? 'Online' : 'Offline')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-white/5"><Phone className="w-4 h-4" style={{ color: 'var(--text3)' }} /></button>
          <button className="p-2 rounded-xl hover:bg-white/5"><Video className="w-4 h-4" style={{ color: 'var(--text3)' }} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg: any) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === userId || msg.sender?.id === userId} />
        ))}
        {isTyping.length > 0 && (
          <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text3)' }}>
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'0s'}} />
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'0.2s'}} />
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'0.4s'}} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl hover:bg-white/5 shrink-0"><Paperclip className="w-5 h-5" style={{ color: 'var(--text3)' }} /></button>
          <div className="flex-1 relative">
            <input value={input} onChange={e => { setInput(e.target.value); sendTyping(true) }} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none pr-10" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
            <button className="absolute right-3 top-1/2 -translate-y-1/2"><Smile className="w-4 h-4" style={{ color: 'var(--text3)' }} /></button>
          </div>
          <button onClick={handleSend} className="p-3 rounded-xl shrink-0" style={{ background: 'var(--blue)' }}>
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
