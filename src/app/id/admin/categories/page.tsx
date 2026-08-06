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
        // Update existing category (pass null explicitly for cleared optional fields)
        const { data, error } = await updateCategory(editingCategory.id, {
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
        // Create new category
        const { data, error } = await createCategory({
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E5E0D8] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <FolderTree className="w-6 h-6 text-[#0B4F3A]" />
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1918]">
              Category Management
            </h1>
          </div>
          <p className="text-sm text-[#706D65] mt-1">
            Create, view, edit, and delete product categories and icons for storefront routing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchCategories}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 text-sm font-medium text-[#1A1918] bg-white border border-[#E5E0D8] rounded-lg hover:bg-[#FAF7F2] transition-colors disabled:opacity-50"
            title="Reload category list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-[#0B4F3A] rounded-lg hover:bg-[#083C2C] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification && (
        <div
          className={`p-4 rounded-lg border flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live DB Connection Warning if offline */}
      {!isLiveDb && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900 text-xs sm:text-sm flex items-start space-x-3">
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
      <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#706D65]" />
          <input
            type="text"
            placeholder="Search category by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#D5D0C8] rounded-lg text-sm placeholder-[#9E9A90] focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
          />
        </div>

        <div className="text-xs text-[#706D65] flex items-center space-x-4 w-full sm:w-auto justify-between">
          <span>Showing <strong className="text-[#1A1918]">{filteredCategories.length}</strong> of {categories.length} categories</span>
        </div>
      </div>

      {/* Category Listing Table */}
      <div className="bg-white rounded-xl border border-[#E5E0D8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[#706D65]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B4F3A]" />
            <p className="mt-3 text-sm font-medium">Loading category list...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center text-[#706D65]">
            <FolderOpen className="w-12 h-12 mx-auto text-[#D5D0C8]" />
            <p className="mt-3 text-base font-semibold text-[#1A1918]">No categories found</p>
            <p className="text-xs text-[#706D65] mt-1">
              {searchQuery ? `No category matching "${searchQuery}"` : 'Get started by creating your first storefront category.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-4 inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-[#0B4F3A] rounded-lg hover:bg-[#083C2C]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Category</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1A1918]">
              <thead className="bg-[#FAF7F2] text-[#706D65] uppercase text-xs tracking-wider font-semibold border-b border-[#E5E0D8]">
                <tr>
                  <th className="py-3.5 px-4 w-16">Thumbnail</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Slug & Storefront Link</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    {/* Image / Thumbnail */}
                    <td className="py-3 px-4">
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#E5E0D8]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E5E0D8] text-[#0B4F3A] flex items-center justify-center">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 font-semibold text-[#1A1918]">
                      {cat.name}
                    </td>

                    {/* Slug */}
                    <td className="py-3 px-4">
                      <Link
                        href={`/id/${cat.slug}`}
                        target="_blank"
                        className="inline-flex items-center text-xs font-mono text-[#0B4F3A] bg-[#0B4F3A]/5 px-2.5 py-1 rounded-md hover:underline border border-[#0B4F3A]/10"
                      >
                        /id/{cat.slug}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                      </Link>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-xs text-[#706D65] max-w-xs truncate">
                      {cat.description || '-'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 text-[#0B4F3A] hover:bg-[#0B4F3A]/10 rounded-md transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E5E0D8] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <h3 className="font-serif font-bold text-xl text-[#1A1918]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#706D65] hover:text-[#1A1918] p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Dresses, Outerwear, Accessories"
                  className="w-full px-3.5 py-2 border border-[#D5D0C8] rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                  URL Slug *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#706D65] font-mono">
                    /id/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={handleSlugChange}
                    placeholder="dresses"
                    className="w-full pl-11 pr-3.5 py-2 border border-[#D5D0C8] rounded-lg text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description for SEO and Category Header..."
                  className="w-full px-3.5 py-2 border border-[#D5D0C8] rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                />
              </div>

              {/* Image Upload Feature (pleatsssi-assets/categories/) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                  Category Icon / Thumbnail (Supabase Storage: <code className="font-mono text-xs text-[#0B4F3A]">categories/</code>)
                </label>

                {formData.image_url ? (
                  <div className="flex items-center space-x-3 p-3 bg-[#FAF7F2] rounded-lg border border-[#E5E0D8]">
                    <img
                      src={formData.image_url}
                      alt="Category Preview"
                      className="w-14 h-14 object-cover rounded-md border border-[#E5E0D8]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1A1918] truncate">{formData.image_url}</p>
                      <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Uploaded & Ready</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image_url: '' }))}
                      className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 bg-white rounded border border-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#D5D0C8] hover:border-[#0B4F3A] rounded-lg p-4 text-center bg-[#FAF7F2]/50 transition-colors">
                    {uploadingImage ? (
                      <div className="py-2 text-center text-[#0B4F3A]">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1" />
                        <span className="text-xs font-semibold">Uploading image to pleatsssi-assets/categories/...</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Upload className="w-6 h-6 text-[#706D65] mx-auto mb-1" />
                        <span className="text-xs font-semibold text-[#0B4F3A] hover:underline">
                          Click to upload category photo
                        </span>
                        <p className="text-[11px] text-[#706D65] mt-0.5">
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

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#706D65] hover:text-[#1A1918] bg-white border border-[#E5E0D8] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="flex items-center space-x-2 px-5 py-2 text-sm font-medium text-white bg-[#0B4F3A] hover:bg-[#083C2C] rounded-lg disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E0D8] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2.5 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1918]">
                Delete Category
              </h3>
            </div>

            <p className="text-sm text-[#706D65]">
              Are you sure you want to delete category <strong className="text-[#1A1918]">"{deletingCategory.name}"</strong> (<code className="font-mono text-xs">/id/{deletingCategory.slug}</code>)? Products assigned to this category will be preserved.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 text-sm font-medium text-[#706D65] hover:text-[#1A1918] bg-white border border-[#E5E0D8] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center space-x-2 px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
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
