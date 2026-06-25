'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Menu, X, MessageCircle, Rocket, Briefcase, Compass, ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '/marketplace', label: 'Marketplace', icon: Compass },
  { href: '/startups', label: 'Startups', icon: Rocket },
  { href: '/projects', label: 'Projects', icon: Briefcase },
];

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-surface-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-surface-900">Nexus</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-all duration-200 text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {loading ? null : user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {profile?.full_name?.[0] || user.email?.[0] || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-surface-400" />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 z-20 glass-card rounded-2xl shadow-xl border border-surface-200 py-2 animate-scale-in">
                      <div className="px-4 py-2 border-b border-surface-100">
                        <p className="text-sm font-semibold text-surface-900 truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-surface-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50" onClick={() => setProfileOpen(false)}>Dashboard</Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50" onClick={() => setProfileOpen(false)}>Profile</Link>
                      <Link href="/chat" className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50" onClick={() => setProfileOpen(false)}>Messages</Link>
                      <div className="border-t border-surface-100 mt-1 pt-1">
                        <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link href="/register" className="btn-primary text-sm">Get Started</Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-100 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className={cn(
        'md:hidden border-t border-surface-100 overflow-hidden transition-all duration-300',
        mobileOpen ? 'max-h-96' : 'max-h-0'
      )}>
        <div className="px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 hover:bg-surface-50 transition-all text-sm font-medium"
            >
              <link.icon className="w-5 h-5 text-surface-400" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
