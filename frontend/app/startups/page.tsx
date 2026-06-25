'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Rocket, Users, Code, MessageCircle } from 'lucide-react';
import { fetchAPI, cn } from '@/lib/utils';
import ProfileCard from '@/components/ProfileCard';
import Link from 'next/link';

export default function StartupsPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, [role]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '30' });
      if (role) params.set('role', role);
      const data = await fetchAPI(`/api/profiles?${params}`);
      setProfiles(data.data || []);
    } catch {
      setProfiles([]);
    }
    setLoading(false);
  };

  const filtered = profiles.filter(p =>
    !search || p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.bio?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-to-br from-nexus-900 to-surface-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-8 h-8 text-nexus-400" />
              <h1 className="text-4xl md:text-5xl font-bold">Discover Founders & Freelancers</h1>
            </div>
            <p className="text-lg text-nexus-200 max-w-2xl">
              Browse through talented founders and freelancers. View their deployed projects and 
              connect directly to start a collaboration.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-surface-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search by name, title, or skills..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setRole('')} className={cn('px-4 py-3 rounded-xl text-sm font-medium transition-all', !role ? 'bg-nexus-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200')}>
                <Users className="w-4 h-4 inline mr-1.5" />All
              </button>
              <button onClick={() => setRole('startup')} className={cn('px-4 py-3 rounded-xl text-sm font-medium transition-all', role === 'startup' ? 'bg-nexus-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200')}>
                <Rocket className="w-4 h-4 inline mr-1.5" />Startups
              </button>
              <button onClick={() => setRole('freelancer')} className={cn('px-4 py-3 rounded-xl text-sm font-medium transition-all', role === 'freelancer' ? 'bg-nexus-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200')}>
                <Code className="w-4 h-4 inline mr-1.5" />Freelancers
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-surface-200" />
                  <div className="flex-1">
                    <div className="h-5 bg-surface-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-surface-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-surface-200 rounded w-full mb-2" />
                <div className="h-4 bg-surface-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-400 text-lg">No profiles found</p>
            <Link href="/register" className="btn-primary mt-4 inline-flex">Join as a Founder</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((profile, i) => (
              <motion.div key={profile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ProfileCard profile={profile} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
