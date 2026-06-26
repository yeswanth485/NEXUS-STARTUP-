'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DollarSign, MapPin, Star, Briefcase } from 'lucide-react'

export function FreelancerCard({ freelancer, index = 0 }: { freelancer: any; index?: number }) {
  const initials = (freelancer.full_name || 'F').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {initials}
          </div>
          {freelancer.is_available && (
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2" style={{ background: 'var(--success)', borderColor: 'var(--bg)' }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link href={`/freelancers/${freelancer.id}`} className="font-semibold text-white hover:underline truncate">{freelancer.full_name}</Link>
            {freelancer.badges?.map((b: string) => (
              <span key={b} className="shrink-0 px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--gold)' }}>{b}</span>
            ))}
          </div>
          <p className="text-sm mt-0.5 truncate" style={{ color: 'var(--text3)' }}>{freelancer.title}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(freelancer.skills || []).slice(0, 4).map((s: string) => (
              <span key={s} className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>{s}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text2)' }}>
            {freelancer.hourly_rate > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${freelancer.hourly_rate}/hr</span>}
            <span className="flex items-center gap-1"><Star className="w-3 h-3" style={{ color: 'var(--gold)' }} /> {freelancer.rating?.toFixed(1) || 'New'}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {freelancer.jobs_completed || 0} jobs</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Link href={`/freelancers/${freelancer.id}`}
          className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'var(--blue)' }}>View Profile</Link>
      </div>
    </motion.div>
  )
}
