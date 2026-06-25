'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nexus-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-surface-200 p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nexus-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-surface-900">Welcome back</h1>
            <p className="text-surface-500 mt-1">Sign in to your Nexus account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pl-12 pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-nexus-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
