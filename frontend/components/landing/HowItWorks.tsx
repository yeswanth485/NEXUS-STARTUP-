'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Handshake, Shield } from 'lucide-react'

const clientSteps = [
  { icon: Search, num: '01', title: 'Post Your Project', desc: 'Describe what you need, set your budget & timeline.' },
  { icon: Users, num: '02', title: 'Receive Proposals', desc: 'Vetted freelancers & startups apply within hours.' },
  { icon: Handshake, num: '03', title: 'Pick Your Team', desc: 'Review portfolios, chat, and make your choice.' },
  { icon: Shield, num: '04', title: 'Pay Securely', desc: 'Milestone-based escrow. Release payment when satisfied.' },
]
const talentSteps = [
  { icon: Search, num: '01', title: 'Create Your Profile', desc: 'Showcase your skills, portfolio, and experience.' },
  { icon: Users, num: '02', title: 'Browse Projects', desc: 'Find projects that match your expertise and interests.' },
  { icon: Handshake, num: '03', title: 'Submit Proposals', desc: 'Apply with your bid, timeline, and cover letter.' },
  { icon: Shield, num: '04', title: 'Get Paid', desc: 'Milestone-based escrow payments. Always get paid on time.' },
]

export function HowItWorks() {
  const [isClient, setIsClient] = useState(true)
  const steps = isClient ? clientSteps : talentSteps

  return (
    <section className="py-24" style={{ background: 'var(--bg2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>HOW IT WORKS</p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-white">From idea to delivery in 4 simple steps</h2>
        </motion.div>
        <div className="flex justify-center gap-2 mb-12">
          <button onClick={() => setIsClient(true)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={isClient ? { background: 'var(--blue)', color: 'white' } : { background: 'var(--card)', color: 'var(--text2)' }}>
            I am a Client
          </button>
          <button onClick={() => setIsClient(false)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={!isClient ? { background: 'var(--blue)', color: 'white' } : { background: 'var(--card)', color: 'var(--text2)' }}>
            I am Freelancer/Startup
          </button>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-2xl border text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <span className="absolute top-2 right-4 text-6xl font-black" style={{ color: 'rgba(37,99,235,0.1)' }}>{step.num}</span>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(37,99,235,0.15)' }}>
                <step.icon className="w-7 h-7" style={{ color: 'var(--blue)' }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text3)' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
