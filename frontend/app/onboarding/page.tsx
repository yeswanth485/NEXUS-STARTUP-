'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Check, ArrowLeft, ArrowRight, Building2, Briefcase, Rocket, Sparkles } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toaster'
import api from '@/lib/api'
import confetti from 'canvas-confetti'

const roles = [
  { id: 'client', label: 'Client', icon: Building2, desc: 'I need to hire talent for my projects' },
  { id: 'freelancer', label: 'Freelancer', icon: Briefcase, desc: 'I want to offer my skills and find work' },
  { id: 'startup', label: 'Startup Founder', icon: Rocket, desc: 'I lead a team and want to win clients' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { supabase } = useAuth()
  const { toast } = useToast()
  const setProfile = useAuthStore((s) => s.setProfile)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<any>({
    full_name: '', avatar_url: '', role: '',
    title: '', bio: '', hourly_rate: 50, skills: [], experience_years: 1, location: '', timezone: '', languages: [],
    company_name: '', industry: '', typical_budget: '', looking_to_build: '',
    team_size: 1, founding_year: new Date().getFullYear(), services_offered: [], tech_stack: [], elevator_pitch: '', website_url: '', pitch_deck_url: '',
  })

  const [tagInput, setTagInput] = useState('')

  const updateProfile = async (data: any) => {
    setLoading(true)
    try {
      const { data: result } = await api.post('/auth/complete-onboarding', data)
      setProfile(result)
      return result
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Something went wrong')
    } finally { setLoading(false) }
  }

  const uploadAvatar = async (file: File) => {
    setLoading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `avatars/${Date.now()}.${ext}`
      const { data: upload, error } = await supabase.storage.from('avatars').upload(path, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      await updateProfile({ step: 4, avatar_url: publicUrl })
      setForm((prev: any) => ({ ...prev, avatar_url: publicUrl }))
      toast('success', 'Photo uploaded!', 'Your avatar has been updated successfully.')
    } catch (err: any) {
      toast('error', 'Upload failed', err.message || 'Could not upload image. Please try again.')
    } finally { setLoading(false) }
  }

  const nextStep = async () => {
    if (step === 1) {
      if (!form.full_name.trim()) return toast('error', 'Please enter your name')
      await updateProfile({ step: 1, full_name: form.full_name, avatar_url: form.avatar_url })
    } else if (step === 2) {
      if (!form.role) return toast('error', 'Please select a role')
      await updateProfile({ step: 2, role: form.role })
    }
    setStep(s => Math.min(s + 1, 5))
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      const roleData: any = { step: 5, onboarding_complete: true }
      if (form.role === 'client') {
        Object.assign(roleData, { company_name: form.company_name, industry: form.industry, typical_budget: form.typical_budget, looking_to_build: form.looking_to_build })
      } else if (form.role === 'freelancer') {
        Object.assign(roleData, { title: form.title, bio: form.bio, hourly_rate: form.hourly_rate, skills: form.skills, experience_years: form.experience_years, location: form.location, timezone: form.timezone, languages: form.languages })
      } else if (form.role === 'startup') {
        Object.assign(roleData, { company_name: form.company_name, elevator_pitch: form.elevator_pitch, industry: form.industry, team_size: form.team_size, founding_year: form.founding_year, tech_stack: form.tech_stack, services_offered: form.services_offered, website_url: form.website_url, pitch_deck_url: form.pitch_deck_url })
      }
      await updateProfile(roleData)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      setTimeout(() => router.push('/dashboard'), 3000)
    } finally { setLoading(false) }
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="w-10 h-1 rounded-full transition-all duration-300"
              style={{ background: s <= step ? 'var(--blue)' : 'var(--bg4)' }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl border p-8" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold text-white">Welcome to Nexus</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text2)' }}>Let us get started. What should we call you?</p>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Full Name</label>
                  <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                    style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                </div>
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Profile Photo (optional)</label>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
                  {form.avatar_url ? (
                    <div className="flex items-center gap-4">
                      <img src={form.avatar_url} alt="Avatar preview" className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: 'var(--blue)' }} />
                      <div className="flex flex-col gap-2">
                        <button onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
                          style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
                          <Upload className="w-4 h-4" /> Change Photo
                        </button>
                        <span className="text-xs" style={{ color: '#22c55e' }}>Uploaded successfully</span>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all"
                      style={{ border: '1px dashed var(--border2)', color: 'var(--text2)' }}>
                      <Upload className="w-4 h-4" /> Upload Photo
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={nextStep} disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: 'var(--blue)' }}>
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl border p-8" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold text-white">What brings you here?</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text2)' }}>Choose the option that best describes you</p>
              <div className="grid gap-4 mt-6">
                {roles.map((r) => {
                  const Icon = r.icon
                  return (
                    <button key={r.id} onClick={() => { setForm({...form, role: r.id}); setStep(3) }}
                      className="flex items-center gap-4 p-5 rounded-2xl border text-left transition-all"
                      style={form.role === r.id
                        ? { background: 'rgba(37,99,235,0.1)', borderColor: 'var(--blue)' }
                        : { background: 'var(--card)', borderColor: 'var(--border)' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.15)' }}>
                        <Icon className="w-6 h-6" style={{ color: 'var(--blue)' }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{r.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{r.desc}</p>
                      </div>
                      {form.role === r.id && <Check className="w-5 h-5" style={{ color: 'var(--blue)' }} />}
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ color: 'var(--text2)' }}><ArrowLeft className="w-4 h-4" /> Back</button>
              </div>
            </motion.div>
          )}

          {step === 3 && form.role === 'freelancer' && (
            <motion.div key="step3f" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl border p-8" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold text-white">Build your profile</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text2)' }}>Tell us about your skills and experience</p>
              <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2">
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Professional title (e.g. Senior Full-Stack Developer)"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                <div className="relative">
                  <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} maxLength={500} rows={3} placeholder="Bio (max 500 chars)"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none"
                    style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                  <span className="absolute bottom-3 right-3 text-xs" style={{ color: 'var(--text4)' }}>{form.bio?.length || 0}/500</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Hourly Rate ($)</label>
                    <input type="number" value={form.hourly_rate} onChange={e => setForm({...form, hourly_rate: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Experience (years)</label>
                    <input type="number" value={form.experience_years} onChange={e => setForm({...form, experience_years: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                  </div>
                </div>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Location (City, Country)"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Skills (press Enter to add)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.skills.map((s: string) => (
                      <span key={s} className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{ background: 'rgba(37,99,235,0.15)', color: 'var(--blue3)' }}>
                        {s} <button onClick={() => removeTag('skills', s)}>&times;</button>
                      </span>
                    ))}
                  </div>
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag('skills')} placeholder="Type and press Enter"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ color: 'var(--text2)' }}><ArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => { setStep(4); updateProfile({ step: 3, title: form.title, bio: form.bio, hourly_rate: form.hourly_rate, skills: form.skills, experience_years: form.experience_years, location: form.location }) }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'var(--blue)' }}>Next <ArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {step === 3 && form.role === 'client' && (
            <motion.div key="step3c" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl border p-8" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold text-white">Tell us about your needs</h2>
              <div className="mt-6 space-y-4">
                <input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} placeholder="Company name"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                <select value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: form.industry ? 'white' : 'var(--text3)' }}>
                  <option value="" style={{background:'var(--bg3)'}}>Select industry</option>
                  {['Tech', 'Finance', 'Healthcare', 'E-Commerce', 'Media', 'Other'].map(i => (
                    <option key={i} value={i} style={{background:'var(--bg3)'}}>{i}</option>
                  ))}
                </select>
                <select value={form.typical_budget} onChange={e => setForm({...form, typical_budget: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                  <option value="" style={{background:'var(--bg3)'}}>Typical project budget</option>
                  {['<$5K', '$5K-$20K', '$20K-$100K', '$100K+'].map(b => (
                    <option key={b} value={b} style={{background:'var(--bg3)'}}>{b}</option>
                  ))}
                </select>
                <textarea value={form.looking_to_build} onChange={e => setForm({...form, looking_to_build: e.target.value})} rows={3} placeholder="What are you looking to build?"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ color: 'var(--text2)' }}><ArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => { setStep(4); updateProfile({ step: 3, company_name: form.company_name, industry: form.industry, typical_budget: form.typical_budget, looking_to_build: form.looking_to_build }) }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'var(--blue)' }}>Next <ArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {step === 3 && form.role === 'startup' && (
            <motion.div key="step3s" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl border p-8" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold text-white">Pitch your company</h2>
              <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} placeholder="Company name"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                  <select value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: form.industry ? 'white' : 'var(--text3)' }}>
                    <option value="" style={{background:'var(--bg3)'}}>Industry</option>
                    {['Tech', 'Finance', 'Healthcare', 'E-Commerce', 'Media', 'Other'].map(i => (
                      <option key={i} value={i} style={{background:'var(--bg3)'}}>{i}</option>
                    ))}
                  </select>
                </div>
                <textarea value={form.elevator_pitch} onChange={e => setForm({...form, elevator_pitch: e.target.value})} rows={3} placeholder="Elevator pitch — describe your company in 2-3 sentences"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Team Size</label>
                    <input type="number" value={form.team_size} onChange={e => setForm({...form, team_size: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Founding Year</label>
                    <input type="number" value={form.founding_year} onChange={e => setForm({...form, founding_year: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                  </div>
                </div>
                <input value={form.website_url} onChange={e => setForm({...form, website_url: e.target.value})} placeholder="Website URL"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                <input value={form.pitch_deck_url} onChange={e => setForm({...form, pitch_deck_url: e.target.value})} placeholder="Pitch deck URL (optional)"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ color: 'var(--text2)' }}><ArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => { setStep(4); updateProfile({ step: 3, company_name: form.company_name, elevator_pitch: form.elevator_pitch, industry: form.industry, team_size: form.team_size, founding_year: form.founding_year, website_url: form.website_url, pitch_deck_url: form.pitch_deck_url }) }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'var(--blue)' }}>Next <ArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl border p-8" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold text-white">Verify your details</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text2)' }}>Review the information below</p>
              <div className="mt-6 p-6 rounded-2xl" style={{ background: 'var(--bg3)' }}>
                <div className="space-y-3 text-sm">
                  <div><span className="font-medium text-white">Name:</span> <span style={{ color: 'var(--text2)' }}>{form.full_name}</span></div>
                  <div><span className="font-medium text-white">Role:</span> <span style={{ color: 'var(--text2)' }}>{form.role}</span></div>
                  {form.role === 'freelancer' && (
                    <>
                      <div><span className="font-medium text-white">Title:</span> <span style={{ color: 'var(--text2)' }}>{form.title}</span></div>
                      <div><span className="font-medium text-white">Hourly Rate:</span> <span style={{ color: 'var(--text2)' }}>${form.hourly_rate}/hr</span></div>
                    </>
                  )}
                  {form.company_name && <div><span className="font-medium text-white">Company:</span> <span style={{ color: 'var(--text2)' }}>{form.company_name}</span></div>}
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ color: 'var(--text2)' }}><ArrowLeft className="w-4 h-4" /> Edit</button>
                <button onClick={completeOnboarding} disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: 'var(--blue)' }}>
                  {loading ? 'Saving...' : 'Looks good!'} <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border p-8 text-center" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(37,99,235,0.15)' }}>
                <Sparkles className="w-10 h-10" style={{ color: 'var(--blue)' }} />
              </div>
              <h2 className="text-3xl font-bold text-white">You're all set!</h2>
              <p className="mt-3" style={{ color: 'var(--text2)' }}>Your profile is live. Redirecting to your dashboard...</p>
              <div className="flex justify-center gap-3 mt-8">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
