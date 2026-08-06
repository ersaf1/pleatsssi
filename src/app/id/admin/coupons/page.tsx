'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  Ticket,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Percent,
  DollarSign,
  Calendar,
} from 'lucide-react';
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  type Coupon,
} from '@/lib/services/couponService';
import { isSupabaseConfigured } from '@/lib/services/serviceUtils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'fixed' | 'percentage'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [isLiveDb, setIsLiveDb] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Delete modal state
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    min_purchase: 100000,
    max_discount: '' as string | number,
    quota: '' as string | number,
    starts_at: new Date().toISOString().slice(0, 16),
    expires_at: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
    is_active: true,
  });

  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const isConfigured = isSupabaseConfigured();
      setIsLiveDb(isConfigured);
      const data = await getAllCoupons();
      setCoupons(data);
    } catch {
      showNotification('error', 'Failed to load coupons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    const now = new Date();
    const expiry = new Date(Date.now() + 30 * 86400000);
    setFormData({
      code: '',
      type: 'percentage',
      value: 10,
      min_purchase: 100000,
      max_discount: '',
      quota: '',
      starts_at: now.toISOString().slice(0, 16),
      expires_at: expiry.toISOString().slice(0, 16),
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      min_purchase: coupon.min_purchase,
      max_discount: coupon.max_discount !== null ? coupon.max_discount : '',
      quota: coupon.quota !== null ? coupon.quota : '',
      starts_at: new Date(coupon.starts_at).toISOString().slice(0, 16),
      expires_at: new Date(coupon.expires_at).toISOString().slice(0, 16),
      is_active: coupon.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      showNotification('error', 'Coupon code is required.');
      return;
    }
    if (Number(formData.value) <= 0) {
      showNotification('error', 'Discount value must be greater than zero.');
      return;
    }

    setSaving(true);

    const parsedMaxDiscount =
      formData.max_discount !== '' && formData.max_discount !== null && !isNaN(Number(formData.max_discount))
        ? Number(formData.max_discount)
        : null;

    const parsedQuota =
      formData.quota !== '' && formData.quota !== null && !isNaN(Number(formData.quota))
        ? Number(formData.quota)
        : null;

    const payload = {
      code: formData.code.trim().toUpperCase(),
      type: formData.type,
      value: Number(formData.value),
      min_purchase: Number(formData.min_purchase) || 0,
      max_discount: parsedMaxDiscount,
      quota: parsedQuota,
      starts_at: new Date(formData.starts_at).toISOString(),
      expires_at: new Date(formData.expires_at).toISOString(),
      is_active: formData.is_active,
    };

    if (editingCoupon) {
      const { data, error } = await updateCoupon(editingCoupon.id, payload);
      setSaving(false);

      if (error) {
        showNotification('error', error);
        return;
      }

      if (data) {
        setCoupons((prev) => prev.map((c) => (c.id === data.id ? data : c)));
        showNotification('success', `Coupon ${data.code} updated successfully!`);
      } else {
        // Fallback for mock mode
        const updatedMock: Coupon = { ...editingCoupon, ...payload };
        setCoupons((prev) => prev.map((c) => (c.id === editingCoupon.id ? updatedMock : c)));
        showNotification('success', `Coupon ${payload.code} updated (Mock mode)!`);
      }
    } else {
      const { data, error } = await createCoupon(payload);
      setSaving(false);

      if (error) {
        showNotification('error', error);
        return;
      }

      if (data) {
        setCoupons((prev) => [data, ...prev]);
        showNotification('success', `Coupon ${data.code} created successfully!`);
      } else {
        // Fallback create mock
        const newMock: Coupon = {
          id: `c-mock-${Date.now()}`,
          used_count: 0,
          ...payload,
        };
        setCoupons((prev) => [newMock, ...prev]);
        showNotification('success', `Coupon ${payload.code} created (Mock mode)!`);
      }
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    const updatedStatus = !coupon.is_active;
    const { data, error } = await updateCoupon(coupon.id, { is_active: updatedStatus });
    if (error) {
      showNotification('error', error);
      return;
    }

    const updated = data || { ...coupon, is_active: updatedStatus };
    setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? updated : c)));
    showNotification('success', `Coupon ${coupon.code} ${updatedStatus ? 'activated' : 'deactivated'}.`);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCoupon) return;

    setIsDeleting(true);
    const { success, error } = await deleteCoupon(deletingCoupon.id);
    setIsDeleting(false);

    if (error && isLiveDb) {
      showNotification('error', error);
      return;
    }

    setCoupons((prev) => prev.filter((c) => c.id !== deletingCoupon.id));
    showNotification('success', `Coupon ${deletingCoupon.code} deleted.`);
    setDeletingCoupon(null);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || coupon.code.toLowerCase().includes(q);
    const matchesType = selectedType === 'all' || coupon.type === selectedType;

    const isExpired = new Date(coupon.expires_at).getTime() < Date.now();

    let matchesStatus = true;
    if (selectedStatus === 'active') matchesStatus = coupon.is_active && !isExpired;
    else if (selectedStatus === 'inactive') matchesStatus = !coupon.is_active;
    else if (selectedStatus === 'expired') matchesStatus = isExpired;

    return matchesQuery && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E5E0D8] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1918]">
              Coupons & Discounts
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isLiveDb
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isLiveDb ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Live Database
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" /> Static Fallback
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-[#706D65] mt-1">
            Configure promotional promo codes, minimum spend thresholds, and usage limits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchCoupons}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 text-sm font-medium text-[#1A1918] bg-white border border-[#E5E0D8] rounded-lg hover:bg-[#FAF7F2] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-[#0B4F3A] rounded-lg hover:bg-[#083C2C] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-xs flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706D65]" />
          <input
            type="text"
            placeholder="Search by code (e.g. WELCOME10)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-sm text-[#1A1918] focus:outline-none focus:border-[#0B4F3A] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <div className="flex items-center space-x-1.5 bg-[#FAF7F2] p-1 rounded-lg border border-[#E5E0D8]">
            {(['all', 'percentage', 'fixed'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                  selectedType === t
                    ? 'bg-[#0B4F3A] text-white shadow-xs'
                    : 'text-[#4A4741] hover:text-[#0B4F3A]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-[#FAF7F2] p-1 rounded-lg border border-[#E5E0D8]">
            {(['all', 'active', 'inactive', 'expired'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                  selectedStatus === s
                    ? 'bg-[#0B4F3A] text-white shadow-xs'
                    : 'text-[#4A4741] hover:text-[#0B4F3A]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coupons Data Table */}
      <div className="bg-white rounded-xl border border-[#E5E0D8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#706D65]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B4F3A] mb-3" />
            <p className="text-sm font-medium">Loading discount coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-12 text-center text-[#706D65]">
            <Ticket className="w-12 h-12 mx-auto text-[#706D65]/40 mb-3" />
            <p className="text-base font-serif font-bold text-[#1A1918]">No Coupons Found</p>
            <p className="text-xs mt-1">Create a new promotional code or modify search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1A1918]">
              <thead className="bg-[#FAF7F2] text-[#706D65] uppercase text-xs tracking-wider font-semibold border-b border-[#E5E0D8]">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount Value</th>
                  <th className="py-3 px-4">Min. Spend</th>
                  <th className="py-3 px-4">Max. Discount</th>
                  <th className="py-3 px-4 text-center">Usage / Quota</th>
                  <th className="py-3 px-4">Validity Period</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {filteredCoupons.map((coupon) => {
                  const isExpired = new Date(coupon.expires_at).getTime() < Date.now();
                  return (
                    <tr key={coupon.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Code Badge */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm">
                        <span className="inline-flex items-center space-x-1.5 bg-[#0B4F3A]/10 text-[#0B4F3A] px-2.5 py-1 rounded-md border border-[#0B4F3A]/20">
                          <Ticket className="w-3.5 h-3.5" />
                          <span>{coupon.code}</span>
                        </span>
                      </td>

                      {/* Discount Value */}
                      <td className="py-3.5 px-4 font-semibold text-[#1A1918]">
                        {coupon.type === 'percentage' ? (
                          <span className="flex items-center text-purple-700">
                            <Percent className="w-3.5 h-3.5 mr-1" /> {coupon.value}% Off
                          </span>
                        ) : (
                          <span className="flex items-center text-emerald-700">
                            <DollarSign className="w-3.5 h-3.5 mr-0.5" /> {formatCurrency(coupon.value)}
                          </span>
                        )}
                      </td>

                      {/* Min Purchase */}
                      <td className="py-3.5 px-4 text-[#706D65]">
                        {coupon.min_purchase > 0 ? formatCurrency(coupon.min_purchase) : 'No Minimum'}
                      </td>

                      {/* Max Discount */}
                      <td className="py-3.5 px-4 text-[#706D65]">
                        {coupon.max_discount ? formatCurrency(coupon.max_discount) : 'Unlimited'}
                      </td>

                      {/* Quota & Usage */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs">
                        <span className="font-semibold text-[#1A1918]">{coupon.used_count}</span>
                        <span className="text-[#706D65]">
                          {' / '}
                          {coupon.quota !== null ? coupon.quota : '∞'}
                        </span>
                      </td>

                      {/* Validity Period */}
                      <td className="py-3.5 px-4 text-xs text-[#706D65]">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-[#0B4F3A]" />
                          <span>
                            {new Date(coupon.starts_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}{' '}
                            -{' '}
                            {new Date(coupon.expires_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          disabled={isExpired}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            isExpired
                              ? 'bg-red-100 text-red-700 border-red-300 cursor-not-allowed'
                              : coupon.is_active
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {isExpired ? 'Expired' : coupon.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(coupon)}
                          className="p-1.5 text-[#0B4F3A] hover:bg-[#0B4F3A]/10 rounded-md transition-colors"
                          title="Edit Coupon"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCoupon(coupon)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E5E0D8] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <div className="flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-[#0B4F3A]" />
                <h2 className="font-serif font-bold text-xl text-[#1A1918]">
                  {editingCoupon ? 'Edit Discount Coupon' : 'Create New Coupon'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#706D65] hover:text-[#1A1918] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* Code & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-[#1A1918] font-mono font-bold uppercase focus:outline-none focus:border-[#0B4F3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-[#1A1918] focus:outline-none focus:border-[#0B4F3A]"
                  >
                    <option value="percentage">Percentage (%) Off</option>
                    <option value="fixed">Fixed Amount (IDR) Off</option>
                  </select>
                </div>
              </div>

              {/* Value & Min Purchase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Discount Value * ({formData.type === 'percentage' ? '%' : 'IDR'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder={formData.type === 'percentage' ? '10' : '50000'}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-[#1A1918] focus:outline-none focus:border-[#0B4F3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Minimum Purchase (IDR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.min_purchase}
                    onChange={(e) => setFormData({ ...formData, min_purchase: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-[#1A1918] focus:outline-none focus:border-[#0B4F3A]"
                  />
                </div>
              </div>

              {/* Max Discount & Quota */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Max Discount Cap (IDR) (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Leave empty for no limit"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-[#1A1918] focus:outline-none focus:border-[#0B4F3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Usage Quota Limit (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Leave empty for unlimited"
                    value={formData.quota}
                    onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-[#1A1918] focus:outline-none focus:border-[#0B4F3A]"
                  />
                </div>
              </div>

              {/* Start & Expiry Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E5E0D8] pt-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Starts At *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-[#1A1918] focus:outline-none focus:border-[#0B4F3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Expires At *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-[#1A1918] focus:outline-none focus:border-[#0B4F3A]"
                    required
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="coupon_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#0B4F3A] rounded border-[#E5E0D8] focus:ring-[#0B4F3A]"
                />
                <label htmlFor="coupon_active" className="text-xs font-semibold text-[#1A1918]">
                  Enable Coupon Code (Active)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-3 border-t border-[#E5E0D8] pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E0D8] rounded-lg text-xs font-semibold text-[#706D65] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 px-5 py-2 bg-[#0B4F3A] text-white rounded-lg text-xs font-semibold hover:bg-[#083C2C] disabled:opacity-50 shadow-xs"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCoupon ? 'Save Changes' : 'Create Coupon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCoupon && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E0D8] space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif font-bold text-lg text-[#1A1918]">Confirm Coupon Deletion</h3>
            </div>

            <p className="text-xs text-[#706D65]">
              Are you sure you want to delete promo code{' '}
              <strong className="text-[#1A1918]">&ldquo;{deletingCoupon.code}&rdquo;</strong>? Customers will no
              longer be able to apply this discount.
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-[#E5E0D8]">
              <button
                onClick={() => setDeletingCoupon(null)}
                className="px-4 py-2 border border-[#E5E0D8] rounded-lg text-xs font-semibold text-[#706D65] hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Coupon</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
