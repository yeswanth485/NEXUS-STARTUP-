'use client'
import { useState, useEffect } from 'react'
import { Plus, Eye } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useUIStore } from '@/store/uiStore'
import api from '@/lib/api'

export function ProjectsTab() {
  const { user } = useAuth()
  const setPostProjectModal = useUIStore((s) => s.setPostProjectModal)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    api.get('/projects/mine/list').then(({ data }) => setProjects(data || [])).catch(() => {})
  }, [])

  const statusColors: Record<string, string> = { open: 'rgba(37,99,235,0.15)', in_progress: 'rgba(245,158,11,0.15)', completed: 'rgba(16,185,129,0.15)', cancelled: 'rgba(239,68,68,0.15)' }
  const statusText: Record<string, string> = { open: '#60A5FA', in_progress: '#FBBF24', completed: '#34D399', cancelled: '#F87171' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Posted Projects</h2>
        <button onClick={() => setPostProjectModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'var(--blue)' }}>
          <Plus className="w-4 h-4" /> Post New Project
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-white">No projects yet</p>
          <p className="text-sm mt-2" style={{ color: 'var(--text3)' }}>Post your first project to start receiving proposals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl border flex items-center justify-between" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{p.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text3)' }}>
                  <span>{p.category}</span>
                  <span>${p.budget_min?.toLocaleString()} - ${p.budget_max?.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {p.views_count || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: statusColors[p.status] || 'rgba(37,99,235,0.15)', color: statusText[p.status] || '#60A5FA' }}>
                  {p.status}
                </span>
                <span className="text-xs" style={{ color: 'var(--text3)' }}>{p.proposals?.[0]?.count || 0} proposals</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
