'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import {
  getDynamicCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  type CategoryItem
} from '@/lib/services/categoryService';
import { isSupabaseConfigured } from '@/lib/services/serviceUtils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveDb, setIsLiveDb] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  // Delete Dialog State
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    parent_id: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const isConfigured = isSupabaseConfigured();
      setIsLiveDb(isConfigured);
      const data = await getDynamicCategories();
      setCategories(data);
    } catch {
      showNotification('error', 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsSlugEdited(false);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      parent_id: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setIsSlugEdited(true);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image_url: cat.image_url || '',
      parent_id: cat.parent_id || '',
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !editingCategory && !isSlugEdited ? autoSlug : prev.slug,
    }));
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSlugEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setUploadingImage(true);
    try {
      const { url, error } = await uploadCategoryImage(file);
      if (error || !url) {
        showNotification('error', error || 'Image upload failed. Storage bucket error.');
      } else {
        setFormData((prev) => ({ ...prev, image_url: url }));
        showNotification('success', 'Image uploaded to pleatsssi-assets/categories/ successfully.');
      }
    } catch {
      showNotification('error', 'An error occurred while uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showNotification('error', 'Category name is required.');
      return;
    }

    const slug = formData.slug.trim() || formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    setSaving(true);
    try {
      if (editingCategory) {
        const { error } = await updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          slug,
          description: formData.description.trim() || null,
          image_url: formData.image_url.trim() || null,
          parent_id: formData.parent_id.trim() || null,
        });

        if (error) {
          showNotification('error', error);
        } else {
          showNotification('success', `Category "${formData.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const { error } = await createCategory({
          name: formData.name.trim(),
          slug,
          description: formData.description.trim() || undefined,
          image_url: formData.image_url.trim() || undefined,
          parent_id: formData.parent_id.trim() || null,
        });

        if (error) {
          showNotification('error', error);
        } else {
          showNotification('success', `Category "${formData.name}" created successfully.`);
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch {
      showNotification('error', 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    setIsDeleting(true);
    try {
      const { success, error } = await deleteCategory(deletingCategory.id);
      if (!success || error) {
        showNotification('error', error || 'Failed to delete category.');
      } else {
        showNotification('success', `Category "${deletingCategory.name}" deleted.`);
        setDeletingCategory(null);
        fetchCategories();
      }
    } catch {
      showNotification('error', 'An error occurred while deleting category.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <FolderTree className="w-6 h-6 text-[#0B4F3A]" />
            <h1 className="font-bold text-2xl sm:text-3xl text-[#0F172A]">
              Category Management
            </h1>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            Create, view, edit, and delete product categories and icons for storefront routing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchCategories}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 text-sm font-semibold text-[#334155] bg-white border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
            title="Reload category list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-[#0B4F3A] hover:bg-[#083C2C] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
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

      {/* Live DB Connection Warning if offline */}
      {!isLiveDb && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-xs sm:text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Static Fallback Mode Active</p>
            <p className="text-amber-800 mt-0.5">
              Supabase database credentials are not configured or empty. The category table below displays default static categories from <code className="font-mono text-amber-900 bg-amber-100 px-1 py-0.5 rounded">src/data/categories.ts</code>.
            </p>
          </div>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search category by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:ring-2 focus:ring-[#0B4F3A] bg-white focus:outline-hidden"
          />
        </div>

        <div className="text-xs text-[#64748B] flex items-center space-x-4 w-full sm:w-auto justify-between">
          <span>Showing <strong className="text-[#0F172A] font-bold">{filteredCategories.length}</strong> of {categories.length} categories</span>
        </div>
      </div>

      {/* Category Listing Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[#64748B]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B4F3A]" />
            <p className="mt-3 text-sm font-medium">Loading category list...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center text-[#64748B]">
            <FolderOpen className="w-12 h-12 mx-auto text-[#CBD5E1]" />
            <p className="mt-3 text-base font-semibold text-[#0F172A]">No categories found</p>
            <p className="text-xs text-[#64748B] mt-1">
              {searchQuery ? `No category matching "${searchQuery}"` : 'Get started by creating your first storefront category.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-4 inline-flex items-center space-x-2 bg-[#0B4F3A] hover:bg-[#083C2C] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Category</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0F172A]">
              <thead className="bg-[#F8FAFC] text-[#475569] uppercase text-[11px] tracking-wider font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-4 w-16">Thumbnail</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Slug & Storefront Link</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#F8FAFC]/70 transition-colors border-b border-[#F1F5F9]">
                    {/* Image / Thumbnail */}
                    <td className="py-3 px-4">
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0B4F3A] flex items-center justify-center">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">
                      {cat.name}
                    </td>

                    {/* Slug */}
                    <td className="py-3 px-4">
                      <Link
                        href={`/id/${cat.slug}`}
                        target="_blank"
                        className="inline-flex items-center text-xs font-mono text-[#0B4F3A] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-2.5 py-1 rounded-lg transition-colors font-medium"
                      >
                        /id/{cat.slug}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                      </Link>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-xs text-[#64748B] max-w-xs truncate">
                      {cat.description || '-'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="text-[#0B4F3A] hover:bg-[#0B4F3A]/10 p-2 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                          title="Delete Category"
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
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#0F172A]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Dresses, Outerwear, Accessories"
                    className="w-full px-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    URL Slug *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#64748B] font-mono">
                      /id/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={handleSlugChange}
                      placeholder="dresses"
                      className="w-full pl-11 pr-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] font-mono focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description for SEO and Category Header..."
                    className="w-full px-3.5 py-2.5 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0B4F3A] bg-white"
                  />
                </div>

                {/* Image Upload Feature */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Category Icon / Thumbnail (Storage: <code className="font-mono text-xs text-[#0B4F3A] lowercase">categories/</code>)
                  </label>

                  {formData.image_url ? (
                    <div className="flex items-center space-x-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <img
                        src={formData.image_url}
                        alt="Category Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-[#E2E8F0]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0F172A] truncate">{formData.image_url}</p>
                        <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Uploaded & Ready</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image_url: '' }))}
                        className="text-rose-600 hover:text-rose-800 text-xs font-semibold px-2.5 py-1 bg-white rounded-lg border border-rose-200"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#0B4F3A] rounded-xl p-4 text-center bg-[#F8FAFC]/50 transition-colors">
                      {uploadingImage ? (
                        <div className="py-2 text-center text-[#0B4F3A]">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1" />
                          <span className="text-xs font-semibold">Uploading image...</span>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <Upload className="w-6 h-6 text-[#64748B] mx-auto mb-1" />
                          <span className="text-xs font-semibold text-[#0B4F3A] hover:underline">
                            Click to upload category photo
                          </span>
                          <p className="text-[11px] text-[#64748B] mt-0.5">
                            PNG, JPG, or WebP up to 10MB
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] bg-white border border-[#CBD5E1] rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="bg-[#0B4F3A] hover:bg-[#083C2C] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 text-rose-600">
                <div className="p-2.5 bg-rose-50 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#0F172A]">
                  Delete Category
                </h3>
              </div>

              <p className="text-sm text-[#64748B]">
                Are you sure you want to delete category <strong className="text-[#0F172A]">&ldquo;{deletingCategory.name}&rdquo;</strong> (<code className="font-mono text-xs text-[#0B4F3A]">/id/{deletingCategory.slug}</code>)? Products assigned to this category will be preserved.
              </p>
            </div>

            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] bg-white border border-[#CBD5E1] rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Category</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
