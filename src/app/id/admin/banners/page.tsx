'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
  type Banner,
} from '@/lib/services/bannerService';
import { isSupabaseConfigured } from '@/lib/services/serviceUtils';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'hero' | 'promo' | 'lifestyle'>('all');
  const [isLiveDb, setIsLiveDb] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Delete State
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'hero' as 'hero' | 'promo' | 'lifestyle',
    title: '',
    subtitle: '',
    image_url_desktop: '',
    image_url_mobile: '',
    cta_label: '',
    cta_url: '',
    sort_order: 1,
    is_active: true,
  });

  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const isConfigured = isSupabaseConfigured();
      setIsLiveDb(isConfigured);
      const data = await getAllBanners();
      setBanners(data);
    } catch {
      showNotification('error', 'Failed to load banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      type: 'hero',
      title: '',
      subtitle: '',
      image_url_desktop: '',
      image_url_mobile: '',
      cta_label: '',
      cta_url: '',
      sort_order: (banners.length || 0) + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      type: banner.type,
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image_url_desktop: banner.image_url_desktop || '',
      image_url_mobile: banner.image_url_mobile || '',
      cta_label: banner.cta_label || '',
      cta_url: banner.cta_url || '',
      sort_order: banner.sort_order || 1,
      is_active: banner.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDesktopImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDesktop(true);
    const { url, error } = await uploadBannerImage(file);
    setUploadingDesktop(false);

    if (error || !url) {
      showNotification('error', error || 'Failed to upload desktop banner image.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image_url_desktop: url,
      image_url_mobile: prev.image_url_mobile || url,
    }));
    showNotification('success', 'Desktop banner image uploaded to Storage!');
  };

  const handleMobileImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMobile(true);
    const { url, error } = await uploadBannerImage(file);
    setUploadingMobile(false);

    if (error || !url) {
      showNotification('error', error || 'Failed to upload mobile banner image.');
      return;
    }

    setFormData((prev) => ({ ...prev, image_url_mobile: url }));
    showNotification('success', 'Mobile banner image uploaded to Storage!');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.image_url_desktop.trim()) {
      showNotification('error', 'Desktop image URL is required.');
      return;
    }

    setSaving(true);
    const payload = {
      type: formData.type,
      title: formData.title.trim() ? formData.title.trim() : null,
      subtitle: formData.subtitle.trim() ? formData.subtitle.trim() : null,
      image_url_desktop: formData.image_url_desktop.trim(),
      image_url_mobile: formData.image_url_mobile.trim() || formData.image_url_desktop.trim(),
      cta_label: formData.cta_label.trim() ? formData.cta_label.trim() : null,
      cta_url: formData.cta_url.trim() ? formData.cta_url.trim() : null,
      sort_order: Number(formData.sort_order) || 0,
      is_active: formData.is_active,
    };

    if (editingBanner) {
      const { data, error } = await updateBanner(editingBanner.id, payload);
      setSaving(false);

      if (error) {
        showNotification('error', error);
        return;
      }

      if (data) {
        setBanners((prev) => prev.map((b) => (b.id === data.id ? data : b)));
        showNotification('success', 'Banner updated successfully!');
      } else {
        const updatedMock: Banner = { ...editingBanner, ...payload };
        setBanners((prev) => prev.map((b) => (b.id === editingBanner.id ? updatedMock : b)));
        showNotification('success', 'Banner updated (Mock mode)!');
      }
    } else {
      const { data, error } = await createBanner(payload);
      setSaving(false);

      if (error) {
        showNotification('error', error);
        return;
      }

      if (data) {
        setBanners((prev) => [...prev, data]);
        showNotification('success', 'Banner created successfully!');
      } else {
        const newMock: Banner = {
          id: `b-mock-${Date.now()}`,
          ...payload,
        };
        setBanners((prev) => [...prev, newMock]);
        showNotification('success', 'Banner created (Mock mode)!');
      }
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = async (banner: Banner) => {
    const updatedStatus = !banner.is_active;
    const { data, error } = await updateBanner(banner.id, { is_active: updatedStatus });
    if (error) {
      showNotification('error', error);
      return;
    }

    const updated = data || { ...banner, is_active: updatedStatus };
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? updated : b)));
    showNotification('success', `Banner marked as ${updatedStatus ? 'active' : 'inactive'}.`);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBanner) return;

    setIsDeleting(true);
    const { error } = await deleteBanner(deletingBanner.id);
    setIsDeleting(false);

    if (error && isLiveDb) {
      showNotification('error', error);
      return;
    }

    setBanners((prev) => prev.filter((b) => b.id !== deletingBanner.id));
    showNotification('success', `Banner "${deletingBanner.title || 'Untitled'}" deleted.`);
    setDeletingBanner(null);
  };

  const filteredBanners = banners.filter((b) => {
    const matchesType = selectedType === 'all' || b.type === selectedType;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
      (b.cta_label && b.cta_label.toLowerCase().includes(q)) ||
      (b.cta_url && b.cta_url.toLowerCase().includes(q));

    return matchesType && matchesQuery;
  });

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'hero':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold px-2.5 py-1 rounded-full';
      case 'promo':
        return 'bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full';
      case 'lifestyle':
        return 'bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold px-2.5 py-1 rounded-full';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="font-bold text-2xl sm:text-3xl text-[#0F172A]">
              Banner Management
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                isLiveDb
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {isLiveDb ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Live Database
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Static Fallback
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            Manage storefront hero carousels, promo headers, and lifestyle visual assets.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchBanners}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 text-sm font-semibold text-[#334155] bg-white border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-[#0B4F3A] hover:bg-[#083C2C] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banner</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Type Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by title, subtitle, or CTA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:ring-2 focus:ring-[#0B4F3A] bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-1.5 bg-[#F8FAFC] p-1.5 rounded-xl border border-[#E2E8F0]">
          <span className="text-[10px] font-bold text-[#475569] uppercase px-1">Type:</span>
          {(['all', 'hero', 'promo', 'lifestyle'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                selectedType === type
                  ? 'bg-[#0B4F3A] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0B4F3A]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Banner Data Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#64748B]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B4F3A] mb-3" />
            <p className="text-sm font-medium">Loading banners...</p>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="p-12 text-center text-[#64748B]">
            <ImageIcon className="w-12 h-12 mx-auto text-[#CBD5E1] mb-3" />
            <p className="text-base font-bold text-[#0F172A]">No Banners Found</p>
            <p className="text-xs mt-1">Try adjusting your search filters or add a new banner.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0F172A]">
              <thead className="bg-[#F8FAFC] text-[#475569] uppercase text-[11px] tracking-wider font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-4">Preview</th>
                  <th className="py-3.5 px-4">Banner Details</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">CTA Link</th>
                  <th className="py-3.5 px-4 text-center">Order</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredBanners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-[#F8FAFC]/70 transition-colors border-b border-[#F1F5F9]">
                    {/* Image Preview */}
                    <td className="py-3 px-4">
                      <div className="relative w-24 h-14 bg-[#F8FAFC] rounded-xl overflow-hidden border border-[#E2E8F0] flex items-center justify-center">
                        {banner.image_url_desktop ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={banner.image_url_desktop}
                            alt={banner.title || 'Banner'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-[#94A3B8]" />
                        )}
                      </div>
                    </td>

                    {/* Banner Title & Subtitle */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#0F172A]">
                        {banner.title || <span className="text-[#94A3B8] italic">No Title</span>}
                      </p>
                      <p className="text-xs text-[#64748B] truncate max-w-xs mt-0.5">
                        {banner.subtitle || 'No subtitle provided'}
                      </p>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3 px-4">
                      <span className={getTypeBadgeClass(banner.type)}>
                        {banner.type}
                      </span>
                    </td>

                    {/* CTA Info */}
                    <td className="py-3 px-4">
                      {banner.cta_label ? (
                        <div>
                          <span className="text-xs font-semibold text-[#0B4F3A]">
                            {banner.cta_label}
                          </span>
                          <span className="text-[11px] text-[#64748B] block font-mono truncate max-w-[150px]">
                            {banner.cta_url || '#'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#94A3B8] italic">None</span>
                      )}
                    </td>

                    {/* Sort Order */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#0F172A]">
                      {banner.sort_order}
                    </td>

                    {/* Status Toggle Badge */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(banner)}
                        className={`transition-colors ${
                          banner.is_active
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full hover:bg-slate-200'
                        }`}
                      >
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(banner)}
                          className="text-[#0B4F3A] hover:bg-[#0B4F3A]/10 p-2 rounded-lg transition-colors"
                          title="Edit Banner"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingBanner(banner)}
                          className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl border border-[#E2E8F0] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ImageIcon className="w-5 h-5 text-[#0B4F3A]" />
                <h2 className="font-bold text-lg text-[#0F172A]">
                  {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 text-sm overflow-y-auto flex-1">
                {/* Type & Sort Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Banner Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as 'hero' | 'promo' | 'lifestyle' })
                      }
                      className="w-full px-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                    >
                      <option value="hero">Hero Slider (Homepage top)</option>
                      <option value="promo">Promotional Header Banner</option>
                      <option value="lifestyle">Lifestyle Showcase Banner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Sort Order Priority
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                    />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Banner Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Koleksi Terbaru PLEATSSSI"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Temukan keanggunan lipit modern"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                  />
                </div>

                {/* Desktop Image Upload & URL */}
                <div className="space-y-2 border-t border-[#E2E8F0] pt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                    Desktop Image Asset *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://... or /images/hero-desktop.png"
                      value={formData.image_url_desktop}
                      onChange={(e) => setFormData({ ...formData, image_url_desktop: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-xs placeholder-[#94A3B8] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                    />
                    <label className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#0B4F3A]/10 text-[#0B4F3A] hover:bg-[#0B4F3A]/20 rounded-xl cursor-pointer text-xs font-bold transition-colors">
                      {uploadingDesktop ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDesktopImageUpload}
                        disabled={uploadingDesktop}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Mobile Image Upload & URL */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                    Mobile Image Asset (Optional - falls back to Desktop Image)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://... or /images/hero-mobile.png"
                      value={formData.image_url_mobile}
                      onChange={(e) => setFormData({ ...formData, image_url_mobile: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-xs placeholder-[#94A3B8] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                    />
                    <label className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#0B4F3A]/10 text-[#0B4F3A] hover:bg-[#0B4F3A]/20 rounded-xl cursor-pointer text-xs font-bold transition-colors">
                      {uploadingMobile ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMobileImageUpload}
                        disabled={uploadingMobile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* CTA Label & URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E2E8F0] pt-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      CTA Button Label (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Belanja Sekarang"
                      value={formData.cta_label}
                      onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      CTA Target URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /id/skirts or /id/new-arrivals"
                      value={formData.cta_url}
                      onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center space-x-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-[#0B4F3A] rounded border-[#CBD5E1] focus:ring-[#0B4F3A]"
                  />
                  <label htmlFor="is_active" className="text-xs font-semibold text-[#0F172A]">
                    Publish banner immediately (Active)
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] bg-white border border-[#CBD5E1] rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#0B4F3A] hover:bg-[#083C2C] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingBanner ? 'Save Changes' : 'Create Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 text-rose-600">
                <div className="p-2.5 bg-rose-50 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#0F172A]">Confirm Banner Deletion</h3>
              </div>

              <p className="text-sm text-[#64748B]">
                Are you sure you want to delete the banner{' '}
                <strong className="text-[#0F172A]">&quot;{deletingBanner.title || 'Untitled Banner'}&quot;</strong>?
                This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end space-x-3">
              <button
                onClick={() => setDeletingBanner(null)}
                className="px-4 py-2.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] bg-white border border-[#CBD5E1] rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Delete Banner</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
