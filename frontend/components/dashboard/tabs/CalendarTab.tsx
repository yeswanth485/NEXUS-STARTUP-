'use client'

export function CalendarTab() {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-white mb-2">Calendar</h2>
      <p className="text-sm" style={{ color: 'var(--text2)' }}>Calendar view coming soon</p>
      <div className="max-w-md mx-auto mt-8 p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium mb-2" style={{ color: 'var(--text3)' }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {Array.from({length: 30}).map((_, i) => (
            <span key={i} className="p-2 rounded-lg" style={{ color: 'var(--text2)' }}>{i + 1}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
