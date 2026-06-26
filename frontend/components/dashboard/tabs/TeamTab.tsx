'use client'
import { useState, useEffect } from 'react'
import { Plus, Save, X, Linkedin } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useToast } from '@/components/ui/Toaster'
import api from '@/lib/api'

export function TeamTab() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [members, setMembers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', bio: '', linkedin_url: '' })

  useEffect(() => {
    api.get(`/team/startup/${user?.id}`).then(({ data }) => setMembers(data || [])).catch(() => {})
  }, [user])

  const addMember = async () => {
    try {
      const { data } = await api.post('/team', form)
      setMembers(prev => [...prev, data])
      setShowForm(false)
      setForm({ name: '', role: '', bio: '', linkedin_url: '' })
      toast('success', 'Team member added!')
    } catch (err: any) { toast('error', 'Failed to add member') }
  }

  const removeMember = async (id: string) => {
    try {
      await api.delete(`/team/${id}`)
      setMembers(prev => prev.filter(m => m.id !== id))
      toast('success', 'Member removed')
    } catch {}
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Team Members</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'var(--blue)' }}>
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>
      {showForm && (
        <div className="p-6 rounded-2xl border space-y-3" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }} />
          <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="Role (e.g. CTO, Lead Designer)" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }} />
          <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Bio" rows={2} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }} />
          <input value={form.linkedin_url} onChange={e => setForm({...form, linkedin_url: e.target.value})} placeholder="LinkedIn URL" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }} />
          <div className="flex gap-2">
            <button onClick={addMember} className="px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--blue)' }}>Save</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-sm font-semibold" style={{ color: 'var(--text2)' }}>Cancel</button>
          </div>
        </div>
      )}
      <div className="grid gap-4">
        {members.map((m) => (
          <div key={m.id} className="p-5 rounded-2xl border flex items-start gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">{(m.name || '?')[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white">{m.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{m.role}</p>
              {m.bio && <p className="text-xs mt-2" style={{ color: 'var(--text2)' }}>{m.bio}</p>}
              {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs" style={{ color: 'var(--blue)' }}><Linkedin className="w-3 h-3" /> LinkedIn</a>}
            </div>
            <button onClick={() => removeMember(m.id)} className="shrink-0 p-2 rounded-lg hover:bg-red-500/10"><X className="w-4 h-4" style={{ color: 'var(--text3)' }} /></button>
          </div>
        ))}
        {members.length === 0 && !showForm && <p className="text-sm" style={{ color: 'var(--text3)' }}>No team members yet. Add your first one!</p>}
      </div>
    </div>
  )
}
