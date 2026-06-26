'use client'
import { useState } from 'react'
import { MapPin, Clock, Briefcase, Globe, DollarSign, Star, MessageCircle, CheckCircle } from 'lucide-react'
import { PortfolioGrid } from './PortfolioGrid'
import { ReviewsList } from './ReviewsList'
import { WorkHistory } from './WorkHistory'
import { useAuth } from '@/providers/AuthProvider'
import { useUIStore } from '@/store/uiStore'

export function FreelancerProfile({ profile }: { profile: any }) {
  const [tab, setTab] = useState('overview')
  const { user } = useAuth()
  const setHireModal = useUIStore((s) => s.setHireModal)

  const tabs = ['overview', 'portfolio', 'reviews', 'work history']

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Hero */}
            <div className="rounded-2xl border p-8" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {(profile.full_name || '?')[0]}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">{profile.full_name}</h1>
                  <p className="mt-1" style={{ color: 'var(--text3)' }}>{profile.title}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(profile.badges || []).map((b: string) => (
                      <span key={b} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--gold)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--text2)' }}>{profile.bio}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm" style={{ color: 'var(--text2)' }}>
                    {profile.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>}
                    {profile.experience_years > 0 && <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {profile.experience_years} years exp.</span>}
                    {profile.hourly_rate > 0 && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${profile.hourly_rate}/hr</span>}
                  </div>
                  <div className="flex gap-3 mt-6">
                    {user && user.id !== profile.id && (
                      <>
                        <button onClick={() => setHireModal({ open: true, freelancerId: profile.id })}
                          className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                          style={{ background: 'var(--blue)' }}>Hire {profile.full_name?.split(' ')[0]}</button>
                        <button
                          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                          style={{ border: '1px solid var(--border2)', color: 'var(--text)' }}>
                          <MessageCircle className="w-4 h-4" /> Message
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-8 p-1 rounded-xl" style={{ background: 'var(--bg3)' }}>
                {tabs.map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize"
                    style={tab === t ? { background: 'var(--blue)', color: 'white' } : { color: 'var(--text3)' }}>
                    {t}{t === 'reviews' && profile.rating_count ? ` (${profile.rating_count})` : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                    <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{profile.bio || 'No bio yet.'}</p>
                  </div>
                  {(profile.skills?.length > 0) && (
                    <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                      <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((s: string) => (
                          <span key={s} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--blue3)' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {tab === 'portfolio' && (
                <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="text-lg font-semibold text-white mb-4">Portfolio</h3>
                  <PortfolioGrid items={profile.portfolio_items} />
                </div>
              )}
              {tab === 'reviews' && (
                <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <ReviewsList reviews={profile.reviews || []} rating={profile.rating} ratingCount={profile.rating_count} />
                </div>
              )}
              {tab === 'work history' && (
                <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="text-lg font-semibold text-white mb-4">Work History</h3>
                  <WorkHistory contracts={[]} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text3)' }}>At a Glance</h3>
              <div className="grid grid-cols-2 gap-3">
                {[{ label: 'Hourly Rate', value: `$${profile.hourly_rate || 0}/hr` }, { label: 'Rating', value: `${profile.rating || 0}` }, { label: 'Projects', value: `${profile.jobs_completed || 0}` }, { label: 'Success', value: `${profile.job_success_rate || 100}%` }].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg3)' }}>
                    <p className="text-lg font-bold text-white">{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: profile.is_available ? 'var(--success)' : 'var(--text4)' }} />
                <span style={{ color: 'var(--text2)' }}>{profile.is_available ? 'Available for new projects' : 'Not available'}</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text3)' }}>Verification</h3>
              <div className="space-y-2">
                {[{ label: 'Email Verified', done: profile.verified_email }, { label: 'Identity Verified', done: profile.verified_identity }].map((v) => (
                  <div key={v.label} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" style={{ color: v.done ? 'var(--success)' : 'var(--text4)' }} />
                    <span style={{ color: v.done ? 'var(--text)' : 'var(--text3)' }}>{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setHireModal({ open: true, freelancerId: profile.id })}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'var(--blue)' }}>Hire Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}
