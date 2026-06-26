'use client'
import { useState, useEffect } from 'react'
import { ConversationList } from '@/components/chat/ConversationList'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConv, setActiveConv] = useState<string>()

  useEffect(() => {
    if (!loading && !user) return router.push('/?auth=signin')
    api.get('/messages/conversations').then(({ data }) => setConversations(data || [])).catch(() => {})
  }, [user, loading, router])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const convId = params.get('conv')
    if (convId) setActiveConv(convId)
  }, [])

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="h-[calc(100vh-64px)] flex" style={{ background: 'var(--bg)' }}>
      <div className="w-80 border-r shrink-0" style={{ borderColor: 'var(--border)' }}>
        <ConversationList conversations={conversations} activeId={activeConv} onSelect={setActiveConv} />
      </div>
      <div className="flex-1">
        <ChatWindow conversationId={activeConv} />
      </div>
    </div>
  )
}
