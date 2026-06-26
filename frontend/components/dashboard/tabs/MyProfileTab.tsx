'use client'
import { useState, useRef, useEffect } from 'react'
import { Upload, Save, X, Camera } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toaster'
import api from '@/lib/api'

export function MyProfileTab() {
  const { profile, supabase } = useAuth()
  const setProfile = useAuthStore((s) => s.setProfile)
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [langInput, setLangInput] = useState('')
  const [form, setForm] = useState<any>({
    full_name: '', title: '', bio: '', hourly_rate: 50, skills: [],
    experience_years: 0, location: '', timezone: '', languages: [],
    linkedin_url: '', website_url: '', github_url: '', avatar_url: '',
    is_available: true,
  })

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        hourly_rate: profile.hourly_rate || 50,
        skills: profile.skills || [],
        experience_years: profile.experience_years || 0,
        location: profile.location || '',
        timezone: profile.timezone || '',
        languages: profile.languages || [],
        linkedin_url: profile.linkedin_url || '',
        website_url: profile.website_url || '',
        github_url: profile.github_url || '',
        avatar_url: profile.avatar_url || '',
        is_available: profile.is_available ?? true,
      })
    }
  }, [profile])

  const uploadAvatar = async (file: File) => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `avatars/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('avatars').upload(path, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      setForm((prev: any) => ({ ...prev, avatar_url: publicUrl }))
      toast('success', 'Photo uploaded successfully!')
    } catch (err: any) {
      toast('error', err.message || 'Upload failed')
    } finally { setUploading(false) }
  }

  const addTag = (key: string) => {
    if (tagInput && !form[key].includes(tagInput.trim())) {
      setForm((prev: any) => ({ ...prev, [key]: [...prev[key], tagInput.trim()] }))
      setTagInput('')
    }
  }

  const removeTag = (key: string, tag: string) => {
    setForm((prev: any) => ({ ...prev, [key]: prev[key].filter((t: string) => t !== tag) }))
  }

  const addLang = () => {
    if (langInput && !form.languages.includes(langInput.trim())) {
      setForm((prev: any) => ({ ...prev, languages: [...prev.languages, langInput.trim()] }))
      setLangInput('')
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      const { data } = await api.patch('/profiles/me', form)
      setProfile(data)
      toast('success', 'Profile updated!')
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to save')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-bold text-white">My Profile</h2>
      <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <div className="relative group">
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: 'var(--border)' }} />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {(form.full_name || '?')[0]}
              </div>
            )}
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading ? <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'white transparent transparent transparent' }} /> : <Camera className="w-5 h-5 text-white" />}
            </button>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{form.full_name || 'Your Name'}</p>
            {form.title && <p className="text-sm" style={{ color: 'var(--text2)' }}>{form.title}</p>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Full name" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Professional title" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} placeholder="Bio" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none resize-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Hourly Rate ($)</label>
            <input type="number" value={form.hourly_rate} onChange={e => setForm({...form, hourly_rate: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Experience (years)</label>
            <input type="number" value={form.experience_years} onChange={e => setForm({...form, experience_years: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          </div>
          <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Location" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <input value={form.timezone} onChange={e => setForm({...form, timezone: e.target.value})} placeholder="Timezone (e.g. PST, EST, IST)" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <input value={form.website_url} onChange={e => setForm({...form, website_url: e.target.value})} placeholder="Website URL" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <input value={form.github_url} onChange={e => setForm({...form, github_url: e.target.value})} placeholder="GitHub URL" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <input value={form.linkedin_url} onChange={e => setForm({...form, linkedin_url: e.target.value})} placeholder="LinkedIn URL" className="col-span-2 px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />

          <div className="col-span-2">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.skills.map((s: string) => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ background: 'rgba(37,99,235,0.15)', color: 'var(--blue3)' }}>
                  {s} <button onClick={() => removeTag('skills', s)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('skills'))} placeholder="Add skill and press Enter" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          </div>

          <div className="col-span-2">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Languages</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.languages.map((l: string) => (
                <span key={l} className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399' }}>
                  {l} <button onClick={() => setForm((prev: any) => ({ ...prev, languages: prev.languages.filter((t: string) => t !== l) }))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <input value={langInput} onChange={e => setLangInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLang())} placeholder="Add language and press Enter" className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text2)' }}>
            <input type="checkbox" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} className="w-4 h-4 rounded" />
            Available for new projects
          </label>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50" style={{ background: 'var(--blue)' }}>
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
