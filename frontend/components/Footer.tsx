import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-950 text-surface-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-white">Nexus</span>
            </div>
            <p className="text-surface-400 text-sm max-w-md leading-relaxed">
              Connecting startup founders and freelancers directly with customers. 
              Showcase your work, find your next opportunity, and collaborate without barriers.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <div className="space-y-2">
              <Link href="/marketplace" className="block text-sm hover:text-white transition-colors">Marketplace</Link>
              <Link href="/startups" className="block text-sm hover:text-white transition-colors">Startups</Link>
              <Link href="/projects" className="block text-sm hover:text-white transition-colors">Projects</Link>
              <Link href="/register" className="block text-sm hover:text-white transition-colors">Join as Freelancer</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm hover:text-white transition-colors">Help Center</Link>
              <Link href="#" className="block text-sm hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="block text-sm hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="block text-sm hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-surface-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">© 2024 Nexus. All rights reserved.</p>
          <p className="text-sm text-surface-500">Built with ❤️ for founders and freelancers</p>
        </div>
      </div>
    </footer>
  );
}
