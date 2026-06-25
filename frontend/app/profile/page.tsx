'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI, getInitials, formatCurrency, cn } from '@/lib/utils';
import { Star, MapPin, Briefcase, MessageCircle, Mail, Globe, Linkedin, Edit3, Save, X, Shield, Award, Clock, CheckCircle, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

function ProfileContent() {
  const { user, profile: myProfile, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileId = searchParams.get('id');

  const [viewProfile, setViewProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  const isOwnProfile = !profileId || profileId === user?.id;

  useEffect(() => {
    if (!authLoading && !user && !profileId) { router.push('/login'); return; }
    loadProfile();
  }, [profileId, user, authLoading]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (profileId) {
        const data = await fetchAPI(`/api/profiles/${profileId}`);
        setViewProfile(data);
        setForm(data);
      } else if (myProfile) {
        setViewProfile(myProfile);
        setForm(myProfile);
      }
    } catch { setViewProfile(null); }
    setLoading(false);
  };

  const saveProfile = async () => {
    try {
      const data = await fetchAPI('/api/profiles', {
        method: 'PUT',
        body: JSON.stringify(form)
      });
      setViewProfile(data);
      setForm(data);
      setEditing(false);
    } catch (err: any) { alert(err.message); }
  };

  if (loading || authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-surface-400">Loading...</div>
    </div>
  );

  if (!viewProfile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <UserIcon className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        <p className="text-surface-400 text-lg">Profile not found</p>
      </div>
    </div>
  );

  const p = viewProfile;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-to-br from-nexus-900 to-surface-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {getInitials(p.full_name || 'U')}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{p.full_name || 'Anonymous'}</h1>
                  <p className="text-lg text-nexus-200 mt-1">{p.title || p.role}</p>
                </div>
                {isOwnProfile && (
                  <button onClick={() => editing ? setEditing(false) : setEditing(true)} className="btn-secondary text-sm bg-white/10 text-white border-white/20 hover:bg-white/20">
                    {editing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    {editing ? 'Cancel' : 'Edit'}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-nexus-200">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" />{p.rating ? `${Number(p.rating).toFixed(1)} (${p.rating_count})` : 'No ratings'}</span>
                {p.hourly_rate > 0 && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />₹{p.hourly_rate}/hr</span>}
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{p.jobs_completed || 0} jobs completed</span>
                <span className="flex items-center gap-1"><Award className="w-4 h-4" />{p.job_success_rate || 100}% success</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <h2 className="text-lg font-semibold text-surface-900 mb-4">About</h2>
              {editing ? (
                <textarea value={form.bio || ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} className="input-field resize-none" placeholder="Tell us about yourself..." />
              ) : (
                <p className="text-surface-600 leading-relaxed">{p.bio || 'No bio yet.'}</p>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <h2 className="text-lg font-semibold text-surface-900 mb-4">Skills</h2>
              {editing ? (
                <input type="text" value={(form.skills || []).join(', ')} onChange={e => setForm(f => ({ ...f, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className="input-field" placeholder="React, Node.js, TypeScript..." />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(p.skills || []).length === 0 ? <p className="text-sm text-surface-400">No skills listed</p> : p.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-nexus-100 text-nexus-700 text-sm font-medium">{skill}</span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-surface-500">Role</span>
                  <span className="font-medium text-surface-900 capitalize">{p.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-500">Plan</span>
                  <span className="font-medium text-surface-900 capitalize">{p.plan || 'Free'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-surface-500">Available</span>
                  {editing ? (
                    <button onClick={() => setForm(f => ({ ...f, is_available: !f.is_available }))} className={cn('px-3 py-1 rounded-full text-xs font-medium', form.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                      {form.is_available ? 'Yes' : 'No'}
                    </button>
                  ) : (
                    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', p.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                      {p.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {isOwnProfile && editing ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-4">Edit Fields</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">Title</label>
                    <input type="text" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">Hourly Rate (₹)</label>
                    <input type="number" value={form.hourly_rate || 0} onChange={e => setForm(f => ({ ...f, hourly_rate: Number(e.target.value) }))} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">LinkedIn URL</label>
                    <input type="url" value={form.linkedin_url || ''} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} className="input-field text-sm" />
                  </div>
                  <button onClick={saveProfile} className="btn-primary w-full text-sm"><Save className="w-4 h-4" /> Save Changes</button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-3">
                <Link href={`/chat?user=${p.id}`} className="btn-primary w-full text-sm"><MessageCircle className="w-4 h-4" /> Send Message</Link>
                {p.linkedin_url && (
                  <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-outline w-full text-sm"><Linkedin className="w-4 h-4" /> LinkedIn</a>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-surface-400">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
