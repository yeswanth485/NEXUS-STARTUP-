'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, DollarSign, User } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/providers/AuthProvider'

interface ProjectCardProps {
  project: any
  index?: number
}

const categoryColors: Record<string, string> = {
  'Web Dev': '#2563EB', 'Mobile': '#8B5CF6', 'AI/ML': '#10B981',
  'Design': '#EC4899', 'Marketing': '#F59E0B', 'SaaS': '#06B6D4', 'E-Commerce': '#F97316',
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const setAuthModal = useUIStore((s) => s.setAuthModal)
  const setSubmitProposalModal = useUIStore((s) => s.setSubmitProposalModal)
  const { user, profile } = useAuth()

  const handleApply = () => {
    if (!user) return setAuthModal('signin')
    if (profile?.role === 'client') return
    setSubmitProposalModal({ open: true, projectId: project.id })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${categoryColors[project.category] || '#6366F1'}20`, color: categoryColors[project.category] || '#6366F1' }}>
          {project.category}
        </span>
      </div>
      <Link href={`/projects/${project.id}`}>
        <h3 className="text-lg font-bold text-white line-clamp-2 hover:underline">{project.title}</h3>
      </Link>
      <p className="text-sm mt-2 line-clamp-3" style={{ color: 'var(--text3)' }}>{project.description}</p>
      {project.skills_required?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.skills_required.slice(0, 4).map((s: string) => (
            <span key={s} className="px-2.5 py-1 rounded-md text-xs" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>{s}</span>
          ))}
          {project.skills_required.length > 4 && <span className="text-xs self-center" style={{ color: 'var(--text4)' }}>+{project.skills_required.length - 4}</span>}
        </div>
      )}
      <div className="flex items-center gap-4 mt-4 text-sm" style={{ color: 'var(--text2)' }}>
        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${project.budget_min?.toLocaleString()} - ${project.budget_max?.toLocaleString()}</span>
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {project.timeline}</span>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
            {project.client?.full_name?.[0] || 'C'}
          </div>
          <div>
            <p className="text-xs font-medium text-white">{project.client?.full_name || 'Client'}</p>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--gold)' }}>
              {'★'.repeat(Math.round(project.client?.rating || 0)) || 'New'}
            </div>
          </div>
        </div>
        <button onClick={handleApply}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200"
          style={{ background: 'var(--blue)' }}>
          {user && profile?.role === 'client' ? 'Your Project' : 'Apply Now'}
        </button>
      </div>
    </motion.div>
  )
}
