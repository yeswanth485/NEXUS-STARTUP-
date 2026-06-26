'use client'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { ProjectCard } from '@/components/marketplace/ProjectCard'
import { FilterChips } from '@/components/marketplace/FilterChips'
import { SubmitProposalModal } from '@/components/modals/SubmitProposalModal'
import { useUIStore } from '@/store/uiStore'
import api from '@/lib/api'

export function BrowseJobsTab() {
  const [projects, setProjects] = useState<any[]>([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const { submitProposalModal } = useUIStore()

  useEffect(() => {
    const params: any = { category }
    if (search) params.q = search
    api.get('/projects', { params }).then(({ data }) => setProjects(data || [])).catch(() => {})
  }, [category, search])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Browse Jobs</h2>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }} />
      </div>
      <FilterChips selected={category} onSelect={setCategory} />
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
      </div>
      {submitProposalModal.open && <SubmitProposalModal />}
    </div>
  )
}
