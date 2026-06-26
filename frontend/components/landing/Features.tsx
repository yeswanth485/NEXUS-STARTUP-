'use client'
import { motion } from 'framer-motion'
import { Store, MessageCircle, Shield, BarChart3, Briefcase, BadgeCheck } from 'lucide-react'

const features = [
  { icon: Store, title: 'Smart Marketplace', desc: 'AI-powered matching connects you with the right talent or project instantly.' },
  { icon: MessageCircle, title: 'Real-time Collaboration', desc: 'Chat, share files, and collaborate in real-time with built-in messaging.' },
  { icon: Shield, title: 'Secure Escrow Payments', desc: 'Milestone-based payments held in escrow. Zero risk for both parties.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time performance tracking with actionable insights and metrics.' },
  { icon: Briefcase, title: 'Portfolio & Case Studies', desc: 'Rich portfolios and case studies that help you win more clients.' },
  { icon: BadgeCheck, title: 'Trust & Verification', desc: 'Multi-level identity verification ensures a trusted marketplace.' },
]

export function Features() {
  return (
    <section className="py-24" style={{ background: 'var(--bg2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>WHY NEXUS</p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-white">Everything you need to build something great</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(37,99,235,0.15)' }}>
                <f.icon className="w-6 h-6" style={{ color: 'var(--blue)' }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text3)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
