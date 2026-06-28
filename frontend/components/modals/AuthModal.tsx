'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, Mail, Lock, Github } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useUIStore } from '@/store/uiStore'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'

export function AuthModal() {
  const { authModal, setAuthModal } = useUIStore()
  const { signUp, signIn, signInWithOAuth } = useAuth()
  const { toast } = useToast()
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })

  useEffect(() => {
    if (authModal) {
      setTab(authModal)
      setRedirecting(false)
    }
  }, [authModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (tab === 'signup') {
        const name = `${form.firstName} ${form.lastName}`.trim()
        await signUp(form.email, form.password, name)
        toast('success', 'Account created!', 'Redirecting to setup...')
        setRedirecting(true)
      } else {
        await signIn(form.email, form.password)
        toast('success', 'Welcome back!')
        setRedirecting(true)
      }
    } catch (err: any) {
      toast('error', err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  if (!authModal) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md rounded-3xl border p-8 relative"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          {!redirecting && (
            <button onClick={() => setAuthModal(null)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 transition-all">
              <X className="w-5 h-5" style={{ color: 'var(--text3)' }} />
            </button>
          )}
          <h2 className="text-2xl font-bold text-white mb-6">
            {redirecting ? 'Redirecting...' : tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          {redirecting ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm" style={{ color: 'var(--text2)' }}>Taking you to your dashboard...</p>
            </div>
          ) : (
            <>
              <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg3)' }}>
                <button onClick={() => setTab('signin')} className={cn('flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all',
                  tab === 'signin' ? 'bg-blue-500 text-white' : 'text-gray-400')}>Sign In</button>
                <button onClick={() => setTab('signup')} className={cn('flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all',
                  tab === 'signup' ? 'bg-blue-500 text-white' : 'text-gray-400')}>Sign Up</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'signup' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>First Name</label>
                      <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                        style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Last Name</label>
                      <input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                        style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text2)' }}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
                    <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                      className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white outline-none transition-all"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff className="w-4 h-4" style={{ color: 'var(--text3)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--text3)' }} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
                  style={{ background: 'var(--blue)' }}>
                  {loading ? 'Loading...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: 'var(--border)' }} /></div>
                <div className="relative flex justify-center"><span className="px-3 text-xs" style={{ background: 'var(--bg2)', color: 'var(--text3)' }}>or continue with</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => signInWithOAuth('google')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                  style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button onClick={() => signInWithOAuth('github')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                  style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
                  <Github className="w-5 h-5" /> GitHub
                </button>
              </div>
              {tab === 'signin' && (
                <p className="text-center mt-4 text-xs" style={{ color: 'var(--text3)' }}>
                  Don't have an account?{' '}
                  <button onClick={() => setTab('signup')} className="font-semibold" style={{ color: 'var(--blue)' }}>Sign up</button>
                </p>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
