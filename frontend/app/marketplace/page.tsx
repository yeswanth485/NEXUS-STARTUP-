'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProjectCard } from '@/components/marketplace/ProjectCard'
import { FilterChips } from '@/components/marketplace/FilterChips'
import { FilterSidebar } from '@/components/marketplace/FilterSidebar'
import { SubmitProposalModal } from '@/components/modals/SubmitProposalModal'
import { AuthModal } from '@/components/modals/AuthModal'
import { useSocket } from '@/hooks/useSocket'
import { useUIStore } from '@/store/uiStore'
import api from '@/lib/api'

export default function MarketplacePage() {
  const [projects, setProjects] = useState<any[]>([])
  const [category, setCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<any>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { submitProposalModal, authModal } = useUIStore()

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { category, q: debouncedQuery }
      if (filters.budget_max) params.budget_max = filters.budget_max
      if (filters.level) params.level = filters.level
      if (filters.type) params.type = filters.type
      const { data } = await api.get('/projects', { params })
      setProjects(data || [])
    } catch {} finally { setLoading(false) }
  }, [category, debouncedQuery, filters])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  useSocket('new_project', (project: any) => {
    setProjects((prev) => [project, ...prev])
  })

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Browse Projects</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text2)' }}>Find your next project or hire the best talent</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }} />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4" style={{ color: 'var(--text3)' }} />
                </button>
              )}
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all lg:hidden"
              style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          <FilterChips selected={category} onSelect={setCategory} />

          <div className="flex gap-6">
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 p-5 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                <FilterSidebar filters={filters} setFilters={setFilters} onClear={() => setFilters({})} />
              </div>
            </div>

            <div className="flex-1">
              {loading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: 'var(--bg2)' }} />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg font-medium text-white">No projects match your filters</p>
                  <button onClick={() => { setCategory('All'); setFilters({}); setSearchQuery('') }}
                    className="mt-4 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'var(--blue)' }}>Clear Filters</button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {projects.map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 p-6 overflow-y-auto" style={{ background: 'var(--bg2)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-white">Filters</h3>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" style={{ color: 'var(--text2)' }} /></button>
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} onClear={() => setFilters({})} />
          </div>
        </div>
      )}

      {submitProposalModal.open && <SubmitProposalModal />}
      {authModal && <AuthModal />}
    </div>
  )
}
