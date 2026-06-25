'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, Rocket, Code, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles = [
  { value: 'freelancer', label: 'Freelancer', icon: Code, desc: 'I want to find projects and clients' },
  { value: 'startup', label: 'Startup Founder', icon: Rocket, desc: 'I want to showcase my startup' },
  { value: 'client', label: 'Client', icon: Users, desc: 'I want to hire talent' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'freelancer' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, role: form.role }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nexus-50 via-white to-purple-50 flex items-center justify-center p-4 py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-surface-200 p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nexus-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-surface-900">Create your account</h1>
            <p className="text-surface-500 mt-1">Start connecting with customers directly</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map(r => (
              <button
                key={r.value}
                onClick={() => setForm(f => ({ ...f, role: r.value }))}
                className={cn(
                  'p-3 rounded-xl text-center transition-all border-2',
                  form.role === r.value
                    ? 'border-nexus-500 bg-nexus-50 text-nexus-700'
                    : 'border-transparent bg-surface-50 text-surface-500 hover:bg-surface-100'
                )}
              >
                <r.icon className="w-5 h-5 mx-auto mb-1" />
                <p className="text-[11px] font-medium leading-tight">{r.label}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="John Doe"
                  required
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
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
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  minLength={6}
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
              {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-nexus-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
