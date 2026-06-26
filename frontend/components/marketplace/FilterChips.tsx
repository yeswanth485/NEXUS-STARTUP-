'use client'

const categories = ['All', 'Web Dev', 'Mobile', 'AI/ML', 'Design', 'Marketing', 'SaaS', 'E-Commerce']

interface FilterChipsProps {
  selected: string
  onSelect: (cat: string) => void
}

export function FilterChips({ selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(cat => (
        <button key={cat} onClick={() => onSelect(cat)}
          className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
          style={selected === cat
            ? { background: 'var(--blue)', color: 'white' }
            : { background: 'var(--card)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
          {cat}
        </button>
      ))}
    </div>
  )
}
