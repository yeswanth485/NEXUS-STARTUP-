'use client'

interface FilterSidebarProps {
  filters: { budget_max?: number; level?: string; type?: string; timeline?: string; rating?: string }
  setFilters: (f: any) => void
  onClear: () => void
}

const levels = ['entry', 'intermediate', 'expert']
const types = ['fixed', 'hourly']
const timelines = ['<1 week', '1-4 weeks', '1-3 months', '3+ months']
const ratings = ['4.5+', '4.0+']

export function FilterSidebar({ filters, setFilters, onClear }: FilterSidebarProps) {
  const toggleFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: prev[key] === value ? undefined : value }))
  }

  const hasFilters = Object.values(filters).some(v => v !== undefined)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Filters</h3>
        {hasFilters && (
          <button onClick={onClear} className="text-xs font-medium" style={{ color: 'var(--blue)' }}>Clear All</button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text3)' }}>Experience Level</h4>
        <div className="space-y-2">
          {levels.map(l => (
            <button key={l} onClick={() => toggleFilter('level', l)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
              style={filters.level === l ? { background: 'rgba(37,99,235,0.15)', color: 'var(--blue)' } : { color: 'var(--text2)' }}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text3)' }}>Project Type</h4>
        <div className="space-y-2">
          {types.map(t => (
            <button key={t} onClick={() => toggleFilter('type', t)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
              style={filters.type === t ? { background: 'rgba(37,99,235,0.15)', color: 'var(--blue)' } : { color: 'var(--text2)' }}>
              {t === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text3)' }}>Timeline</h4>
        <div className="space-y-2">
          {timelines.map(t => (
            <button key={t} onClick={() => toggleFilter('timeline', t)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
              style={filters.timeline === t ? { background: 'rgba(37,99,235,0.15)', color: 'var(--blue)' } : { color: 'var(--text2)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text3)' }}>Rating</h4>
        <div className="space-y-2">
          {ratings.map(r => (
            <button key={r} onClick={() => toggleFilter('rating', r)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
              style={filters.rating === r ? { background: 'rgba(37,99,235,0.15)', color: 'var(--blue)' } : { color: 'var(--text2)' }}>
              {'★'} {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
