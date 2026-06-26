'use client'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export function PortfolioGrid({ items }: { items: any[] }) {
  if (!items?.length) return <p className="text-sm" style={{ color: 'var(--text3)' }}>No portfolio items yet.</p>
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="p-5 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover rounded-xl mb-3" />}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-white">{item.title}</h4>
              {item.description && <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text3)' }}>{item.description}</p>}
            </div>
            {item.project_url && <a href={item.project_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 shrink-0" style={{ color: 'var(--text3)' }} /></a>}
          </div>
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.map((t: string) => <span key={t} className="px-2 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>{t}</span>)}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
