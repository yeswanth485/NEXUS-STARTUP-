'use client'
import { useState } from 'react'
import { Globe, MapPin, Calendar, Users, Star, MessageCircle } from 'lucide-react'
import { PortfolioGrid } from './PortfolioGrid'
import { TeamGrid } from './TeamGrid'
import { ReviewsList } from './ReviewsList'
import { useAuth } from '@/providers/AuthProvider'

export function StartupProfile({ profile }: { profile: any }) {
  const [tab, setTab] = useState('about')
  const { user } = useAuth()
  const tabs = ['about', 'portfolio', 'team', 'reviews']

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border p-8" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {(profile.company_name || '?')[0]}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">{profile.company_name}</h1>
                  <p className="mt-1" style={{ color: 'var(--text3)' }}>{profile.industry} · {profile.team_size} members</p>
                  <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--text2)' }}>{profile.elevator_pitch}</p>
                  {(profile.tech_stack?.length > 0) && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {profile.tech_stack.map((t: string) => (
                        <span key={t} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--blue3)' }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm" style={{ color: 'var(--text2)' }}>
                    {profile.website_url && <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {profile.website_url}</span>}
                    {profile.founding_year > 0 && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Founded {profile.founding_year}</span>}
                  </div>
                  <div className="flex gap-3 mt-6">
                    {user && user.id !== profile.id && (
                      <button className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'var(--blue)' }}>
                        <MessageCircle className="w-4 h-4 inline mr-1" /> Connect with Team
                      </button>
                    )}
                    {profile.pitch_deck_url && (
                      <a href={profile.pitch_deck_url} target="_blank" rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl text-sm font-semibold transition-all" style={{ border: '1px solid var(--border2)', color: 'var(--text)' }}>
                        View Pitch Deck
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 mt-8 p-1 rounded-xl" style={{ background: 'var(--bg3)' }}>
                {tabs.map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize"
                    style={tab === t ? { background: 'var(--blue)', color: 'white' } : { color: 'var(--text3)' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              {tab === 'about' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                    <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{profile.elevator_pitch || 'No description yet.'}</p>
                    {(profile.services_offered?.length > 0) && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-white mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.services_offered.map((s: string) => (
                            <span key={s} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {tab === 'portfolio' && (
                <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="text-lg font-semibold text-white mb-4">Portfolio</h3>
                  <PortfolioGrid items={profile.portfolio_items} />
                </div>
              )}
              {tab === 'team' && (
                <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="text-lg font-semibold text-white mb-4">Team</h3>
                  <TeamGrid members={profile.team_members} />
                </div>
              )}
              {tab === 'reviews' && (
                <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <ReviewsList reviews={profile.reviews || []} rating={profile.rating} ratingCount={profile.rating_count} />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text3)' }}>Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[{ label: 'Projects', value: profile.jobs_completed || 0 }, { label: 'Rating', value: profile.rating || 'New' }, { label: 'Team Size', value: profile.team_size || '?' }].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg3)' }}>
                    <p className="text-lg font-bold text-white">{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
