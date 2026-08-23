'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, MapPin, CreditCard, Truck } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

type Step = 'address' | 'shipping' | 'payment' | 'confirm';

const STEPS: { key: Step; label: string }[] = [
  { key: 'address', label: 'Alamat' },
  { key: 'shipping', label: 'Pengiriman' },
  { key: 'payment', label: 'Pembayaran' },
  { key: 'confirm', label: 'Konfirmasi' },
];

const SHIPPING_OPTIONS = [
  { id: 'jne-reg', label: 'JNE Reguler', price: 15000, est: '2–3 hari kerja' },
  { id: 'jne-yes', label: 'JNE YES (Next Day)', price: 35000, est: '1 hari kerja' },
  { id: 'sicepat', label: 'SiCepat Reguler', price: 12000, est: '2–4 hari kerja' },
  { id: 'free', label: 'Gratis Ongkir JABODETABEK', price: 0, est: '1–2 hari kerja' },
];

const PAYMENT_METHODS = [
  { id: 'bca', label: 'BCA Virtual Account', icon: '🏦' },
  { id: 'mandiri', label: 'Mandiri Virtual Account', icon: '🏦' },
  { id: 'gopay', label: 'GoPay', icon: '💚' },
  { id: 'ovo', label: 'OVO', icon: '💜' },
  { id: 'qris', label: 'QRIS', icon: '📱' },
  { id: 'cod', label: 'Bayar di Tempat (COD)', icon: '💵' },
];

function formatIDR(n: number) {
  return 'IDR' + n.toLocaleString('id-ID');
}

interface AddressForm {
  name: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  district: string;
  address: string;
  postal: string;
  notes: string;
}

const EMPTY_ADDRESS: AddressForm = {
  name: '', phone: '', email: '', province: '', city: '',
  district: '', address: '', postal: '', notes: '',
};

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('address');
  const [address, setAddress] = useState<AddressForm>(EMPTY_ADDRESS);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0].id);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.price ?? 0;
  const discount = couponApplied ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal + shippingCost - discount;

  const stepIdx = STEPS.findIndex(s => s.key === step);

  /* ── Page entrance ── */
  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(mainRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  /* ── Step transition ── */
  const transitionStep = (next: Step) => {
    const el = stepContentRef.current;
    if (!el) { setStep(next); return; }
    gsap.to(el, {
      opacity: 0, x: -24, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        setStep(next);
        gsap.fromTo(el,
          { opacity: 0, x: 24 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' }
        );
      },
    });
  };

  const isAddressValid =
    address.name && address.phone && address.email &&
    address.city && address.address && address.postal;

  async function handlePlaceOrder() {
    if (!selectedPayment) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    clearCart();
    setOrderPlaced(true);
    setIsSubmitting(false);
  }

  /* ── Order success screen ── */
  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center bg-[#0B4F3A] mb-6">
          <Check size={28} strokeWidth={2.5} className="text-[#FAF7F2]" />
        </div>
        <h1 className="font-['Italiana',serif] text-3xl text-[#1A1918] uppercase tracking-[0.1em] mb-3">
          Pesanan Diterima
        </h1>
        <p className="text-[13px] text-[#786E65] max-w-sm mb-2">
          Terima kasih telah berbelanja di PLEATSSSI. Konfirmasi pesanan telah dikirim ke email kamu.
        </p>
        <p className="text-[11px] text-[#786E65] mb-8">
          Nomor Pesanan: <span className="font-semibold text-[#1A1918]">#PLT{Date.now().toString().slice(-6)}</span>
        </p>
        <Link
          href="/id/new-arrivals"
          className="inline-flex items-center gap-2 bg-[#1A1918] text-[#FAF7F2] px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#0B4F3A] transition-colors duration-300"
        >
          Lanjut Belanja
          <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>
    );
  }

  /* ── Empty cart guard ── */
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center gap-5">
        <p className="font-['Italiana',serif] text-2xl text-[#1A1918] uppercase tracking-[0.1em]">
          Keranjang Kosong
        </p>
        <p className="text-[13px] text-[#786E65]">Tambahkan produk dulu sebelum checkout.</p>
        <Link
          href="/id/new-arrivals"
          className="inline-flex items-center gap-2 bg-[#1A1918] text-[#FAF7F2] px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#0B4F3A] transition-colors"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div ref={mainRef} className="min-h-screen bg-[#FAF7F2]">
      {/* ── Top bar ── */}
      <div className="border-b border-[#EADFD4] bg-[#FAF7F2] px-4 py-4">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link href="/" className="font-['Italiana',serif] text-xl uppercase tracking-[0.22em] text-[#1A1918]">
            PLEATSSSI
          </Link>
          <div className="flex items-center gap-1">
            <ShieldCheck size={13} strokeWidth={1.5} className="text-[#0B4F3A]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#786E65]">Pembayaran Aman</span>
          </div>
        </div>
      </div>

      {/* ── Step indicator ── */}
      <div className="border-b border-[#EADFD4] bg-[#FAF7F2] px-4 py-4">
        <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 md:gap-6">
          {STEPS.map((s, i) => {
            const isActive = s.key === step;
            const isDone = i < stepIdx;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div className={cn(
                  'flex h-6 w-6 items-center justify-center text-[10px] font-semibold transition-all duration-300',
                  isActive ? 'bg-[#1A1918] text-[#FAF7F2]' :
                  isDone ? 'bg-[#0B4F3A] text-[#FAF7F2]' :
                  'border border-[#EADFD4] text-[#786E65]'
                )}>
                  {isDone ? <Check size={10} strokeWidth={2.5} /> : i + 1}
                </div>
                <span className={cn(
                  'text-[11px] uppercase tracking-[0.15em] font-medium hidden sm:block',
                  isActive ? 'text-[#1A1918]' : isDone ? 'text-[#0B4F3A]' : 'text-[#EADFD4]'
                )}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="ml-2 text-[#EADFD4] hidden sm:block">—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="mx-auto max-w-[1200px] px-4 py-8 grid gap-8 lg:grid-cols-[1fr_380px] items-start">

        {/* ── Step content ── */}
        <div ref={stepContentRef} style={{ willChange: 'opacity, transform' }}>

          {/* STEP: ADDRESS */}
          {step === 'address' && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={16} strokeWidth={1.5} className="text-[#0B4F3A]" />
                <h2 className="font-['Italiana',serif] text-xl uppercase tracking-[0.1em] text-[#1A1918]">
                  Alamat Pengiriman
                </h2>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nama Lengkap *" value={address.name} onChange={v => setAddress(a => ({ ...a, name: v }))} placeholder="Nama penerima" />
                  <Field label="Nomor Telepon *" value={address.phone} onChange={v => setAddress(a => ({ ...a, phone: v }))} placeholder="+62..." type="tel" />
                </div>
                <Field label="Email *" value={address.email} onChange={v => setAddress(a => ({ ...a, email: v }))} placeholder="email@kamu.com" type="email" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Provinsi *" value={address.province} onChange={v => setAddress(a => ({ ...a, province: v }))} placeholder="Pilih Provinsi" />
                  <Field label="Kota / Kabupaten *" value={address.city} onChange={v => setAddress(a => ({ ...a, city: v }))} placeholder="Kota/Kabupaten" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Kecamatan" value={address.district} onChange={v => setAddress(a => ({ ...a, district: v }))} placeholder="Kecamatan" />
                  <Field label="Kode Pos *" value={address.postal} onChange={v => setAddress(a => ({ ...a, postal: v }))} placeholder="00000" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] text-[#786E65] font-medium mb-1.5">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    rows={3}
                    value={address.address}
                    onChange={e => setAddress(a => ({ ...a, address: e.target.value }))}
                    placeholder="Jl. Nama Jalan, No. Rumah, RT/RW, Kelurahan..."
                    className="w-full border border-[#EADFD4] bg-white px-4 py-3 text-[13px] text-[#1A1918] placeholder:text-[#EADFD4] focus:border-[#0B4F3A] focus:outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] text-[#786E65] font-medium mb-1.5">
                    Catatan untuk Kurir (opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={address.notes}
                    onChange={e => setAddress(a => ({ ...a, notes: e.target.value }))}
                    placeholder="Contoh: Tolong hubungi sebelum antar"
                    className="w-full border border-[#EADFD4] bg-white px-4 py-3 text-[13px] text-[#1A1918] placeholder:text-[#EADFD4] focus:border-[#0B4F3A] focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Link href="/id/new-arrivals" className="flex items-center gap-1.5 text-[11px] text-[#786E65] hover:text-[#1A1918] transition-colors uppercase tracking-[0.15em]">
                  <ArrowLeft size={12} strokeWidth={2} />
                  Kembali Belanja
                </Link>
                <button
                  type="button"
                  disabled={!isAddressValid}
                  onClick={() => transitionStep('shipping')}
                  className={cn(
                    'flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all duration-300',
                    isAddressValid
                      ? 'bg-[#1A1918] text-[#FAF7F2] hover:bg-[#0B4F3A]'
                      : 'bg-[#EADFD4] text-[#786E65] cursor-not-allowed'
                  )}
                >
                  Pilih Pengiriman
                  <ArrowRight size={12} strokeWidth={2} />
                </button>
              </div>
            </section>
          )}

          {/* STEP: SHIPPING */}
          {step === 'shipping' && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Truck size={16} strokeWidth={1.5} className="text-[#0B4F3A]" />
                <h2 className="font-['Italiana',serif] text-xl uppercase tracking-[0.1em] text-[#1A1918]">
                  Pilih Kurir
                </h2>
              </div>

              <div className="space-y-3">
                {SHIPPING_OPTIONS.map(opt => (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex items-center justify-between border p-4 cursor-pointer transition-all duration-200',
                      selectedShipping === opt.id
                        ? 'border-[#1A1918] bg-[#1A1918]/4'
                        : 'border-[#EADFD4] hover:border-[#786E65]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        selectedShipping === opt.id ? 'border-[#1A1918]' : 'border-[#EADFD4]'
                      )}>
                        {selectedShipping === opt.id && (
                          <div className="h-2 w-2 rounded-full bg-[#1A1918]" />
                        )}
                      </div>
                      <input
                        type="radio"
                        className="sr-only"
                        checked={selectedShipping === opt.id}
                        onChange={() => setSelectedShipping(opt.id)}
                      />
                      <div>
                        <p className="text-[12px] font-semibold text-[#1A1918] uppercase tracking-[0.08em]">{opt.label}</p>
                        <p className="text-[11px] text-[#786E65]">Estimasi {opt.est}</p>
                      </div>
                    </div>
                    <span className={cn(
                      'text-[12px] font-semibold tabular-nums',
                      opt.price === 0 ? 'text-[#0B4F3A]' : 'text-[#1A1918]'
                    )}>
                      {opt.price === 0 ? 'GRATIS' : formatIDR(opt.price)}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button type="button" onClick={() => transitionStep('address')} className="flex items-center gap-1.5 text-[11px] text-[#786E65] hover:text-[#1A1918] transition-colors uppercase tracking-[0.15em]">
                  <ArrowLeft size={12} strokeWidth={2} />
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => transitionStep('payment')}
                  className="flex items-center gap-2 bg-[#1A1918] text-[#FAF7F2] px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#0B4F3A] transition-colors duration-300"
                >
                  Pilih Pembayaran
                  <ArrowRight size={12} strokeWidth={2} />
                </button>
              </div>
            </section>
          )}

          {/* STEP: PAYMENT */}
          {step === 'payment' && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <CreditCard size={16} strokeWidth={1.5} className="text-[#0B4F3A]" />
                <h2 className="font-['Italiana',serif] text-xl uppercase tracking-[0.1em] text-[#1A1918]">
                  Metode Pembayaran
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(m => (
                  <label
                    key={m.id}
                    className={cn(
                      'flex items-center gap-3 border p-4 cursor-pointer transition-all duration-200',
                      selectedPayment === m.id
                        ? 'border-[#1A1918] bg-[#1A1918]/4'
                        : 'border-[#EADFD4] hover:border-[#786E65]'
                    )}
                  >
                    <div className={cn(
                      'h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      selectedPayment === m.id ? 'border-[#1A1918]' : 'border-[#EADFD4]'
                    )}>
                      {selectedPayment === m.id && (
                        <div className="h-2 w-2 rounded-full bg-[#1A1918]" />
                      )}
                    </div>
                    <input type="radio" className="sr-only" checked={selectedPayment === m.id} onChange={() => setSelectedPayment(m.id)} />
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-[12px] font-medium text-[#1A1918]">{m.label}</span>
                  </label>
                ))}
              </div>

              {/* Coupon */}
              <div className="mt-6 border-t border-[#EADFD4] pt-5">
                <p className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#786E65] mb-3">
                  Kode Kupon
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Masukkan kode kupon"
                    disabled={couponApplied}
                    className="flex-1 border border-[#EADFD4] bg-white px-4 py-2.5 text-[12px] text-[#1A1918] placeholder:text-[#EADFD4] focus:border-[#0B4F3A] focus:outline-none transition-colors disabled:bg-[#F5F0E6] disabled:text-[#786E65]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (coupon === 'PLEATSSSI10') setCouponApplied(true);
                    }}
                    disabled={couponApplied || !coupon}
                    className={cn(
                      'px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors',
                      couponApplied
                        ? 'bg-[#0B4F3A] text-[#FAF7F2]'
                        : coupon
                        ? 'bg-[#1A1918] text-[#FAF7F2] hover:bg-[#0B4F3A]'
                        : 'bg-[#EADFD4] text-[#786E65] cursor-not-allowed'
                    )}
                  >
                    {couponApplied ? <Check size={14} strokeWidth={2.5} /> : 'Pakai'}
                  </button>
                </div>
                {couponApplied && (
                  <p className="mt-2 text-[11px] text-[#0B4F3A] font-medium">
                    Kupon PLEATSSSI10 — Diskon 10% berhasil diterapkan
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button type="button" onClick={() => transitionStep('shipping')} className="flex items-center gap-1.5 text-[11px] text-[#786E65] hover:text-[#1A1918] transition-colors uppercase tracking-[0.15em]">
                  <ArrowLeft size={12} strokeWidth={2} />
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={!selectedPayment}
                  onClick={() => transitionStep('confirm')}
                  className={cn(
                    'flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all duration-300',
                    selectedPayment
                      ? 'bg-[#1A1918] text-[#FAF7F2] hover:bg-[#0B4F3A]'
                      : 'bg-[#EADFD4] text-[#786E65] cursor-not-allowed'
                  )}
                >
                  Tinjau Pesanan
                  <ArrowRight size={12} strokeWidth={2} />
                </button>
              </div>
            </section>
          )}

          {/* STEP: CONFIRM */}
          {step === 'confirm' && (
            <section>
              <h2 className="font-['Italiana',serif] text-xl uppercase tracking-[0.1em] text-[#1A1918] mb-6">
                Tinjau Pesanan
              </h2>

              {/* Address summary */}
              <div className="border border-[#EADFD4] p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#786E65]">Alamat Pengiriman</p>
                  <button type="button" onClick={() => transitionStep('address')} className="text-[10px] uppercase tracking-[0.15em] text-[#786E65] hover:text-[#0B4F3A] transition-colors underline">Ubah</button>
                </div>
                <p className="text-[13px] text-[#1A1918] font-medium">{address.name}</p>
                <p className="text-[12px] text-[#786E65]">{address.phone} · {address.email}</p>
                <p className="text-[12px] text-[#786E65] mt-0.5">{address.address}, {address.district}, {address.city}, {address.province} {address.postal}</p>
              </div>

              {/* Shipping summary */}
              <div className="border border-[#EADFD4] p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#786E65]">Kurir</p>
                  <button type="button" onClick={() => transitionStep('shipping')} className="text-[10px] uppercase tracking-[0.15em] text-[#786E65] hover:text-[#0B4F3A] transition-colors underline">Ubah</button>
                </div>
                <p className="text-[13px] text-[#1A1918] font-medium">
                  {SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.label}
                </p>
                <p className="text-[12px] text-[#786E65]">
                  Est. {SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.est} ·{' '}
                  <span className={shippingCost === 0 ? 'text-[#0B4F3A] font-medium' : ''}>
                    {shippingCost === 0 ? 'GRATIS' : formatIDR(shippingCost)}
                  </span>
                </p>
              </div>

              {/* Payment summary */}
              <div className="border border-[#EADFD4] p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#786E65]">Pembayaran</p>
                  <button type="button" onClick={() => transitionStep('payment')} className="text-[10px] uppercase tracking-[0.15em] text-[#786E65] hover:text-[#0B4F3A] transition-colors underline">Ubah</button>
                </div>
                <p className="text-[13px] text-[#1A1918] font-medium">
                  {PAYMENT_METHODS.find(m => m.id === selectedPayment)?.icon}{' '}
                  {PAYMENT_METHODS.find(m => m.id === selectedPayment)?.label}
                </p>
              </div>

              {/* Place order */}
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => transitionStep('payment')} className="flex items-center gap-1.5 text-[11px] text-[#786E65] hover:text-[#1A1918] transition-colors uppercase tracking-[0.15em]">
                  <ArrowLeft size={12} strokeWidth={2} />
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="relative flex items-center gap-2 bg-[#1A1918] text-[#FAF7F2] px-8 py-4 text-[11px] uppercase tracking-[0.22em] font-semibold hover:bg-[#0B4F3A] transition-colors duration-300 overflow-hidden group disabled:opacity-70"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#FAF7F2] border-t-transparent" />
                      Memproses...
                    </span>
                  ) : (
                    <>
                      Buat Pesanan — {formatIDR(total)}
                      <ArrowRight size={12} strokeWidth={2} />
                    </>
                  )}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* ── Order summary sidebar ── */}
        <aside className="border border-[#EADFD4] bg-white p-5 lg:sticky lg:top-24 self-start">
          <h3 className="font-['Italiana',serif] text-lg uppercase tracking-[0.1em] text-[#1A1918] border-b border-[#EADFD4] pb-3 mb-4">
            Ringkasan Pesanan
          </h3>

          {/* Items */}
          <ul className="space-y-3 mb-5">
            {items.map(item => (
              <li key={item.variantId} className="flex gap-3 items-start">
                <div className="relative h-14 w-11 flex-shrink-0 overflow-hidden border border-[#EADFD4] bg-[#F5F0E6]">
                  <Image src={item.imageUrl} alt={item.name} fill sizes="44px" className="object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center bg-[#786E65] text-[#FAF7F2] text-[9px] font-bold rounded-full">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#1A1918] uppercase tracking-[0.06em] truncate">{item.name}</p>
                  <p className="text-[10px] text-[#786E65]">{item.variantLabel}</p>
                </div>
                <span className="text-[11px] font-semibold text-[#1A1918] tabular-nums flex-shrink-0">
                  {formatIDR(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="space-y-2 border-t border-[#EADFD4] pt-4">
            <div className="flex justify-between text-[12px]">
              <span className="text-[#786E65]">Subtotal</span>
              <span className="text-[#1A1918] font-medium tabular-nums">{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#786E65]">Pengiriman</span>
              <span className={cn('font-medium tabular-nums', shippingCost === 0 ? 'text-[#0B4F3A]' : 'text-[#1A1918]')}>
                {shippingCost === 0 ? 'GRATIS' : formatIDR(shippingCost)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[12px]">
                <span className="text-[#0B4F3A]">Diskon Kupon</span>
                <span className="text-[#0B4F3A] font-medium tabular-nums">−{formatIDR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#EADFD4] pt-3 mt-1">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#1A1918]">Total</span>
              <span className="text-[15px] font-bold text-[#1A1918] tabular-nums">{formatIDR(total)}</span>
            </div>
          </div>

          {/* Tax note */}
          <p className="mt-3 text-[10px] text-[#786E65] leading-relaxed">
            Pajak &amp; bea cukai sudah termasuk dalam harga produk.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = 'text'
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.15em] text-[#786E65] font-medium mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#EADFD4] bg-white px-4 py-2.5 text-[13px] text-[#1A1918] placeholder:text-[#EADFD4] focus:border-[#0B4F3A] focus:outline-none transition-colors"
      />
    </div>
  );
}
