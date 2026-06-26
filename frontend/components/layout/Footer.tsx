import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-white">Nexus</span>
            </div>
            <p className="text-sm max-w-md leading-relaxed" style={{ color: 'var(--text3)' }}>
              The future of professional collaboration. Connect with top freelancers, startups, and clients worldwide.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <div className="space-y-2">
              <Link href="/marketplace" className="block text-sm hover:text-white transition-colors" style={{ color: 'var(--text3)' }}>Marketplace</Link>
              <Link href="/freelancers" className="block text-sm hover:text-white transition-colors" style={{ color: 'var(--text3)' }}>Freelancers</Link>
              <Link href="/startups" className="block text-sm hover:text-white transition-colors" style={{ color: 'var(--text3)' }}>Startups</Link>
              <Link href="/pricing" className="block text-sm hover:text-white transition-colors" style={{ color: 'var(--text3)' }}>Pricing</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm hover:text-white transition-colors" style={{ color: 'var(--text3)' }}>About</Link>
              <Link href="#" className="block text-sm hover:text-white transition-colors" style={{ color: 'var(--text3)' }}>Blog</Link>
              <Link href="#" className="block text-sm hover:text-white transition-colors" style={{ color: 'var(--text3)' }}>Careers</Link>
              <Link href="#" className="block text-sm hover:text-white transition-colors" style={{ color: 'var(--text3)' }}>Press</Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text4)' }}> 2025 Nexus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
