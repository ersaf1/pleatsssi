'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabaseBrowserClient } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error') === 'access_denied') {
        return 'Access denied: Admin role required. Your account does not have permission to access the admin dashboard.';
      }
    }
    return null;
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Check role of logged-in user
      const user = data.data?.user;
      let role = user?.user_metadata?.role;

      if (!role || (role !== 'admin' && role !== 'owner')) {
        if (user?.id) {
          const { data: profile } = await supabaseBrowserClient
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          if (profile?.role) {
            role = profile.role;
          }
        }
      }

      if (role !== 'admin' && role !== 'owner') {
        setError('Access denied: Admin role required. Your account does not have permission to access the admin dashboard.');
        setLoading(false);
        return;
      }

      router.push('/id/admin/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[#E2E8F0] max-w-md w-full relative overflow-hidden space-y-8">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0B4F3A]" />
        <div>
          <div className="mx-auto h-12 w-12 rounded-full bg-[#0B4F3A]/10 flex items-center justify-center text-[#0B4F3A]">
            <Lock className="w-6 h-6 text-[#0B4F3A]" />
          </div>
          <h2 className="mt-4 text-center text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            PLEATSSSI Admin
          </h2>
          <p className="mt-2 text-center text-sm text-[#475569]">
            Sign in with your admin or owner credentials to access the dashboard
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-sm font-medium flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A] focus:border-transparent transition-all shadow-xs"
                placeholder="admin@pleatsssi.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A] focus:border-transparent transition-all shadow-xs"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0B4F3A] hover:bg-[#083C2C] focus:ring-2 focus:ring-[#0B4F3A] focus:ring-offset-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
