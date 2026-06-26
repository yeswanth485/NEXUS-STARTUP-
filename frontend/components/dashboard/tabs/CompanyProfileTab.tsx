'use client'
import { useState } from 'react'
import { Save, X } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toaster'
import api from '@/lib/api'

export function CompanyProfileTab() {
  const { profile } = useAuth()
  const setProfile = useAuthStore((s) => s.setProfile)
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState({ tech: '', services: '' })
  const [form, setForm] = useState<any>({
    company_name: profile?.company_name || '',
    elevator_pitch: profile?.elevator_pitch || '',
    industry: profile?.industry || '',
    tech_stack: profile?.tech_stack || [],
    services_offered: profile?.services_offered || [],
    team_size: profile?.team_size || 1,
    founding_year: profile?.founding_year || new Date().getFullYear(),
    website_url: profile?.website_url || '',
    pitch_deck_url: profile?.pitch_deck_url || '',
  })

  const addTag = (key: string) => {
    const val = key === 'tech_stack' ? tagInput.tech : tagInput.services
    if (val && !form[key].includes(val.trim())) {
      setForm((prev: any) => ({ ...prev, [key]: [...prev[key], val.trim()] }))
      setTagInput((prev) => ({ ...prev, [key === 'tech_stack' ? 'tech' : 'services']: '' }))
    }
  }

  const removeTag = (key: string, tag: string) => {
    setForm((prev: any) => ({ ...prev, [key]: prev[key].filter((t: string) => t !== tag) }))
  }

  const save = async () => {
    setSaving(true)
    try {
      const { data } = await api.patch('/profiles/me', form)
      setProfile(data)
      toast('success', 'Company profile updated!')
    } catch (err: any) { toast('error', err.response?.data?.error || 'Failed to save') }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-bold text-white">Company Profile</h2>
      <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-2 gap-3">
          <input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} placeholder="Company name" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <textarea value={form.elevator_pitch} onChange={e => setForm({...form, elevator_pitch: e.target.value})} rows={3} placeholder="Elevator pitch" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none resize-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <select value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="col-span-2 px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: form.industry ? 'white' : 'var(--text3)' }}>
            <option value="" style={{background:'var(--bg3)'}}>Select industry</option>
            {['Tech','Finance','Healthcare','E-Commerce','Media','Other'].map(i => <option key={i} value={i} style={{background:'var(--bg3)'}}>{i}</option>)}
          </select>
          <div><label className="text-xs font-medium mb-1.5 block" style={{color:'var(--text2)'}}>Team Size</label><input type="number" value={form.team_size} onChange={e => setForm({...form, team_size: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} /></div>
          <div><label className="text-xs font-medium mb-1.5 block" style={{color:'var(--text2)'}}>Founding Year</label><input type="number" value={form.founding_year} onChange={e => setForm({...form, founding_year: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} /></div>
          <input value={form.website_url} onChange={e => setForm({...form, website_url: e.target.value})} placeholder="Website URL" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
          <input value={form.pitch_deck_url} onChange={e => setForm({...form, pitch_deck_url: e.target.value})} placeholder="Pitch deck URL" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
          <div className="col-span-2">
            <label className="text-xs font-medium mb-1.5 block" style={{color:'var(--text2)'}}>Tech Stack</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tech_stack.map((s: string) => <span key={s} className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{background:'rgba(37,99,235,0.15)',color:'var(--blue3)'}}>{s} <button onClick={() => removeTag('tech_stack', s)}><X className="w-3 h-3" /></button></span>)}
            </div>
            <input value={tagInput.tech} onChange={e => setTagInput(prev => ({...prev, tech: e.target.value}))} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('tech_stack'))} placeholder="Add technology" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium mb-1.5 block" style={{color:'var(--text2)'}}>Services Offered</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.services_offered.map((s: string) => <span key={s} className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{background:'rgba(37,99,235,0.15)',color:'var(--blue3)'}}>{s} <button onClick={() => removeTag('services_offered', s)}><X className="w-3 h-3" /></button></span>)}
            </div>
            <input value={tagInput.services} onChange={e => setTagInput(prev => ({...prev, services: e.target.value}))} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('services_offered'))} placeholder="Add service" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:'var(--bg3)',border:'1px solid var(--border)'}} />
          </div>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50" style={{background:'var(--blue)'}}><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </div>
  )
}
