'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/lib/utils';
import { projectCategories, experienceLevels } from '@/lib/data';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', category: 'Web Dev',
    budget_min: '', budget_max: '', timeline: '1 month',
    experience_level: 'intermediate', project_type: 'fixed',
    skills_required: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && !user) { router.push('/login'); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await fetchAPI('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          budget_min: Number(form.budget_min),
          budget_max: Number(form.budget_max),
          skills_required: form.skills_required.split(',').map(s => s.trim()).filter(Boolean)
        })
      });
      router.push('/projects');
    } catch (err: any) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/projects" className="btn-ghost mb-6 inline-flex"><ArrowLeft className="w-4 h-4" /> Back to Projects</Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Post a New Project</h1>
          <p className="text-surface-500 mb-8">Describe your project and find the perfect freelancer or startup</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Project Title</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Build a SaaS Dashboard" required className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={6} placeholder="Describe your project in detail..." required className="input-field resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                  {projectCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Experience Level</label>
                <select value={form.experience_level} onChange={e => setForm(f => ({ ...f, experience_level: e.target.value }))} className="input-field">
                  {experienceLevels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Min Budget (₹)</label>
                <input type="number" value={form.budget_min} onChange={e => setForm(f => ({ ...f, budget_min: e.target.value }))} placeholder="10000" required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Max Budget (₹)</label>
                <input type="number" value={form.budget_max} onChange={e => setForm(f => ({ ...f, budget_max: e.target.value }))} placeholder="50000" required className="input-field" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Timeline</label>
                <select value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))} className="input-field">
                  {['1 week', '2 weeks', '1 month', '2 months', '3 months', 'Flexible'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Project Type</label>
                <select value={form.project_type} onChange={e => setForm(f => ({ ...f, project_type: e.target.value }))} className="input-field">
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Skills Required (comma-separated)</label>
              <input type="text" value={form.skills_required} onChange={e => setForm(f => ({ ...f, skills_required: e.target.value }))} placeholder="React, Node.js, PostgreSQL" className="input-field" />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
              {submitting ? 'Posting...' : 'Post Project'} <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
