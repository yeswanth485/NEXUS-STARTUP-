'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUIStore } from '@/store/uiStore'
import { Hero3D } from '@/components/landing/Hero3D'
import { Problems } from '@/components/landing/Problems'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Testimonials } from '@/components/landing/Testimonials'
import { Pricing } from '@/components/landing/Pricing'

function LandingContent() {
  const setAuthModal = useUIStore((s) => s.setAuthModal)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('auth') === 'signin') setAuthModal('signin')
  }, [searchParams])

  return (
    <div>
      <Hero3D />
      <Problems />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />

      <section className="py-24 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--bg2), var(--bg))' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(139,92,246,0.1))' }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to build the future?</h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--text2)' }}>
            Join 50,000+ professionals. Start free, upgrade when you are ready.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button onClick={() => setAuthModal('signup')}
              className="px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all duration-200"
              style={{ background: 'var(--gold)' }}>
              Start for Free
            </button>
            <button
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
              style={{ border: '1px solid var(--border2)', color: 'var(--text)' }}>
              Book a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function LandingPage() {
  return (
    <Suspense fallback={null}>
      <LandingContent />
    </Suspense>
  )
}
