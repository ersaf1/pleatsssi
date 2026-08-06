'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  Code,
  HelpCircle,
  Truck,
  ShieldCheck,
  Ruler,
} from 'lucide-react';
import {
  getAllInfoPages,
  createOrUpdateInfoPage,
  deleteInfoPage,
  type InfoPageItem,
} from '@/lib/services/infoPageService';
import { isSupabaseConfigured } from '@/lib/services/serviceUtils';

export default function AdminInfoPagesPage() {
  const [pages, setPages] = useState<InfoPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveDb, setIsLiveDb] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<InfoPageItem | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  // Delete State
  const [deletingPage, setDeletingPage] = useState<InfoPageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
  });

  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const isConfigured = isSupabaseConfigured();
      setIsLiveDb(isConfigured);
      const data = await getAllInfoPages();
      setPages(data);
    } catch {
      showNotification('error', 'Failed to load info pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleOpenCreateModal = (presetSlug?: string, presetTitle?: string) => {
    setEditingPage(null);
    setIsSlugEdited(Boolean(presetSlug));
    setActiveTab('editor');
    setFormData({
      title: presetTitle || '',
      slug: presetSlug || '',
      content: getSampleContent(presetSlug || 'default'),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (page: InfoPageItem) => {
    setEditingPage(page);
    setIsSlugEdited(true);
    setActiveTab('editor');
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const newSlug = !isSlugEdited && !editingPage
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : prev.slug;
      return { ...prev, title: val, slug: newSlug };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showNotification('error', 'Page title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      showNotification('error', 'Page slug is required.');
      return;
    }
    if (!formData.content.trim()) {
      showNotification('error', 'Content cannot be empty.');
      return;
    }

    setSaving(true);
    const { data, error } = await createOrUpdateInfoPage({
      id: editingPage?.id,
      slug: formData.slug.trim().toLowerCase(),
      title: formData.title.trim(),
      content: formData.content,
    });
    setSaving(false);

    if (error) {
      showNotification('error', error);
      return;
    }

    if (data) {
      if (editingPage) {
        setPages((prev) => prev.map((p) => (p.id === editingPage.id || p.slug === data.slug ? data : p)));
        showNotification('success', `Info page "${data.title}" updated successfully!`);
      } else {
        setPages((prev) => [...prev, data]);
        showNotification('success', `Info page "${data.title}" created successfully!`);
      }
    } else {
      // Mock mode fallback update
      const mockPage: InfoPageItem = {
        id: editingPage?.id || `info-mock-${Date.now()}`,
        slug: formData.slug.trim().toLowerCase(),
        title: formData.title.trim(),
        content: formData.content,
        updated_at: new Date().toISOString(),
      };
      setPages((prev) => {
        const exists = prev.some((p) => p.slug === mockPage.slug || p.id === mockPage.id);
        return exists
          ? prev.map((p) => (p.slug === mockPage.slug || p.id === mockPage.id ? mockPage : p))
          : [...prev, mockPage];
      });
      showNotification('success', `Saved info page "${mockPage.title}" (Mock mode)!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPage) return;

    setIsDeleting(true);
    const { error } = await deleteInfoPage(deletingPage.id);
    setIsDeleting(false);

    if (error && isLiveDb) {
      showNotification('error', error);
      return;
    }

    setPages((prev) => prev.filter((p) => p.id !== deletingPage.id && p.slug !== deletingPage.slug));
    showNotification('success', `Info page "${deletingPage.title}" deleted.`);
    setDeletingPage(null);
  };

  const getSampleContent = (type: string) => {
    switch (type) {
      case 'faq':
        return JSON.stringify(
          {
            intro: 'Berikut adalah jawaban atas pertanyaan yang sering diajukan pelanggan PLEATSSSI.',
            sections: [
              {
                heading: 'Cara Perawatan Pakaian Lipit',
                paragraphs: [
                  '1. Cuci lembut menggunakan air dingin.',
                  '2. Jangan memeras atau menggunakan mesin pengering bersuhu tinggi.',
                  '3. Simpan dengan cara digantung atau digulung perlahan mengikuti lipitan.',
                ],
              },
              {
                heading: 'Pengiriman & Pembayaran',
                paragraphs: [
                  'Kami menerima pembayaran via Midtrans (Bank Transfer, GoPay, QRIS, Kartu Kredit).',
                  'Pengiriman dilakukan via JNE / SiCepat dalam 1-3 hari kerja.',
                ],
              },
            ],
          },
          null,
          2
        );
      case 'shipping-returns':
        return JSON.stringify(
          {
            intro: 'Informasi lengkap mengenai kebijakan pengiriman dan pengembalian produk.',
            sections: [
              {
                heading: 'Kebijakan Pengiriman',
                paragraphs: [
                  'Pesanan yang dikonfirmasi sebelum pukul 15.00 WIB akan diproses pada hari yang sama.',
                  'Nomor resi pengiriman akan terupdate secara otomatis di akun Anda.',
                ],
              },
              {
                heading: 'Syarat Pengembalian Barang',
                paragraphs: [
                  'Pengembalian dapat diajukan maksimal 3x24 jam setelah barang diterima.',
                  'Tag label masih terpasang dan produk belum pernah dicuci/digunakan.',
                ],
              },
            ],
          },
          null,
          2
        );
      default:
        return `# ${formData.title || 'Informasi Halaman'}\n\nMasukkan isi konten legal/halaman statis di sini...`;
    }
  };

  const filteredPages = pages.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E5E0D8] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1918]">
              Static & Info Pages
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
            Manage legal pages, FAQs, shipping policies, terms of service, and size guides.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPages}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 text-sm font-medium text-[#1A1918] bg-white border border-[#E5E0D8] rounded-lg hover:bg-[#FAF7F2] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => handleOpenCreateModal()}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-[#0B4F3A] rounded-lg hover:bg-[#083C2C] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Page</span>
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

      {/* Quick Add Presets Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-xs space-y-3">
        <span className="text-xs font-semibold text-[#706D65] uppercase tracking-wider block">
          Quick Preset Page Templates:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleOpenCreateModal('faq', 'Pertanyaan Umum (FAQ)')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF7F2] border border-[#E5E0D8] hover:border-[#0B4F3A] rounded-lg text-xs font-medium text-[#1A1918] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0B4F3A]" />
            <span>FAQ Page</span>
          </button>
          <button
            onClick={() => handleOpenCreateModal('shipping-returns', 'Pengiriman & Pengembalian')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF7F2] border border-[#E5E0D8] hover:border-[#0B4F3A] rounded-lg text-xs font-medium text-[#1A1918] transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-[#0B4F3A]" />
            <span>Shipping & Returns</span>
          </button>
          <button
            onClick={() => handleOpenCreateModal('size-guide', 'Panduan Ukuran (Size Guide)')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF7F2] border border-[#E5E0D8] hover:border-[#0B4F3A] rounded-lg text-xs font-medium text-[#1A1918] transition-colors"
          >
            <Ruler className="w-3.5 h-3.5 text-[#0B4F3A]" />
            <span>Size Guide</span>
          </button>
          <button
            onClick={() => handleOpenCreateModal('terms-conditions', 'Syarat & Ketentuan')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF7F2] border border-[#E5E0D8] hover:border-[#0B4F3A] rounded-lg text-xs font-medium text-[#1A1918] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F3A]" />
            <span>Terms & Conditions</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-xs flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706D65]" />
          <input
            type="text"
            placeholder="Search page by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-sm text-[#1A1918] focus:outline-none focus:border-[#0B4F3A] transition-colors"
          />
        </div>
      </div>

      {/* Info Pages Data Table */}
      <div className="bg-white rounded-xl border border-[#E5E0D8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#706D65]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B4F3A] mb-3" />
            <p className="text-sm font-medium">Loading info pages...</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="p-12 text-center text-[#706D65]">
            <FileText className="w-12 h-12 mx-auto text-[#706D65]/40 mb-3" />
            <p className="text-base font-serif font-bold text-[#1A1918]">No Info Pages Found</p>
            <p className="text-xs mt-1">Create a new page using the button above or pick a template.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1A1918]">
              <thead className="bg-[#FAF7F2] text-[#706D65] uppercase text-xs tracking-wider font-semibold border-b border-[#E5E0D8]">
                <tr>
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-4">Slug Route</th>
                  <th className="py-3 px-4">Content Summary</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {filteredPages.map((page) => (
                  <tr key={page.id || page.slug} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Title */}
                    <td className="py-3.5 px-4 font-semibold text-[#1A1918]">
                      {page.title}
                    </td>

                    {/* Slug Route */}
                    <td className="py-3.5 px-4 font-mono text-xs text-[#0B4F3A]">
                      <Link
                        href={`/id/info/${page.slug}`}
                        target="_blank"
                        className="inline-flex items-center hover:underline"
                      >
                        <span>/id/info/{page.slug}</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </td>

                    {/* Summary */}
                    <td className="py-3.5 px-4 text-xs text-[#706D65] max-w-sm truncate">
                      {page.content.length > 80 ? `${page.content.substring(0, 80)}...` : page.content}
                    </td>

                    {/* Updated date */}
                    <td className="py-3.5 px-4 text-xs text-[#706D65]">
                      {page.updated_at
                        ? new Date(page.updated_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Default'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/id/info/${page.slug}`}
                        target="_blank"
                        className="inline-block p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleOpenEditModal(page)}
                        className="p-1.5 text-[#0B4F3A] hover:bg-[#0B4F3A]/10 rounded-md transition-colors"
                        title="Edit Page"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingPage(page)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-[#E5E0D8] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#0B4F3A]" />
                <h2 className="font-serif font-bold text-xl text-[#1A1918]">
                  {editingPage ? 'Edit Info Page' : 'Create New Info Page'}
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
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FAQ & Cara Perawatan"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-[#1A1918] focus:outline-none focus:border-[#0B4F3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    URL Slug * (/id/info/slug)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. faq"
                    value={formData.slug}
                    onChange={(e) => {
                      setIsSlugEdited(true);
                      setFormData({ ...formData, slug: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg text-[#1A1918] font-mono focus:outline-none focus:border-[#0B4F3A]"
                    required
                  />
                </div>
              </div>

              {/* Tab Selector: Editor vs Live Preview */}
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pt-2">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('editor')}
                    className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                      activeTab === 'editor'
                        ? 'border-[#0B4F3A] text-[#0B4F3A]'
                        : 'border-transparent text-[#706D65] hover:text-[#1A1918]'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Content Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                      activeTab === 'preview'
                        ? 'border-[#0B4F3A] text-[#0B4F3A]'
                        : 'border-transparent text-[#706D65] hover:text-[#1A1918]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                </div>
              </div>

              {/* Editor Tab */}
              {activeTab === 'editor' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-[#1A1918]">
                      Content (Markdown or JSON structured format)
                    </label>
                    <span className="text-[11px] text-[#706D65]">
                      Supports standard Markdown or JSON sections schema
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    placeholder="Write content here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-3 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg font-mono text-xs text-[#1A1918] focus:outline-none focus:border-[#0B4F3A]"
                    required
                  />
                </div>
              )}

              {/* Live Preview Tab */}
              {activeTab === 'preview' && (
                <div className="p-4 bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg space-y-4 max-h-96 overflow-y-auto">
                  <h3 className="font-serif font-bold text-2xl text-[#1A1918]">
                    {formData.title || 'Page Title Preview'}
                  </h3>
                  <div className="prose prose-sm max-w-none text-[#4A4741] whitespace-pre-wrap font-sans">
                    {formData.content || <em className="text-gray-400">No content entered yet...</em>}
                  </div>
                </div>
              )}

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
                  <span>{editingPage ? 'Save Changes' : 'Create Page'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E0D8] space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif font-bold text-lg text-[#1A1918]">Confirm Page Deletion</h3>
            </div>

            <p className="text-xs text-[#706D65]">
              Are you sure you want to delete info page{' '}
              <strong className="text-[#1A1918]">&quot;{deletingPage.title}&quot;</strong>? Visitors accessing{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600">
                /id/info/{deletingPage.slug}
              </code>{' '}
              will see fallback contents.
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-[#E5E0D8]">
              <button
                onClick={() => setDeletingPage(null)}
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
                <span>Delete Page</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
