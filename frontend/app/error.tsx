'use client'
import { useEffect } from 'react'

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('unhandled error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(239,68,68,0.15)' }}>
          <span className="text-4xl" style={{ color: 'var(--danger)' }}>!</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text3)' }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
          style={{ background: 'var(--blue)' }}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
