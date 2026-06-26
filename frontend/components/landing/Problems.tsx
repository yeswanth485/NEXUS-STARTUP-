'use client'
import { motion } from 'framer-motion'
import { XCircle, CheckCircle, MessageSquare, Eye, Shield } from 'lucide-react'

const problems = [
  { icon: MessageSquare, title: 'Endless Back-and-Forth', desc: 'Weeks spent on calls, emails, and proposals that go nowhere.' },
  { icon: Eye, title: 'Zero Accountability', desc: 'No visibility into work progress until it is too late.' },
  { icon: Shield, title: 'Payment Anxiety', desc: 'Freelancers fear non-payment. Clients fear bad work.' },
]
const solutions = [
  { icon: CheckCircle, title: 'Smart Matching in Minutes', desc: 'AI connects the right talent to the right project instantly.' },
  { icon: Eye, title: 'Full Transparency', desc: 'Kanban boards, milestone tracking, and real-time updates.' },
  { icon: Shield, title: 'Escrow-Protected Payments', desc: 'Money held safely until work is approved. Zero risk.' },
]

export function Problems() {
  return (
    <section className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest" style={{ color: 'var(--danger)' }}>THE PROBLEM</p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-white">The old way of hiring is broken</h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {problems.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl border" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
                <div className="flex items-start gap-4">
                  <p.icon className="w-6 h-6 mt-1 shrink-0" style={{ color: 'var(--danger)' }} />
                  <div>
                    <h3 className="font-semibold text-white">{p.title}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="space-y-4">
            {solutions.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl border" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
                <div className="flex items-start gap-4">
                  <s.icon className="w-6 h-6 mt-1 shrink-0" style={{ color: 'var(--success)' }} />
                  <div>
                    <h3 className="font-semibold text-white">{s.title}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>{s.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
