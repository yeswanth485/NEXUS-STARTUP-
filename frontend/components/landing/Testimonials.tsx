'use client'
import { motion } from 'framer-motion'

const testimonials = [
  { name: 'James R.', title: 'CEO @ DataFlow', text: 'Found an incredible team in 48 hours. Nexus has completely changed how we hire.', stars: 5, paid: '$48,000 in projects' },
  { name: 'Sarah Chen', title: 'Full-Stack Developer', text: 'As a freelancer, I have tripled my income. The escrow system means I always get paid.', stars: 5, paid: '$240K+ earned' },
  { name: 'TechNova Solutions', title: 'Startup Agency', text: 'Our startup got 3 enterprise clients from Nexus in the first month. The pitch feature is genius.', stars: 5, paid: '47 projects via Nexus' },
]

export function Testimonials() {
  return (
    <section className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest" style={{ color: 'var(--gold)' }}>TESTIMONIALS</p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-white">Trusted by thousands</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg key={i} className="w-5 h-5" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text2)' }}>"{t.text}"</p>
              <div>
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{t.title} · {t.paid}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
