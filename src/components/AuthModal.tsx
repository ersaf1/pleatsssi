'use client';

import { useState } from 'react';
import { X, Loader2, Lock, Mail, User as UserIcon, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabaseBrowserClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register';
  message?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'login',
  message = 'Silakan masuk ke akun PLEATSSSI Anda untuk melanjutkan.',
}: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

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
          setError(signInError.message || 'Email atau kata sandi salah.');
          setLoading(false);
          return;
        }

        if (data.user) {
          setSuccessMsg('Berhasil masuk! Melanjutkan pesanan...');
          router.refresh();
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 800);
        }
      } else {
        // Register mode
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
          setSuccessMsg('Akun berhasil dibuat! Silakan masuk.');
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1918]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF7F2] border border-[#EADFD4] shadow-2xl p-6 sm:p-8 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-5 right-5 text-[#786E65] hover:text-[#1A1918] transition-colors p-1"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <span className="font-['Italiana',serif] text-2xl uppercase tracking-[0.25em] text-[#1A1918] block mb-2">
            PLEATSSSI
          </span>
          <p className="text-[12px] text-[#786E65] leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 border border-[#EADFD4] mb-6 p-1 bg-[#F5F0E6]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
            className={`py-2 text-[11px] uppercase tracking-[0.18em] font-semibold transition-all ${
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
            className={`py-2 text-[11px] uppercase tracking-[0.18em] font-semibold transition-all ${
              mode === 'register'
                ? 'bg-[#1A1918] text-[#FAF7F2] shadow-xs'
                : 'text-[#786E65] hover:text-[#1A1918]'
            }`}
          >
            Daftar Akun
          </button>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="mb-4 p-3 bg-[#8C2323]/10 border border-[#8C2323]/30 text-[#8C2323] text-[12px] rounded-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-[#0B4F3A]/10 border border-[#0B4F3A]/30 text-[#0B4F3A] text-[12px] rounded-xs">
            {successMsg}
          </div>
        )}

        {/* Auth Form */}
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
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#1A1918] hover:bg-[#0B4F3A] text-[#FAF7F2] py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
                <ArrowRight size={14} strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-[#786E65] text-center mt-5 leading-relaxed">
          Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi PLEATSSSI.
        </p>
      </div>
    </div>
  );
}
