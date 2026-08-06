'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import {
  Package,
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
  FolderOpen,
  Tag,
  Palette,
  Check,
  Eye,
  Star,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  type AdminProductItem,
  type AdminProductVariant,
  type AdminProductImage,
} from '@/lib/services/productService';
import { getDynamicCategories, type CategoryItem } from '@/lib/services/categoryService';
import { isSupabaseConfigured } from '@/lib/services/serviceUtils';

const AVAILABLE_COLLECTIONS = [
  'new-arrivals',
  'best-sellers',
  'featured',
  'pleats',
  'signature',
  'sale',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLiveDb, setIsLiveDb] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'images'>('basic');

  // Delete Dialog State
  const [deletingProduct, setDeletingProduct] = useState<AdminProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    material: string;
    price: string;
    discount: string;
    status: 'draft' | 'published' | 'archived';
    category_id: string;
    size_chart_id: string;
    collections: string[];
    variants: AdminProductVariant[];
    images: AdminProductImage[];
  }>({
    name: '',
    slug: '',
    description: '',
    material: '',
    price: '',
    discount: '0',
    status: 'published',
    category_id: '',
    size_chart_id: '',
    collections: ['new-arrivals'],
    variants: [],
    images: [],
  });

  // Variant sub-form state
  const [newVar, setNewVar] = useState<{
    color: string;
    color_hex: string;
    size: string;
    sku: string;
    stock: string;
  }>({
    color: '',
    color_hex: '#000000',
    size: 'ALL SIZE',
    sku: '',
    stock: '10',
  });

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const isConfigured = isSupabaseConfigured();
      setIsLiveDb(isConfigured);

      const [prodsData, catsData] = await Promise.all([
        getAdminProducts(),
        getDynamicCategories(),
      ]);

      setProducts(prodsData);
      setCategories(catsData);
    } catch {
      showNotification('error', 'Failed to load products and categories data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsSlugEdited(false);
    setActiveTab('basic');
    const defaultCatId = categories[0]?.id || '';
    setFormData({
      name: '',
      slug: '',
      description: '',
      material: '',
      price: '',
      discount: '0',
      status: 'published',
      category_id: defaultCatId,
      size_chart_id: '',
      collections: ['new-arrivals'],
      variants: [
        {
          color: 'Default',
          color_hex: '#000000',
          size: 'ALL SIZE',
          sku: `SKU-${Date.now().toString().slice(-4)}`,
          stock: 10,
        },
      ],
      images: [],
    });
    setNewVar({
      color: '',
      color_hex: '#000000',
      size: 'ALL SIZE',
      sku: '',
      stock: '10',
    });
    setImageUrlInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: AdminProductItem) => {
    setEditingProduct(prod);
    setIsSlugEdited(true);
    setActiveTab('basic');
    setFormData({
      name: prod.name || '',
      slug: prod.slug || '',
      description: prod.description || '',
      material: prod.material || '',
      price: prod.price?.toString() || '0',
      discount: prod.discount?.toString() || '0',
      status: (prod.status as 'draft' | 'published' | 'archived') || 'published',
      category_id: prod.category_id || (prod.categories?.id ?? categories[0]?.id ?? ''),
      size_chart_id: prod.size_chart_id || '',
      collections: prod.collections || [],
      variants: prod.product_variants ? [...prod.product_variants] : [],
      images: prod.product_images ? [...prod.product_images] : [],
    });
    setNewVar({
      color: '',
      color_hex: '#000000',
      size: 'ALL SIZE',
      sku: '',
      stock: '10',
    });
    setImageUrlInput('');
    setIsModalOpen(true);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !editingProduct && !isSlugEdited ? autoSlug : prev.slug,
    }));
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSlugEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleToggleCollection = (colName: string) => {
    setFormData((prev) => {
      const exists = prev.collections.includes(colName);
      return {
        ...prev,
        collections: exists
          ? prev.collections.filter((c) => c !== colName)
          : [...prev.collections, colName],
      };
    });
  };

  // Add Variant Handler
  const handleAddVariant = () => {
    if (!newVar.color.trim()) {
      showNotification('error', 'Variant color name is required.');
      return;
    }
    const sku = newVar.sku.trim() || `${formData.name.substring(0, 3).toUpperCase()}-${newVar.color.substring(0, 3).toUpperCase()}-${newVar.size.toUpperCase()}-${Math.floor(Math.random() * 100)}`;
    const stock = Math.max(0, parseInt(newVar.stock) || 0);

    const variantToAdd: AdminProductVariant = {
      color: newVar.color.trim(),
      color_hex: newVar.color_hex.trim() || '#000000',
      size: newVar.size.trim() || 'ALL SIZE',
      sku: sku,
      stock: stock,
    };

    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, variantToAdd],
    }));

    setNewVar({
      color: '',
      color_hex: '#000000',
      size: 'ALL SIZE',
      sku: '',
      stock: '10',
    });
  };

  // Remove Variant Handler
  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Image Upload Handler
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setUploadingImage(true);
    try {
      const { url, error } = await uploadProductImage(file);
      if (error || !url) {
        showNotification('error', error || 'Image upload failed. Check Supabase Storage configuration.');
      } else {
        const isPrimary = formData.images.length === 0;
        const newImg: AdminProductImage = {
          image_url: url,
          sort_order: formData.images.length,
          is_primary: isPrimary,
        };
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, newImg],
        }));
        showNotification('success', 'Product photo uploaded to pleatsssi-assets/products/ successfully.');
      }
    } catch {
      showNotification('error', 'An error occurred while uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Image via Direct URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const isPrimary = formData.images.length === 0;
    const newImg: AdminProductImage = {
      image_url: imageUrlInput.trim(),
      sort_order: formData.images.length,
      is_primary: isPrimary,
    };
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImg],
    }));
    setImageUrlInput('');
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
        updated[0].is_primary = true;
      }
      return { ...prev, images: updated };
    });
  };

  // Set Primary Image
  const handleSetPrimaryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        is_primary: i === index,
      })),
    }));
  };

  // Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showNotification('error', 'Product name is required.');
      return;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      showNotification('error', 'Valid product price is required.');
      return;
    }
    if (!formData.category_id) {
      showNotification('error', 'Please select a category.');
      return;
    }

    const slug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-');

    setSaving(true);
    try {
      if (editingProduct) {
        // Update product (pass explicit null for cleared optional fields)
        const { data, error } = await updateProduct(editingProduct.id, {
          name: formData.name.trim(),
          slug: slug,
          category_id: formData.category_id,
          price: Number(formData.price),
          discount: formData.discount ? Number(formData.discount) : 0,
          status: formData.status,
          description: formData.description.trim() || null,
          material: formData.material.trim() || null,
          size_chart_id: formData.size_chart_id.trim() || null,
          collections: formData.collections,
          variants: formData.variants,
          images: formData.images,
        });

        if (error) {
          showNotification('error', error);
        } else {
          showNotification('success', `Product "${formData.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchInitialData();
        }
      } else {
        // Create product
        const { data, error } = await createProduct({
          name: formData.name.trim(),
          slug: slug,
          category_id: formData.category_id,
          price: Number(formData.price),
          discount: formData.discount ? Number(formData.discount) : 0,
          status: formData.status,
          description: formData.description.trim() || null,
          material: formData.material.trim() || null,
          size_chart_id: formData.size_chart_id.trim() || null,
          collections: formData.collections,
          variants: formData.variants,
          images: formData.images,
        });

        if (error) {
          showNotification('error', error);
        } else {
          showNotification('success', `Product "${formData.name}" created successfully.`);
          setIsModalOpen(false);
          fetchInitialData();
        }
      }
    } catch {
      showNotification('error', 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);
    try {
      const { success, error } = await deleteProduct(deletingProduct.id);
      if (!success || error) {
        showNotification('error', error || 'Failed to delete product.');
      } else {
        showNotification('success', `Product "${deletingProduct.name}" deleted.`);
        setDeletingProduct(null);
        fetchInitialData();
      }
    } catch {
      showNotification('error', 'An error occurred while deleting product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product_variants.some((v) => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      p.category_id === selectedCategory ||
      p.categories?.slug === selectedCategory;

    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E5E0D8] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-[#0B4F3A]" />
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1918]">
              Product & Variant CRUD
            </h1>
          </div>
          <p className="text-sm text-[#706D65] mt-1">
            Manage product metadata, color/size variant combinations, and upload image galleries.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchInitialData}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 text-sm font-medium text-[#1A1918] bg-white border border-[#E5E0D8] rounded-lg hover:bg-[#FAF7F2] transition-colors disabled:opacity-50"
            title="Reload product list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-[#0B4F3A] rounded-lg hover:bg-[#083C2C] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
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
              Supabase database credentials are not configured or empty. The products list below displays fallback products from <code className="font-mono text-amber-900 bg-amber-100 px-1 py-0.5 rounded">src/data/products.ts</code>.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#706D65]" />
            <input
              type="text"
              placeholder="Search product by name, slug, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#D5D0C8] rounded-lg text-sm placeholder-[#9E9A90] focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-[#D5D0C8] rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-[#D5D0C8] rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[#706D65] shrink-0">
          Showing <strong className="text-[#1A1918]">{filteredProducts.length}</strong> of {products.length} products
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-xl border border-[#E5E0D8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[#706D65]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B4F3A]" />
            <p className="mt-3 text-sm font-medium">Loading products list...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-[#706D65]">
            <FolderOpen className="w-12 h-12 mx-auto text-[#D5D0C8]" />
            <p className="mt-3 text-base font-semibold text-[#1A1918]">No products found</p>
            <p className="text-xs text-[#706D65] mt-1">
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'No product matches your filter criteria.'
                : 'Get started by creating your first catalog product.'}
            </p>
            {!searchQuery && selectedCategory === 'all' && selectedStatus === 'all' && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-4 inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-[#0B4F3A] rounded-lg hover:bg-[#083C2C]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Product</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1A1918]">
              <thead className="bg-[#FAF7F2] text-[#706D65] uppercase text-xs tracking-wider font-semibold border-b border-[#E5E0D8]">
                <tr>
                  <th className="py-3.5 px-4 w-16">Image</th>
                  <th className="py-3.5 px-4">Product Info</th>
                  <th className="py-3.5 px-4">Category & Tags</th>
                  <th className="py-3.5 px-4">Price & Discount</th>
                  <th className="py-3.5 px-4">Variants / Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {filteredProducts.map((prod) => {
                  const primaryImg =
                    prod.product_images.find((i) => i.is_primary)?.image_url ||
                    prod.product_images[0]?.image_url;
                  const totalStock = prod.product_variants.reduce((acc, v) => acc + (v.stock || 0), 0);

                  return (
                    <tr key={prod.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      {/* Image */}
                      <td className="py-3 px-4">
                        {primaryImg ? (
                          <img
                            src={primaryImg}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[#E5E0D8]"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#FAF7F2] border border-[#E5E0D8] text-[#0B4F3A] flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-[#A09C94]" />
                          </div>
                        )}
                      </td>

                      {/* Info */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-semibold text-[#1A1918]">{prod.name}</p>
                        <Link
                          href={`/id/products/${prod.id}`}
                          target="_blank"
                          className="inline-flex items-center text-xs font-mono text-[#0B4F3A] hover:underline mt-0.5"
                        >
                          /id/products/{prod.slug}
                          <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                        </Link>
                      </td>

                      {/* Category & Tags */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#0B4F3A]/10 text-[#0B4F3A] border border-[#0B4F3A]/20">
                            {prod.categories?.name || prod.category_id || 'General'}
                          </span>
                          {prod.collections && prod.collections.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {prod.collections.map((col) => (
                                <span
                                  key={col}
                                  className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200"
                                >
                                  {col}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Price & Discount */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-[#1A1918]">
                          IDR {prod.price.toLocaleString('en-US')}
                        </p>
                        {prod.discount > 0 ? (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 mt-0.5">
                            {prod.discount}% OFF
                          </span>
                        ) : (
                          <span className="text-xs text-[#706D65]">No discount</span>
                        )}
                      </td>

                      {/* Variants & Stock */}
                      <td className="py-3 px-4">
                        <p className="text-xs font-medium text-[#1A1918]">
                          {prod.product_variants.length} Variant{prod.product_variants.length === 1 ? '' : 's'}
                        </p>
                        <p className="text-xs text-[#706D65] mt-0.5">
                          Total stock: <strong className={totalStock > 0 ? 'text-emerald-700' : 'text-red-600'}>{totalStock}</strong>
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            prod.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prod.status === 'draft'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {prod.status.charAt(0).toUpperCase() + prod.status.slice(1)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 text-[#0B4F3A] hover:bg-[#0B4F3A]/10 rounded-md transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(prod)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-[#E5E0D8] space-y-5 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1A1918]">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
                </h3>
                <p className="text-xs text-[#706D65] mt-0.5">
                  Configure product details, colors, size combinations, and gallery pictures.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#706D65] hover:text-[#1A1918] p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-[#E5E0D8] space-x-4">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`pb-2.5 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === 'basic'
                    ? 'border-[#0B4F3A] text-[#0B4F3A]'
                    : 'border-transparent text-[#706D65] hover:text-[#1A1918]'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>1. Basic Info & Pricing</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('variants')}
                className={`pb-2.5 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === 'variants'
                    ? 'border-[#0B4F3A] text-[#0B4F3A]'
                    : 'border-transparent text-[#706D65] hover:text-[#1A1918]'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>2. Variants ({formData.variants.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className={`pb-2.5 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === 'images'
                    ? 'border-[#0B4F3A] text-[#0B4F3A]'
                    : 'border-transparent text-[#706D65] hover:text-[#1A1918]'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>3. Image Gallery ({formData.images.length})</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tab 1: Basic Info */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleNameChange}
                        placeholder="e.g. Pleated Midi Dress"
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
                          /id/products/
                        </span>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={handleSlugChange}
                          placeholder="pleated-midi-dress"
                          className="w-full pl-24 pr-3.5 py-2 border border-[#D5D0C8] rounded-lg text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                        Price (IDR) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g. 450000"
                        className="w-full px-3.5 py-2 border border-[#D5D0C8] rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                      />
                    </div>

                    {/* Discount */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                        Discount (% OFF)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={formData.discount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, discount: e.target.value }))}
                        placeholder="0"
                        className="w-full px-3.5 py-2 border border-[#D5D0C8] rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                        Status *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target.value as 'draft' | 'published' | 'archived',
                          }))
                        }
                        className="w-full px-3.5 py-2 border border-[#D5D0C8] rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category_id}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
                        className="w-full px-3.5 py-2 border border-[#D5D0C8] rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.slug})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Material */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                        Material Specification
                      </label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => setFormData((prev) => ({ ...prev, material: e.target.value }))}
                        placeholder="e.g. 100% High Density Pleated Polyester"
                        className="w-full px-3.5 py-2 border border-[#D5D0C8] rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                      />
                    </div>
                  </div>

                  {/* Collections Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1.5">
                      Storefront Collections
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_COLLECTIONS.map((col) => {
                        const isSelected = formData.collections.includes(col);
                        return (
                          <button
                            key={col}
                            type="button"
                            onClick={() => handleToggleCollection(col)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors flex items-center space-x-1.5 ${
                              isSelected
                                ? 'bg-[#0B4F3A] text-white border-[#0B4F3A]'
                                : 'bg-[#FAF7F2] text-[#706D65] border-[#E5E0D8] hover:bg-[#F2ECE1]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{col}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed product story, care instructions, and styling details..."
                      className="w-full px-3.5 py-2 border border-[#D5D0C8] rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Variants */}
              {activeTab === 'variants' && (
                <div className="space-y-5">
                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5E0D8] space-y-3">
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1A1918] flex items-center space-x-2">
                      <Plus className="w-4 h-4 text-[#0B4F3A]" />
                      <span>Add New Variant Combination</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#706D65] mb-1">Color Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Navy"
                          value={newVar.color}
                          onChange={(e) => setNewVar((prev) => ({ ...prev, color: e.target.value }))}
                          className="w-full px-2.5 py-1.5 border border-[#D5D0C8] rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#706D65] mb-1">Color Hex</label>
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="color"
                            value={newVar.color_hex}
                            onChange={(e) => setNewVar((prev) => ({ ...prev, color_hex: e.target.value }))}
                            className="w-7 h-7 p-0 border border-[#D5D0C8] rounded cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            value={newVar.color_hex}
                            onChange={(e) => setNewVar((prev) => ({ ...prev, color_hex: e.target.value }))}
                            className="w-full px-2 py-1.5 border border-[#D5D0C8] rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#706D65] mb-1">Size</label>
                        <select
                          value={newVar.size}
                          onChange={(e) => setNewVar((prev) => ({ ...prev, size: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-[#D5D0C8] rounded-lg text-xs bg-white"
                        >
                          <option value="ALL SIZE">ALL SIZE</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#706D65] mb-1">SKU</label>
                        <input
                          type="text"
                          placeholder="Unique SKU"
                          value={newVar.sku}
                          onChange={(e) => setNewVar((prev) => ({ ...prev, sku: e.target.value }))}
                          className="w-full px-2.5 py-1.5 border border-[#D5D0C8] rounded-lg text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#706D65] mb-1">Stock</label>
                        <input
                          type="number"
                          min="0"
                          value={newVar.stock}
                          onChange={(e) => setNewVar((prev) => ({ ...prev, stock: e.target.value }))}
                          className="w-full px-2.5 py-1.5 border border-[#D5D0C8] rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0B4F3A] rounded-lg hover:bg-[#083C2C] transition-colors"
                    >
                      + Add Variant to Product
                    </button>
                  </div>

                  {/* List of current variants */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918]">
                      Configured Product Variants ({formData.variants.length})
                    </label>

                    {formData.variants.length === 0 ? (
                      <p className="text-xs text-[#706D65] italic p-3 bg-gray-50 rounded-lg border border-dashed text-center">
                        No variants added yet. Please add at least one color/size variant above.
                      </p>
                    ) : (
                      <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8] rounded-xl overflow-hidden">
                        {formData.variants.map((v, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white flex items-center justify-between hover:bg-[#FAF7F2]/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <span
                                className="w-5 h-5 rounded-full border border-gray-300 shadow-xs inline-block shrink-0"
                                style={{ backgroundColor: v.color_hex }}
                                title={v.color_hex}
                              />
                              <div>
                                <span className="text-xs font-semibold text-[#1A1918]">
                                  {v.color}
                                </span>
                                <span className="ml-2 text-[11px] font-medium text-[#0B4F3A] bg-[#0B4F3A]/10 px-2 py-0.5 rounded">
                                  Size: {v.size}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <span className="text-xs font-mono text-[#706D65]">
                                SKU: {v.sku}
                              </span>
                              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Stock: {v.stock}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(idx)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Remove Variant"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Images */}
              {activeTab === 'images' && (
                <div className="space-y-5">
                  {/* Upload box */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                      Upload Image to Supabase Storage (<code className="font-mono text-xs text-[#0B4F3A]">pleatsssi-assets/products/</code>)
                    </label>

                    <div className="border-2 border-dashed border-[#D5D0C8] hover:border-[#0B4F3A] rounded-xl p-5 text-center bg-[#FAF7F2]/50 transition-colors">
                      {uploadingImage ? (
                        <div className="py-2 text-center text-[#0B4F3A]">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1" />
                          <span className="text-xs font-semibold">Uploading to pleatsssi-assets/products/...</span>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <Upload className="w-6 h-6 text-[#706D65] mx-auto mb-1" />
                          <span className="text-xs font-semibold text-[#0B4F3A] hover:underline">
                            Click to upload product photo
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
                  </div>

                  {/* Direct URL input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#706D65] mb-1">
                      Or Add Image Direct URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="w-full px-3 py-1.5 border border-[#D5D0C8] rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0B4F3A]"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-[#0B4F3A] rounded-lg shrink-0 hover:bg-[#083C2C]"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Image List */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1918]">
                      Product Gallery ({formData.images.length})
                    </label>

                    {formData.images.length === 0 ? (
                      <p className="text-xs text-[#706D65] italic p-4 bg-gray-50 rounded-lg border border-dashed text-center">
                        No product images uploaded yet. Upload images above to show in storefront PDP gallery.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {formData.images.map((img, idx) => (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden border p-2 bg-white flex flex-col justify-between ${
                              img.is_primary ? 'border-2 border-[#0B4F3A] ring-2 ring-[#0B4F3A]/20' : 'border-[#E5E0D8]'
                            }`}
                          >
                            <img
                              src={img.image_url}
                              alt={`Product image ${idx + 1}`}
                              className="w-full h-28 object-cover rounded-lg"
                            />
                            <div className="mt-2 space-y-1.5">
                              {img.is_primary ? (
                                <span className="w-full py-1 text-[10px] font-bold text-center block bg-[#0B4F3A] text-white rounded">
                                  ★ Primary Cover
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(idx)}
                                  className="w-full py-1 text-[10px] font-medium text-center block bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                                >
                                  Make Primary
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="w-full py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 text-center block rounded border border-red-200"
                              >
                                Delete Image
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
                <div className="flex items-center space-x-2">
                  {activeTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab(activeTab === 'images' ? 'variants' : 'basic')
                      }
                      className="px-3.5 py-2 text-xs font-medium text-[#706D65] hover:text-[#1A1918] bg-white border border-[#E5E0D8] rounded-lg"
                    >
                      ← Previous Section
                    </button>
                  )}
                  {activeTab !== 'images' && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab(activeTab === 'basic' ? 'variants' : 'images')
                      }
                      className="px-3.5 py-2 text-xs font-medium text-[#0B4F3A] bg-[#0B4F3A]/10 hover:bg-[#0B4F3A]/20 rounded-lg"
                    >
                      Next Section →
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
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
                      <span>{editingProduct ? 'Save Product Changes' : 'Create Product'}</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E0D8] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2.5 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1918]">
                Delete Product
              </h3>
            </div>

            <p className="text-sm text-[#706D65]">
              Are you sure you want to delete product <strong className="text-[#1A1918]">"{deletingProduct.name}"</strong> (<code className="font-mono text-xs">/id/products/{deletingProduct.slug}</code>)? This will also delete all associated variants and gallery images.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
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
                  <span>Delete Product</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
