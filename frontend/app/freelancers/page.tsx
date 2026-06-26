'use client'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { FreelancerCard } from '@/components/freelancers/FreelancerCard'
import api from '@/lib/api'

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [rateMax, setRateMax] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const params: any = {}
        if (search) params.q = search
        if (rateMax) params.rate_max = rateMax
        const { data } = await api.get('/profiles/browse/freelancers', { params })
        setFreelancers(data || [])
      } catch {} finally { setLoading(false) }
    }
    fetch()
  }, [search, rateMax])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Find Expert Freelancers</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text2)' }}>Browse vetted professionals across every skill set</p>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search freelancers..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }} />
          </div>
          <select value={rateMax} onChange={e => setRateMax(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: rateMax ? 'white' : 'var(--text3)' }}>
            <option value="" style={{background:'var(--bg2)'}}>Max Rate</option>
            {[50,100,150,200,300,500].map(r => (
              <option key={r} value={r} style={{background:'var(--bg2)'}}>${r}/hr</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'var(--bg2)' }} />)}
          </div>
        ) : freelancers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-white">No freelancers found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {freelancers.map((f, i) => <FreelancerCard key={f.id} freelancer={f} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
