import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(239,68,68,0.15)' }}>
          <span className="text-4xl font-bold" style={{ color: 'var(--danger)' }}>404</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text3)' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
          style={{ background: 'var(--blue)' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
