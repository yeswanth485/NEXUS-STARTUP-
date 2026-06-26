'use client'
import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'

export function MessagesTab() {
  return (
    <div className="text-center py-20">
      <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text3)' }} />
      <h2 className="text-xl font-bold text-white mb-2">Your Messages</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text2)' }}>Open the full chat interface to see all your conversations</p>
      <Link href="/chat" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'var(--blue)' }}>
        Open Chat <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
