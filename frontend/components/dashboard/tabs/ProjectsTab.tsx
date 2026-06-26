'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Eye, RefreshCw } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useUIStore } from '@/store/uiStore'
import api from '@/lib/api'

export function ProjectsTab() {
  const { user } = useAuth()
  const { postProjectModal, setPostProjectModal } = useUIStore()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/projects/mine/list')
      setProjects(data || [])
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  useEffect(() => {
    if (!postProjectModal) fetchProjects()
  }, [postProjectModal, fetchProjects])

  const statusColors: Record<string, string> = { open: 'rgba(37,99,235,0.15)', in_progress: 'rgba(245,158,11,0.15)', completed: 'rgba(16,185,129,0.15)', cancelled: 'rgba(239,68,68,0.15)' }
  const statusText: Record<string, string> = { open: '#60A5FA', in_progress: '#FBBF24', completed: '#34D399', cancelled: '#F87171' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Posted Projects</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>{projects.length} total project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchProjects} className="p-2.5 rounded-xl transition-all hover:bg-white/5" style={{ color: 'var(--text2)' }} title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setPostProjectModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'var(--blue)' }}>
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>
      {loading && projects.length === 0 ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="p-5 rounded-2xl border animate-pulse" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}><div className="h-5 w-48 rounded bg-white/10" /><div className="h-3 w-32 rounded bg-white/5 mt-3" /></div>)}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-white">No projects yet</p>
          <p className="text-sm mt-2" style={{ color: 'var(--text3)' }}>Post your first project to start receiving proposals</p>
          <button onClick={() => setPostProjectModal(true)} className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--blue)' }}>
            <Plus className="w-4 h-4 inline mr-1" /> Create Your First Project
          </button>
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
                <span className="text-xs" style={{ color: 'var(--text3)' }}>{p.proposals_count || 0} proposals</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
