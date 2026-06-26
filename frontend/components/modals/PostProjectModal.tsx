'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useToast } from '@/components/ui/Toaster'
import api from '@/lib/api'

const categories = ['Web Dev', 'Mobile', 'AI/ML', 'Design', 'Marketing', 'SaaS', 'E-Commerce']

export function PostProjectModal() {
  const { postProjectModal, setPostProjectModal } = useUIStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [form, setForm] = useState<any>({
    title: '', category: '', description: '', budget_min: '', budget_max: '',
    timeline: '1 month', experience_level: 'intermediate', project_type: 'fixed', skills_required: [],
  })

  const addTag = () => {
    if (tagInput && !form.skills_required.includes(tagInput.trim())) {
      setForm((prev: any) => ({ ...prev, skills_required: [...prev.skills_required, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.category) return toast('error', 'Please fill all required fields')
    setLoading(true)
    try {
      await api.post('/projects', form)
      toast('success', 'Project posted!', 'It will appear in the marketplace instantly.')
      setPostProjectModal(false)
    } catch (err: any) { toast('error', err.response?.data?.error || 'Failed to post') }
    setLoading(false)
  }

  if (!postProjectModal) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl rounded-3xl border p-8 relative max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <button onClick={() => setPostProjectModal(false)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5"><X className="w-5 h-5" style={{ color: 'var(--text3)' }} /></button>
          <h2 className="text-2xl font-bold text-white mb-6">Post a Project</h2>
          <form onSubmit={submit} className="space-y-4">
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Project Title *" required className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)', color: form.category ? 'white' : 'var(--text3)'}}>
              <option value="" style={{background:'var(--bg3)'}}>Select Category *</option>
              {categories.map(c => <option key={c} value={c} style={{background:'var(--bg3)'}}>{c}</option>)}
            </select>
            <div className="relative">
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} placeholder="Describe your project (min 100 chars) *" required className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
              <span className="absolute bottom-3 right-3 text-xs" style={{color:'var(--text4)'}}>{form.description.length}/100</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={form.budget_min} onChange={e => setForm({...form, budget_min: e.target.value})} placeholder="Budget Min ($)" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
              <input type="number" value={form.budget_max} onChange={e => setForm({...form, budget_max: e.target.value})} placeholder="Budget Max ($)" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)', color: 'white'}}>
                {['<1 week','1-4 weeks','1-3 months','3-6 months','6+ months'].map(t => <option key={t} value={t} style={{background:'var(--bg3)'}}>{t}</option>)}
              </select>
              <select value={form.experience_level} onChange={e => setForm({...form, experience_level: e.target.value})} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)', color: 'white'}}>
                {['entry','intermediate','expert'].map(l => <option key={l} value={l} style={{background:'var(--bg3)'}}>{l}</option>)}
              </select>
            </div>
            <div className="flex gap-3 p-1 rounded-xl" style={{background:'var(--bg3)'}}>
              <button type="button" onClick={() => setForm({...form, project_type: 'fixed'})} className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all" style={form.project_type === 'fixed' ? {background:'var(--blue)',color:'white'} : {color:'var(--text3)'}}>Fixed Price</button>
              <button type="button" onClick={() => setForm({...form, project_type: 'hourly'})} className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all" style={form.project_type === 'hourly' ? {background:'var(--blue)',color:'white'} : {color:'var(--text3)'}}>Hourly</button>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{color:'var(--text2)'}}>Required Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.skills_required.map((s: string) => <span key={s} className="px-3 py-1 rounded-full text-xs font-medium" style={{background:'rgba(37,99,235,0.15)',color:'var(--blue3)'}}>{s}</span>)}
              </div>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add skill and press Enter" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50" style={{background:'var(--blue)'}}>
              {loading ? 'Posting...' : 'Post Project'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
