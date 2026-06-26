'use client'

export function WorkHistory({ contracts }: { contracts: any[] }) {
  if (!contracts?.length) return <p className="text-sm" style={{ color: 'var(--text3)' }}>No work history yet.</p>
  return (
    <div className="space-y-3">
      {contracts.map((c) => (
        <div key={c.id} className="p-4 rounded-xl border flex items-center justify-between" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div>
            <p className="text-sm font-semibold text-white">{c.title}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>${c.total_amount?.toLocaleString()} · {new Date(c.created_at).toLocaleDateString()}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium"
            style={c.status === 'completed' ? { background: 'rgba(16,185,129,0.15)', color: 'var(--success)' } : { background: 'rgba(37,99,235,0.15)', color: 'var(--blue)' }}>
            {c.status}
          </span>
        </div>
      ))}
    </div>
  )
}
