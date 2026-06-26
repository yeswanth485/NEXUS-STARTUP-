'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Star } from 'lucide-react'

export function StartupCard({ startup, index = 0 }: { startup: any; index?: number }) {
  const initials = (startup.company_name || 'S').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const gradientColors = [['#8B5CF6', '#6D28D9'], ['#EC4899', '#BE185D'], ['#06B6D4', '#0891B2'], ['#10B981', '#059669']]
  const g = gradientColors[index % 4]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <Link href={`/startups/${startup.id}`}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{startup.company_name}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{startup.industry} · {startup.team_size || '?'} members</p>
            <p className="text-sm mt-2 line-clamp-2 leading-relaxed" style={{ color: 'var(--text2)' }}>{startup.elevator_pitch}</p>
            {(startup.tech_stack?.length > 0) && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {startup.tech_stack.slice(0, 3).map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>{t}</span>
                ))}
                {startup.tech_stack.length > 3 && <span className="text-[10px] self-center" style={{ color: 'var(--text4)' }}>+{startup.tech_stack.length - 3}</span>}
              </div>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text2)' }}>
              <span className="flex items-center gap-1"><Star className="w-3 h-3" style={{ color: 'var(--gold)' }} /> {startup.rating?.toFixed(1) || 'New'}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {startup.jobs_completed || 0} projects</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
