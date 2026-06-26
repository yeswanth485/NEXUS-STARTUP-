'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { useUIStore } from '@/store/uiStore'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import { Menu, X, Bell, MessageCircle, ChevronDown, LogOut, User, LayoutDashboard, Compass, Rocket, Briefcase } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/marketplace', label: 'Marketplace', icon: Compass },
  { href: '/freelancers', label: 'Freelancers', icon: User },
  { href: '/startups', label: 'Startups', icon: Rocket },
]

export function Navbar() {
  const { user, profile, loading, signOut } = useAuth()
  const { unreadCount } = useNotifications()
  const setAuthModal = useUIStore((s) => s.setAuthModal)
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--text)' }}>Nexus</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {user && (
              <Link href="/dashboard"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname === '/dashboard'
                    ? 'text-white bg-blue-500/20'
                    : 'hover:text-white hover:bg-white/5'
                )}
                style={{ color: pathname === '/dashboard' ? undefined : 'var(--text2)' }}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname.startsWith(link.href)
                    ? 'text-white bg-blue-500/20'
                    : 'hover:text-white hover:bg-white/5'
                )}
                style={{ color: pathname.startsWith(link.href) ? undefined : 'var(--text2)' }}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {loading ? null : user ? (
              <div className="flex items-center gap-2">
                <Link href="/chat" className="relative p-2 rounded-xl hover:bg-white/5 transition-all">
                  <MessageCircle className="w-5 h-5" style={{ color: 'var(--text2)' }} />
                </Link>
                <Link href="/dashboard" className="relative p-2 rounded-xl hover:bg-white/5 transition-all">
                  <Bell className="w-5 h-5" style={{ color: 'var(--text2)' }} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                      {profile?.full_name?.[0] || user.email?.[0] || 'U'}
                    </div>
                    <ChevronDown className="w-4 h-4" style={{ color: 'var(--text3)' }} />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border overflow-hidden z-20"
                        style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
                      >
                        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                          <p className="text-sm font-semibold text-white truncate">{profile?.full_name || 'User'}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--text3)' }}>{user.email}</p>
                        </div>
                        <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-all" style={{ color: 'var(--text2)' }}>
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/chat" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-all" style={{ color: 'var(--text2)' }}>
                          <MessageCircle className="w-4 h-4" /> Messages
                        </Link>
                        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                          <button onClick={() => { signOut(); setProfileOpen(false) }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setAuthModal('signin')}
                  className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-all" style={{ color: 'var(--text2)' }}>
                  Sign In
                </button>
                <button onClick={() => setAuthModal('signup')}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{ background: 'var(--blue)' }}>
                  Get Started
                </button>
              </div>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-all">
              {mobileOpen ? <X className="w-5 h-5" style={{ color: 'var(--text)' }} /> : <Menu className="w-5 h-5" style={{ color: 'var(--text)' }} />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-3 space-y-1">
              {user && (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: 'var(--text2)' }}>
                  <LayoutDashboard className="w-5 h-5" style={{ color: 'var(--text3)' }} />
                  Dashboard
                </Link>
              )}
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: 'var(--text2)' }}>
                  <link.icon className="w-5 h-5" style={{ color: 'var(--text3)' }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
