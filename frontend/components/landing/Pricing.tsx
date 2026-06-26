'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

const plans = [
  { name: 'FREE', price: { monthly: 0, yearly: 0 }, desc: 'Get started and explore the marketplace', popular: false,
    features: ['5 proposals/month', 'Basic profile', 'Browse marketplace', 'Standard support'] },
  { name: 'PRO', price: { monthly: 29, yearly: 20 }, desc: 'For professionals ready to grow their business', popular: false,
    features: ['Unlimited proposals', 'Featured listing', 'Priority support', 'Kanban access', 'Advanced analytics'] },
  { name: 'BUSINESS', price: { monthly: 79, yearly: 55 }, desc: 'For teams and agencies scaling their operations', popular: true,
    features: ['Everything in Pro', 'Team workspace (5 seats)', 'Advanced analytics', 'Custom domain', 'API access', 'Dedicated support'] },
  { name: 'ENTERPRISE', price: { monthly: null, yearly: null }, desc: 'Custom solutions for large organizations', popular: false,
    features: ['Everything in Business', 'Unlimited team members', 'White-label options', 'SLA guarantee', 'Custom integrations', 'Account manager'] },
]

export function Pricing() {
  const [yearly, setYearly] = useState(false)
  const setAuthModal = useUIStore((s) => s.setAuthModal)

  return (
    <section className="py-24" style={{ background: 'var(--bg2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>PRICING</p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-white">Choose your plan</h2>
        </motion.div>
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className="text-sm font-medium" style={{ color: yearly ? 'var(--text3)' : 'var(--text)' }}>Monthly</span>
          <button onClick={() => setYearly(!yearly)}
            className="relative w-14 h-7 rounded-full transition-all duration-300"
            style={{ background: yearly ? 'var(--blue)' : 'var(--bg4)' }}>
            <div className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300"
              style={{ left: yearly ? 'calc(100% - 24px)' : '4px' }} />
          </button>
          <span className="text-sm font-medium" style={{ color: !yearly ? 'var(--text3)' : 'var(--text)' }}>Yearly</span>
          {yearly && <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)' }}>Save 30%</span>}
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-2xl border transition-all duration-300"
              style={plan.popular
                ? { background: 'var(--bg3)', borderColor: 'var(--blue)', boxShadow: '0 0 30px rgba(37,99,235,0.15)' }
                : { background: 'var(--card)', borderColor: 'var(--border)' }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                  style={{ background: 'var(--blue)', color: 'white' }}>
                  <Star className="w-3 h-3" /> Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <div className="mt-4 mb-2">
                {plan.price.monthly === null ? (
                  <span className="text-3xl font-bold text-white">Custom</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-white">${yearly ? plan.price.yearly : plan.price.monthly}</span>
                    <span className="text-sm ml-1" style={{ color: 'var(--text3)' }}>/mo</span>
                  </>
                )}
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text3)' }}>{plan.desc}</p>
              <button onClick={() => setAuthModal('signup')}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={plan.popular
                  ? { background: 'var(--blue)', color: 'white' }
                  : { border: '1px solid var(--border2)', color: 'var(--text)' }}>
                {plan.price.monthly === 0 ? 'Start Free' : 'Upgrade'}
              </button>
              <div className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--success)' }} />
                    <span className="text-sm" style={{ color: 'var(--text2)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
