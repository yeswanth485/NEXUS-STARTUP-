'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI, formatCurrency, cn } from '@/lib/utils';
import { Briefcase, FileText, MessageCircle, Star, TrendingUp, Plus, ArrowRight, User, Settings, Wallet } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';

const statCards = [
  { label: 'Active Projects', icon: Briefcase, color: 'bg-nexus-100 text-nexus-600', href: '/projects' },
  { label: 'Proposals', icon: FileText, color: 'bg-purple-100 text-purple-600', href: '/proposals' },
  { label: 'Messages', icon: MessageCircle, color: 'bg-emerald-100 text-emerald-600', href: '/chat' },
  { label: 'Earnings', icon: Wallet, color: 'bg-amber-100 text-amber-600', href: '/payments' },
];

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) loadProjects();
  }, [user, authLoading]);

  const loadProjects = async () => {
    try {
      const data = await fetchAPI('/api/projects/my');
      setProjects(data || []);
    } catch { /* ignore */ }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-surface-400">Loading...</div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {profile?.full_name?.[0] || user.email?.[0] || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-surface-900">Welcome, {profile?.full_name || 'User'}</h1>
                <p className="text-surface-500 capitalize">{profile?.role || 'Member'}</p>
              </div>
            </div>
            <Link href="/profile" className="btn-secondary text-sm"><Settings className="w-4 h-4" /> Edit Profile</Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={card.href} className="card-hover p-5 block">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', card.color)}>
                  <card.icon className="w-5 h-5" />
                </div>
                <p className="text-sm text-surface-500">{card.label}</p>
                <p className="text-xl font-bold text-surface-900">0</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900"><Briefcase className="w-5 h-5 inline mr-2 text-nexus-600" />My Projects</h2>
              <Link href="/projects/new" className="btn-ghost text-sm"><Plus className="w-4 h-4" /> New</Link>
            </div>
            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="card p-8 text-center">
                  <Briefcase className="w-10 h-10 text-surface-300 mx-auto mb-2" />
                  <p className="text-surface-400 text-sm">No projects yet</p>
                  <Link href="/projects/new" className="btn-primary mt-3 text-sm inline-flex">Post Your First Project</Link>
                </div>
              ) : (
                projects.slice(0, 3).map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="card-hover p-4 block">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-surface-900">{p.title}</p>
                        <p className="text-xs text-surface-400">{p.category} · {p.status}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-surface-300" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900"><MessageCircle className="w-5 h-5 inline mr-2 text-nexus-600" />Recent Messages</h2>
              <Link href="/chat" className="btn-ghost text-sm">View All</Link>
            </div>
            <div className="card p-8 text-center">
              <MessageCircle className="w-10 h-10 text-surface-300 mx-auto mb-2" />
              <p className="text-surface-400 text-sm">No recent messages</p>
              <Link href="/startups" className="btn-outline mt-3 text-sm inline-flex">Browse Profiles</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
