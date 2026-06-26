'use client'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { useUIStore } from '@/store/uiStore'

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const setAuthModal = useUIStore((s) => s.setAuthModal)
  const { user } = useAuth()

  useEffect(() => {
    if (!containerRef.current) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0x404060)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0x2563EB, 2, 50)
    pointLight.position.set(0, 10, 10)
    scene.add(pointLight)

    const particles: THREE.Mesh[] = []
    const colors = [0x2563EB, 0x8B5CF6, 0xF59E0B, 0x10B981]
    for (let i = 0; i < 200; i++) {
      const geometry = new THREE.SphereGeometry(Math.random() * 0.1 + 0.05, 8, 8)
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: Math.random() * 0.5 + 0.3,
      })
      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 5
      )
      scene.add(sphere)
      particles.push(sphere)
    }

    camera.position.z = 12
    let mouseX = 0, mouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.002
      particles.forEach((p, i) => {
        p.position.x += Math.sin(time + i) * 0.002
        p.position.y += Math.cos(time + i) * 0.002 + 0.005
      })
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05
      camera.lookAt(scene.position)
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.1) 0%, rgba(5,10,20,0.9) 70%, rgba(5,10,20,1) 100%)',
      }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'rgba(37,99,235,0.15)', color: 'var(--blue3)', border: '1px solid rgba(37,99,235,0.3)' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Now in Public Beta — 50,000+ Professionals
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
            <span style={{ color: 'var(--text)' }}>The Future of</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400">
              Professional Collaboration
            </span>
          </h1>
          <p className="mt-6 text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--text2)' }}>
            Post projects, find talent, and collaborate with confidence. Nexus connects you with vetted professionals and startups worldwide.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-8">
            {user ? (
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all duration-200"
                style={{ background: 'var(--blue)' }}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <button onClick={() => user ? null : setAuthModal('signup')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all duration-200"
                  style={{ background: 'var(--blue)' }}>
                  Post a Project
                </button>
                <button onClick={() => setAuthModal('signin')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
                  style={{ border: '1px solid var(--border2)', color: 'var(--text)' }}>
                  Find Talent
                </button>
              </>
            )}
            <Link href="/startups"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
              style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--gold)', border: '1px solid rgba(245,158,11,0.3)' }}>
              Browse Startups
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              { value: '50K+', label: 'Professionals' },
              { value: '$2.4M+', label: 'Paid Out' },
              { value: '12K+', label: 'Projects' },
              { value: '4.9', label: 'Avg Rating' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {stat.value}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
