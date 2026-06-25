'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Users, MessageCircle, Shield, Zap, TrendingUp, CheckCircle } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1, duration: 0.5 },
};

const features = [
  { icon: Rocket, title: 'Showcase Your Work', description: 'Post your deployed projects and portfolios for thousands of potential clients to discover.' },
  { icon: Users, title: 'Find Top Talent', description: 'Browse through vetted startups and freelancers with real deployed projects and proven track records.' },
  { icon: MessageCircle, title: 'Direct Connect', description: 'Skip the middlemen. Message founders and freelancers directly to start collaborations instantly.' },
  { icon: Shield, title: 'Secure Payments', description: 'Built-in escrow and milestone-based payments ensure fair transactions for both parties.' },
  { icon: Zap, title: 'Real-Time Chat', description: 'Communicate instantly with built-in real-time messaging. No more delayed email threads.' },
  { icon: TrendingUp, title: 'Grow Your Network', description: 'Build lasting professional relationships that lead to repeat business and referrals.' },
];

const stats = [
  { value: '10K+', label: 'Active Freelancers' },
  { value: '5K+', label: 'Projects Posted' },
  { value: '50K+', label: 'Connections Made' },
  { value: '95%', label: 'Satisfaction Rate' },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-50 via-white to-purple-50" />
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-nexus-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nexus-100 text-nexus-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                The New Way to Connect
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-surface-900 leading-[1.1]">
                Connect with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-600 to-purple-600">
                  Customers
                </span>{' '}
                Directly
              </h1>
              <p className="mt-6 text-xl text-surface-500 max-w-2xl leading-relaxed">
                Stop hunting for clients. Start showcasing your work. Nexus connects startup founders 
                and freelancers directly with customers who are ready to hire.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link href="/register" className="btn-primary text-lg px-8 py-4">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/marketplace" className="btn-outline text-lg px-8 py-4">
                  Browse Projects
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-surface-400">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> No credit card</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Free plan available</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" {...stagger}>
            {stats.map((stat) => (
              <motion.div key={stat.label} className="text-center p-6" {...fadeUp}>
                <p className="text-4xl md:text-5xl font-bold text-nexus-600">{stat.value}</p>
                <p className="text-surface-500 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="section-title">Why Choose Nexus?</h2>
            <p className="section-subtitle mx-auto mt-4">
              We built Nexus to solve the biggest challenge for founders and freelancers — finding customers.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <motion.div key={feature.title} className="card-hover p-8" {...fadeUp}>
                <div className="w-12 h-12 rounded-xl bg-nexus-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-nexus-600" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-nexus-900 to-surface-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Ready to Find Your Next Customer?
              </h2>
              <p className="text-lg text-nexus-200 mt-4 leading-relaxed">
                Join thousands of founders and freelancers who are already using Nexus 
                to connect with customers and grow their business.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-surface-900 font-semibold hover:bg-nexus-50 transition-all">
                  Create Free Account <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/startups" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-nexus-400 text-white font-semibold hover:bg-white/10 transition-all">
                  Browse Startups
                </Link>
              </div>
            </motion.div>
            <motion.div className="relative" {...fadeUp}>
              <div className="glass-card rounded-3xl p-8 text-surface-900">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nexus-400 to-purple-500" />
                  <div>
                    <p className="font-semibold text-sm">Sarah Chen</p>
                    <p className="text-xs text-surface-400">Founder, TechFlow</p>
                  </div>
                </div>
                <p className="text-surface-600 leading-relaxed">
                  "Nexus completely transformed how I find clients. Within a week of posting my project, 
                  I had 3 qualified leads. The direct messaging feature is a game-changer."
                </p>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
