'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useToast } from '@/components/ui/Toaster'
import api from '@/lib/api'

export function HireModal() {
  const { hireModal, setHireModal } = useUIStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const hire = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/messages/conversations', { other_user_id: hireModal.freelancerId })
      if (message) {
        const socket = (await import('@/lib/socket')).getSocket()
        socket.emit('send_message', { conversationId: data.id, content: message })
      }
      toast('success', 'Conversation started!', 'Check your messages.')
      setHireModal({ open: false })
    } catch (err: any) { toast('error', err.response?.data?.error || 'Failed') }
    setLoading(false)
  }

  if (!hireModal.open) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md rounded-3xl border p-8" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <button onClick={() => setHireModal({ open: false })} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5"><X className="w-5 h-5" style={{ color: 'var(--text3)' }} /></button>
          <h2 className="text-2xl font-bold text-white mb-2">Hire Freelancer</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text2)' }}>Send a message to get started</p>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Hi! I am interested in working with you..." className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
          <div className="flex gap-3 mt-4">
            <button onClick={hire} disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50" style={{background:'var(--blue)'}}>
              {loading ? 'Sending...' : 'Send & Connect'}
            </button>
            <button onClick={() => setHireModal({ open: false })} className="px-6 py-3 rounded-xl text-sm font-semibold transition-all" style={{border:'1px solid var(--border)', color:'var(--text2)'}}>Cancel</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
