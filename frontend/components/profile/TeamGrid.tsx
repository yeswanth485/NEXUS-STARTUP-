'use client'
import { Linkedin } from 'lucide-react'

export function TeamGrid({ members }: { members: any[] }) {
  if (!members?.length) return <p className="text-sm" style={{ color: 'var(--text3)' }}>No team members listed.</p>
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((m) => (
        <div key={m.id} className="p-5 rounded-2xl border flex items-start gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
            {(m.name || '?')[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{m.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{m.role}</p>
            {m.bio && <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text2)' }}>{m.bio}</p>}
            {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs" style={{ color: 'var(--blue)' }}><Linkedin className="w-3 h-3" /> LinkedIn</a>}
          </div>
        </div>
      ))}
    </div>
  )
}
