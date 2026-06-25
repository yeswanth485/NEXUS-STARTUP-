'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search, Briefcase } from 'lucide-react';
import { cn, fetchAPI } from '@/lib/utils';
import { projectCategories } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [category]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (category) params.set('category', category);
      const data = await fetchAPI(`/api/projects?${params}`);
      setProjects(data.data || []);
    } catch { setProjects([]); }
    setLoading(false);
  };

  const filtered = projects.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-surface-900">Browse Projects</h1>
              <p className="text-surface-500 mt-1">Find your next project to work on</p>
            </motion.div>
            <Link href="/projects/new" className="btn-primary">
              <Plus className="w-5 h-5" /> Post Project
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-12" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setCategory('')} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', !category ? 'bg-nexus-600 text-white' : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50')}>
            All
          </button>
          {projectCategories.map(cat => (
            <button key={cat.value} onClick={() => setCategory(cat.value)} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', category === cat.value ? 'bg-nexus-600 text-white' : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50')}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-surface-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-surface-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-surface-200 rounded w-full mb-1" />
                <div className="h-4 bg-surface-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-400 text-lg">No projects found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((project, i) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
