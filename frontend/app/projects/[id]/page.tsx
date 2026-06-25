'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI, formatCurrency, formatDate, cn } from '@/lib/utils';
import { ArrowLeft, Clock, Eye, FileText, Send, Star, Shield, Calendar, DollarSign, User, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [proposalSent, setProposalSent] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await fetchAPI(`/api/projects/${id}`);
      setProject(data);
    } catch { router.push('/projects'); }
    setLoading(false);
  };

  const submitProposal = async () => {
    if (!bidAmount || !coverLetter) return;
    try {
      await fetchAPI('/api/proposals', {
        method: 'POST',
        body: JSON.stringify({ project_id: id, cover_letter: coverLetter, bid_amount: Number(bidAmount), timeline: project.timeline })
      });
      setProposalSent(true);
    } catch (err: any) { alert(err.message); }
  };

  if (loading) return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center">
      <div className="animate-pulse text-surface-400">Loading...</div>
    </div>
  );

  if (!project) return null;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => router.back()} className="btn-ghost mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge-primary">{project.category}</span>
              <span className={cn('badge', project.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-100 text-surface-600')}>
                {project.status}
              </span>
              <span className="badge-surface">{project.experience_level}</span>
              <span className="badge-surface">{project.project_type}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-surface-900">{project.title}</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <h2 className="text-lg font-semibold text-surface-900 mb-4">Description</h2>
              <p className="text-surface-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </motion.div>

            {project.skills_required?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {project.skills_required.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-surface-100 text-surface-700 text-sm font-medium">{skill}</span>
                  ))}
                </div>
              </motion.div>
            )}

            {user && project.client_id !== user.id && project.status === 'open' && !proposalSent && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-4">Submit a Proposal</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Your Bid Amount (₹)</label>
                    <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} placeholder="e.g. 50000" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Cover Letter</label>
                    <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={5} placeholder="Explain why you're the best fit for this project..." className="input-field resize-none" />
                  </div>
                  <button onClick={submitProposal} disabled={!bidAmount || !coverLetter} className="btn-primary">
                    <Send className="w-4 h-4" /> Submit Proposal
                  </button>
                </div>
              </motion.div>
            )}

            {proposalSent && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Send className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900">Proposal Submitted!</h3>
                    <p className="text-sm text-emerald-700">The client will review your proposal and get back to you.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-nexus-600">{formatCurrency(project.budget_min)} - {formatCurrency(project.budget_max)}</p>
                <p className="text-sm text-surface-400">{project.project_type} price</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-surface-500"><Clock className="w-4 h-4" /> Timeline</span>
                  <span className="font-medium text-surface-900">{project.timeline}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-surface-500"><Calendar className="w-4 h-4" /> Posted</span>
                  <span className="font-medium text-surface-900">{formatDate(project.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-surface-500"><FileText className="w-4 h-4" /> Proposals</span>
                  <span className="font-medium text-surface-900">{project.proposals_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-surface-500"><Eye className="w-4 h-4" /> Views</span>
                  <span className="font-medium text-surface-900">{project.views_count || 0}</span>
                </div>
              </div>
            </motion.div>

            {project.client && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-4">Client</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {project.client.full_name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">{project.client.full_name || 'Anonymous'}</p>
                    <p className="text-sm text-surface-500">{project.client.title || 'Client'}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/chat?user=${project.client_id}`} className="btn-outline flex-1 text-sm py-2.5">
                    <MessageCircle className="w-4 h-4" /> Message
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
