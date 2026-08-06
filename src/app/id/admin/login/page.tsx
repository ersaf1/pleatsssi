'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { supabaseBrowserClient } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-[#E5E0D8]">
        <div>
          <div className="mx-auto h-12 w-12 rounded-full bg-[#0B4F3A]/10 flex items-center justify-center text-[#0B4F3A]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-center text-2xl font-serif font-bold text-[#1A1918] tracking-tight">
            PLEATSSSI Admin
          </h2>
          <p className="mt-2 text-center text-sm text-[#706D65]">
            Sign in with your admin or owner credentials to access the dashboard
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 shrink-0" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1.5">
              Email Address
            </label>
            <div className="relative rounded-md shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#706D65]">
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
                className="block w-full pl-10 pr-3 py-2.5 border border-[#D5D0C8] rounded-lg text-sm placeholder-[#9E9A90] text-[#1A1918] focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A] focus:border-transparent transition-all"
                placeholder="admin@pleatsssi.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1.5">
              Password
            </label>
            <div className="relative rounded-md shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#706D65]">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-[#D5D0C8] rounded-lg text-sm placeholder-[#9E9A90] text-[#1A1918] focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#0B4F3A] hover:bg-[#083C2C] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#0B4F3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
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
