'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, Mail, User as UserIcon, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { supabaseBrowserClient } from '@/lib/supabaseClient';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // If user is already logged in, redirect
    supabaseBrowserClient.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push(redirectPath);
      }
    });
  }, [redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error: signInError } = await supabaseBrowserClient.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message || 'Email atau kata sandi tidak valid.');
          setLoading(false);
          return;
        }

        if (data.user) {
          setSuccessMsg('Berhasil masuk! Mengalihkan...');
          setTimeout(() => {
            router.push(redirectPath);
            router.refresh();
          }, 600);
        }
      } else {
        const { data, error: signUpError } = await supabaseBrowserClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name.trim() || 'Pelanggan PLEATSSSI',
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message || 'Gagal mendaftar. Silakan coba lagi.');
          setLoading(false);
          return;
        }

        if (data.user) {
          setSuccessMsg('Akun berhasil dibuat! Silakan masuk menggunakan akun baru Anda.');
          setMode('login');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[75vh] bg-[#FAF7F2] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white border border-[#EADFD4] shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="font-['Italiana',serif] text-3xl uppercase tracking-[0.2em] text-[#1A1918] mb-2">
              {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun'}
            </h1>
            <p className="text-[12px] text-[#786E65]">
              Nikmati kemudahan berbelanja koleksi eksklusif PLEATSSSI.
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 border border-[#EADFD4] mb-6 p-1 bg-[#F5F0E6]">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
              className={`py-2.5 text-[11px] uppercase tracking-[0.18em] font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-[#1A1918] text-[#FAF7F2] shadow-xs'
                  : 'text-[#786E65] hover:text-[#1A1918]'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
              className={`py-2.5 text-[11px] uppercase tracking-[0.18em] font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-[#1A1918] text-[#FAF7F2] shadow-xs'
                  : 'text-[#786E65] hover:text-[#1A1918]'
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-[#8C2323]/10 border border-[#8C2323]/30 text-[#8C2323] text-[12px]">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-[#0B4F3A]/10 border border-[#0B4F3A]/30 text-[#0B4F3A] text-[12px]">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-[#786E65] font-semibold mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center">
                  <UserIcon size={16} strokeWidth={1.5} className="absolute left-3 text-[#786E65]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full border border-[#EADFD4] bg-white pl-10 pr-4 py-2.5 text-[13px] text-[#1A1918] placeholder:text-[#D4C9B8] focus:border-[#0B4F3A] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-[#786E65] font-semibold mb-1.5">
                Alamat Email
              </label>
              <div className="relative flex items-center">
                <Mail size={16} strokeWidth={1.5} className="absolute left-3 text-[#786E65]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full border border-[#EADFD4] bg-white pl-10 pr-4 py-2.5 text-[13px] text-[#1A1918] placeholder:text-[#D4C9B8] focus:border-[#0B4F3A] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-[#786E65] font-semibold mb-1.5">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <Lock size={16} strokeWidth={1.5} className="absolute left-3 text-[#786E65]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full border border-[#EADFD4] bg-white pl-10 pr-10 py-2.5 text-[13px] text-[#1A1918] placeholder:text-[#D4C9B8] focus:border-[#0B4F3A] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#786E65] hover:text-[#1A1918]"
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-[#1A1918] hover:bg-[#0B4F3A] text-[#FAF7F2] py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Masuk' : 'Daftar Akun'}</span>
                  <ArrowRight size={14} strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#EADFD4] flex items-center justify-center gap-2 text-[11px] text-[#786E65]">
            <ShieldCheck size={14} strokeWidth={1.5} className="text-[#0B4F3A]" />
            <span>Koneksi &amp; Data Pribadi Terenkripsi Aman</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
