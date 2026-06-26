'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useToast } from '@/components/ui/Toaster'
import api from '@/lib/api'

export function SubmitProposalModal() {
  const { submitProposalModal, setSubmitProposalModal } = useUIStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ cover_letter: '', bid_amount: '', timeline: '1 month', portfolio_link: '' })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.cover_letter || !form.bid_amount) return toast('error', 'Please fill required fields')
    setLoading(true)
    try {
      await api.post('/proposals', { ...form, project_id: submitProposalModal.projectId })
      toast('success', 'Proposal submitted!')
      setSubmitProposalModal({ open: false })
    } catch (err: any) { toast('error', err.response?.data?.error || 'Failed to submit') }
    setLoading(false)
  }

  if (!submitProposalModal.open) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg rounded-3xl border p-8" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <button onClick={() => setSubmitProposalModal({ open: false })} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5"><X className="w-5 h-5" style={{ color: 'var(--text3)' }} /></button>
          <h2 className="text-2xl font-bold text-white mb-6">Submit Proposal</h2>
          <form onSubmit={submit} className="space-y-4">
            <textarea value={form.cover_letter} onChange={e => setForm({...form, cover_letter: e.target.value})} rows={4} placeholder="Cover letter (min 100 chars) *" required className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
            <input type="number" value={form.bid_amount} onChange={e => setForm({...form, bid_amount: e.target.value})} placeholder="Your bid ($) *" required className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
            <select value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)', color: 'white'}}>
              {['<1 week','1-4 weeks','1-3 months','3-6 months','6+ months'].map(t => <option key={t} value={t} style={{background:'var(--bg3)'}}>{t}</option>)}
            </select>
            <input value={form.portfolio_link} onChange={e => setForm({...form, portfolio_link: e.target.value})} placeholder="Portfolio link (optional)" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50" style={{background:'var(--blue)'}}>
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
