import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useAdmin } from '../context/AdminContext';
import { Product, Order, Category, Brand, Banner, OrderStatus, StoreSettings } from '../types';
import { api } from '../lib/api';
import { SingleImageUploader } from '../components/MultiImageUploader';
import { AdminProductModal } from '../components/admin/AdminProductModal';
import { AdminCategoryModal } from '../components/admin/AdminCategoryModal';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Grid,
  Image as ImageIcon,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  MessageCircle,
  Printer,
  Eye,
  RefreshCw,
  LogOut,
  DollarSign,
  Copy,
  FolderPlus,
  CheckSquare,
  Square,
  Zap,
  Tag,
  ArrowRightLeft,
  ChevronRight,
  FolderTree,
  Sliders,
  Sparkles
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    categories,
    brands,
    banners,
    settings,
    saveProduct,
    deleteProduct,
    duplicateProduct,
    quickUpdateProductStock,
    quickToggleProductStatus,
    quickToggleCategoryStatus,
    saveCategory,
    deleteCategory,
    saveBrand,
    deleteBrand,
    saveBanner,
    deleteBanner,
    updateStoreSettings,
    refreshStoreData,
    addToast
  } = useStore();

  const { isAdminLoggedIn, login, logout } = useAdmin();

  // Navigation & Sub-views
  const [activeAdminTab, setActiveAdminTab] = useState<
    'products' | 'categories' | 'orders' | 'banners' | 'settings'
  >('products');

  // Selected category filter tab in Products view ('all' or category slug)
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  const [productStatusFilter, setProductStatusFilter] = useState<string>('all');
  const [productGenderFilter, setProductGenderFilter] = useState<string>('all');

  // Multi-select for bulk actions
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modals state
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});

  const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({});

  const [isEditingBrand, setIsEditingBrand] = useState<boolean>(false);
  const [brandForm, setBrandForm] = useState<Partial<Brand>>({});

  const [isEditingBanner, setIsEditingBanner] = useState<boolean>(false);
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({});

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Settings form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  // Auth gate inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchOrders();
    }
  }, [isAdminLoggedIn]);

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to load orders', err);
    }
  };

  // Auth handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const success = await login(username, password);
      if (success) {
        addToast('Admin Portal Unlocked! Welcome Md. MARUF', 'success');
      } else {
        setLoginError('Invalid admin username or passcode.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Active Category Object if a specific category is selected
  const activeCategoryObj = useMemo(() => {
    if (selectedCategoryTab === 'all') return null;
    return categories.find((c) => c.slug === selectedCategoryTab) || null;
  }, [categories, selectedCategoryTab]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategoryTab !== 'all' && p.category !== selectedCategoryTab) {
        return false;
      }
      // Status filter
      if (productStatusFilter !== 'all' && p.status !== productStatusFilter) {
        return false;
      }
      // Gender filter
      if (productGenderFilter !== 'all' && p.gender !== productGenderFilter) {
        return false;
      }
      // Search query
      if (productSearch.trim()) {
        const query = productSearch.toLowerCase();
        const matchName = p.name?.toLowerCase().includes(query);
        const matchBrand = p.brand?.toLowerCase().includes(query);
        const matchSKU = p.sku?.toLowerCase().includes(query);
        const matchCategory = p.category?.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchSKU && !matchCategory) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategoryTab, productStatusFilter, productGenderFilter, productSearch]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'New' || o.status === 'Confirmed' || o.status === 'Processing').length;
  }, [orders]);

  // =========================================================================
  // PRODUCT OPERATIONS
  // =========================================================================
  const handleOpenAddProduct = (presetCategorySlug?: string) => {
    const defaultCatSlug = presetCategorySlug || (selectedCategoryTab !== 'all' ? selectedCategoryTab : categories[0]?.slug || 'mens-shoes');
    const targetCat = categories.find((c) => c.slug === defaultCatSlug);
    const catGender = targetCat?.gender && targetCat.gender !== 'All' ? (targetCat.gender as any) : 'Men';

    setProductForm({
      name: '',
      brand: brands[0]?.name || 'Unique Style Signature',
      model: `USF-${Math.floor(100 + Math.random() * 900)}`,
      category: defaultCatSlug,
      subcategory: targetCat?.name || 'Footwear',
      gender: catGender,
      description: 'उच्च गुणवत्ता वाला प्रीमियम फुटवियर, आरामदायक सोल और दैनिक उपयोग के लिए मजबूत ग्रिप।',
      images: [targetCat?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
      originalPrice: 1999,
      salePrice: 1299,
      discountPercentage: 35,
      sku: `USF-${Math.floor(1000 + Math.random() * 9000)}`,
      availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
      availableColors: ['Black', 'Navy Blue', 'Tan Brown'],
      stockQuantity: 20,
      status: 'active',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 12,
      specifications: {
        'Upper Material': 'Breathable Fabric / Synthetic Leather',
        'Sole Material': 'Anti-Skid Cushion Rubber'
      },
      tags: [defaultCatSlug, 'footwear', 'trending']
    });
    setIsEditingProduct(true);
  };

  const handleEditProduct = (prod: Product) => {
    setProductForm({
      ...prod,
      availableSizes: Array.isArray(prod.availableSizes) ? prod.availableSizes : [],
      availableColors: Array.isArray(prod.availableColors) ? prod.availableColors : [],
      images: Array.isArray(prod.images) ? prod.images : []
    });
    setIsEditingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.salePrice) {
      addToast('Product name and sale price are required', 'error');
      return;
    }

    try {
      await saveProduct(productForm);
      addToast(
        productForm.id
          ? `Product "${productForm.name}" updated live!`
          : `New product "${productForm.name}" published to store!`,
        'success'
      );
      setIsEditingProduct(false);
      setProductForm({});
    } catch (err: any) {
      addToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the store?`)) {
      try {
        await deleteProduct(id);
        addToast(`Deleted "${name}" immediately`, 'info');
      } catch (err: any) {
        addToast(err.message || 'Failed to delete product', 'error');
      }
    }
  };

  const handleDuplicateProduct = async (id: string) => {
    try {
      await duplicateProduct(id);
      addToast('Product duplicated as draft!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to duplicate product', 'error');
    }
  };

  const handleQuickToggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'active' ? 'draft' : 'active';
    try {
      await quickToggleProductStatus(product.id);
      addToast(`${product.name}: ${nextStatus === 'active' ? '🟢 Active on Store' : '⚪ Deactivated / Hidden'}`, 'info');
    } catch (err: any) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleQuickStockAdjust = async (product: Product, delta: number) => {
    const newQty = Math.max(0, (product.stockQuantity || 0) + delta);
    try {
      await quickUpdateProductStock(product.id, newQty);
      addToast(`Updated ${product.name} stock: ${newQty} pairs`, 'info');
    } catch (err: any) {
      addToast(err.message || 'Failed to update stock', 'error');
    }
  };

  const handleChangeProductCategory = async (productId: string, newCategorySlug: string) => {
    try {
      const prod = products.find((p) => p.id === productId);
      if (!prod) return;
      const targetCat = categories.find((c) => c.slug === newCategorySlug);
      await saveProduct({ ...prod, category: newCategorySlug });
      addToast(`Moved "${prod.name}" to category "${targetCat?.name || newCategorySlug}"!`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to update category', 'error');
    }
  };

  // Bulk actions
  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (confirm(`Delete ${selectedProductIds.length} selected products immediately?`)) {
      try {
        for (const id of selectedProductIds) {
          await deleteProduct(id);
        }
        addToast(`Deleted ${selectedProductIds.length} products`, 'info');
        setSelectedProductIds([]);
      } catch (err: any) {
        addToast(err.message || 'Failed to bulk delete', 'error');
      }
    }
  };

  const handleBulkToggleActive = async (targetActive: boolean) => {
    if (selectedProductIds.length === 0) return;
    try {
      for (const id of selectedProductIds) {
        const prod = products.find((p) => p.id === id);
        if (prod) {
          await saveProduct({ ...prod, status: targetActive ? 'active' : 'draft' });
        }
      }
      addToast(`Updated ${selectedProductIds.length} products status`, 'success');
      setSelectedProductIds([]);
    } catch (err: any) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  // =========================================================================
  // CATEGORY OPERATIONS
  // =========================================================================
  const handleOpenAddCategory = () => {
    setCategoryForm({
      name: '',
      slug: '',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      description: 'प्रीमियम फुटवियर और नवीनतम डिजाइनों का शानदार संग्रह।',
      order: categories.length + 1,
      isActive: true,
      gender: 'All'
    });
    setIsEditingCategory(true);
  };

  const handleEditCategory = (cat: Category) => {
    setCategoryForm({ ...cat });
    setIsEditingCategory(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      addToast('Category name is required', 'error');
      return;
    }

    const slug =
      categoryForm.slug ||
      categoryForm.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const payload = {
      ...categoryForm,
      slug,
      order: Number(categoryForm.order) || 1,
      isActive: categoryForm.isActive !== false
    };

    try {
      await saveCategory(payload);
      addToast(`Category "${categoryForm.name}" saved live!`, 'success');
      setIsEditingCategory(false);
      setCategoryForm({});
    } catch (err: any) {
      addToast(err.message || 'Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Delete category "${name}"? Existing products in this category will remain.`)) {
      try {
        await deleteCategory(id);
        addToast(`Category "${name}" deleted`, 'info');
        if (selectedCategoryTab === id) {
          setSelectedCategoryTab('all');
        }
      } catch (err: any) {
        addToast(err.message || 'Failed to delete category', 'error');
      }
    }
  };

  const handleToggleCategoryActive = async (cat: Category) => {
    try {
      await quickToggleCategoryStatus(cat.id);
      addToast(`Category "${cat.name}": ${!cat.isActive ? '🟢 Active on Store' : '⚪ Deactivated'}`, 'info');
    } catch (err: any) {
      addToast(err.message || 'Failed to toggle category', 'error');
    }
  };

  // =========================================================================
  // ORDERS & SETTINGS ACTIONS
  // =========================================================================
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      addToast(`Order updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (err: any) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (confirm(`Delete order #${orderNumber}?`)) {
      try {
        await api.deleteOrder(orderId);
        addToast('Order record removed', 'info');
        fetchOrders();
      } catch (err: any) {
        addToast(err.message || 'Failed to delete order', 'error');
      }
    }
  };

  const handleSendWhatsAppUpdate = (order: Order) => {
    const message = encodeURIComponent(
      `*Order Update from Unique Style Footwear*\n\n` +
      `Hello ${order.customerName},\n` +
      `Your order *#${order.orderNumber}* status has been updated to *${order.status.toUpperCase()}*.\n\n` +
      `📦 Footwear Items:\n` +
      order.items.map((i) => `• ${i.productName} (Size: ${i.selectedSize}, Color: ${i.selectedColor}) x ${i.quantity}`).join('\n') +
      `\n\n💰 Total Bill: ₹${order.totalAmount} (${order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod})\n` +
      `📍 Delivery Address: ${order.address}, ${order.locality}, ${order.city}\n\n` +
      `Store Address: Kokdoro Chowk, Pithoria, Kanke\n` +
      `Proprietor: ${settings.ownerName || 'Md. MARUF'}\n` +
      `Direct WhatsApp: ${settings.whatsappNumber || '9709057763'}`
    );
    const cleanNum = (order.whatsappNumber || order.mobileNumber || '').replace(/[^0-9]/g, '');
    const finalNum = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum;
    window.open(`https://wa.me/${finalNum}?text=${message}`, '_blank');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStoreSettings(settingsForm);
      addToast('Store settings & WhatsApp numbers updated live!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to update settings', 'error');
    }
  };

  // =========================================================================
  // IF NOT LOGGED IN, RENDER AUTH GATE
  // =========================================================================
  if (!isAdminLoggedIn) {
    return (
      <div id="admin-login-screen" className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Admin Control Portal</h1>
            <p className="text-xs text-slate-500 mt-1">
              Unique Style Footwear • Kokdoro Chowk, Pithoria, Kanke
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Store Access Passcode
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs"
              />
              {loginError && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? 'Verifying...' : 'Unlock Admin Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN DASHBOARD INTERFACE
  // =========================================================================
  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. TOP HEADER & INSTANT ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">Admin Control Center</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Store
              </span>
            </div>
            <p className="text-xs text-slate-500">
              यूनिक स्टाइल फुटवियर • आसानी से प्रोडक्ट्स, फोटो, साइज और कैटेगरी मैनेज करें
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Add Product Button */}
          <button
            onClick={() => handleOpenAddProduct()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product (प्रोडक्ट जोड़ें)</span>
          </button>

          {/* Quick Add Category Button */}
          <button
            onClick={handleOpenAddCategory}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-amber-400" />
            <span>+ Add Category (कैटेगरी जोड़ें)</span>
          </button>

          {/* Refresh Data */}
          <button
            onClick={async () => {
              await refreshStoreData();
              fetchOrders();
              addToast('Catalogue refreshed from database', 'info');
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Refresh All Store Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Sign Out */}
          <button
            onClick={() => {
              logout();
              addToast('Logged out of Admin Portal', 'info');
            }}
            className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN SECTION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          {
            id: 'products',
            label: `📦 Products & Categories (${products.length} Products)`,
            icon: Package,
            highlight: true
          },
          {
            id: 'categories',
            label: `📁 Categories Manager (${categories.length})`,
            icon: Grid
          },
          {
            id: 'orders',
            label: `🛍️ Orders & Billing (${orders.length})`,
            icon: ShoppingBag,
            badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined
          },
          {
            id: 'banners',
            label: `🖼️ Banners & Offers (${banners.length})`,
            icon: ImageIcon
          },
          {
            id: 'settings',
            label: '⚙️ Store Settings',
            icon: Settings
          }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/10'
                  : tab.highlight
                  ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: PRODUCTS & CATEGORY HUB (EASIEST WAY TO HANDLE EVERYTHING) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'products' && (
        <div className="space-y-5">
          {/* CATEGORY SELECTOR PILLS - SHOWING ALL APP CATEGORIES DIRECTLY */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-amber-600" />
                Select Category to View & Manage Footwear:
              </span>
              <button
                onClick={handleOpenAddCategory}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> + New Category
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* All Categories Option */}
              <button
                onClick={() => setSelectedCategoryTab('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategoryTab === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-600/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>🌟 All Products</span>
                <span className="px-1.5 py-0.5 rounded-md bg-slate-950/10 text-[10px]">
                  {products.length}
                </span>
              </button>

              {/* Exact Categories in the App */}
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug).length;
                const isSelected = selectedCategoryTab === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryTab(cat.slug)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                    {!cat.isActive && (
                      <span className="text-[9px] px-1 bg-rose-100 text-rose-700 rounded">Deactivated</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE CATEGORY MANAGEMENT BAR (WHEN A SPECIFIC CATEGORY IS SELECTED) */}
          {activeCategoryObj && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-850 text-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                  <img
                    src={activeCategoryObj.image}
                    alt={activeCategoryObj.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                      Category
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${activeCategoryObj.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {activeCategoryObj.isActive ? '🟢 Active on Store' : '⚪ Deactivated'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-0.5">{activeCategoryObj.name}</h3>
                  <p className="text-[11px] text-slate-400">
                    {filteredProducts.length} footwear models listed in this category
                  </p>
                </div>
              </div>

              {/* Action Buttons for this Category */}
              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Add Product to this Category */}
                <button
                  onClick={() => handleOpenAddProduct(activeCategoryObj.slug)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Footwear Here</span>
                </button>

                {/* 2. Active / Deactivate Toggle for this Category */}
                <button
                  onClick={() => handleToggleCategoryActive(activeCategoryObj)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeCategoryObj.isActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                  title="Toggle Category Visibility on Store"
                >
                  <span>{activeCategoryObj.isActive ? '● Active' : '○ Deactivated'}</span>
                </button>

                {/* 3. Edit Category */}
                <button
                  onClick={() => handleEditCategory(activeCategoryObj)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  title="Edit category details & photo"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {/* 4. Delete Category */}
                <button
                  onClick={() => handleDeleteCategory(activeCategoryObj.id, activeCategoryObj.name)}
                  className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SEARCH, STATUS FILTER & BULK ACTIONS TOOLBAR */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search footwear name, brand, SKU..."
                  className="pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 w-full focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={productStatusFilter}
                onChange={(e) => setProductStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 cursor-pointer"
              >
                <option value="all">All Status (सभी)</option>
                <option value="active">🟢 Active (दुकान में दिखेगा)</option>
                <option value="draft">⚪ Deactivated (छुपा हुआ)</option>
              </select>

              {/* Gender Filter */}
              <select
                value={productGenderFilter}
                onChange={(e) => setProductGenderFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 cursor-pointer"
              >
                <option value="all">All Genders</option>
                <option value="Men">Men (पुरुष)</option>
                <option value="Women">Women (महिलाएं)</option>
                <option value="Kids">Kids (बच्चे)</option>
                <option value="Unisex">Unisex</option>
              </select>

              {/* Select All Checkbox */}
              <button
                onClick={handleSelectAllFiltered}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Select All ({selectedProductIds.length})</span>
              </button>
            </div>

            {/* Bulk Actions Menu (when items selected) */}
            {selectedProductIds.length > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-2xl border border-amber-200">
                <span className="text-xs font-black text-amber-900">
                  {selectedProductIds.length} Selected:
                </span>
                <button
                  onClick={() => handleBulkToggleActive(true)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                >
                  Set Active
                </button>
                <button
                  onClick={() => handleBulkToggleActive(false)}
                  className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                >
                  Deactivate
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* PRODUCTS LIST TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-black border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 w-10">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="p-4">Footwear / Photos</th>
                    <th className="p-4">Category (कैटेगरी)</th>
                    <th className="p-4">Price & MRP (कीमत)</th>
                    <th className="p-4">Sizes (साइज)</th>
                    <th className="p-4">Stock (स्टॉक)</th>
                    <th className="p-4">Status (स्टेटस)</th>
                    <th className="p-4 text-right">Actions (ऐक्शन)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-slate-500">
                        <div className="max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                            <Package className="w-6 h-6" />
                          </div>
                          <p className="font-bold text-slate-900 text-sm">No footwear products found</p>
                          <p className="text-xs text-slate-500">
                            Click "+ Add Product" to publish your first pair in this category!
                          </p>
                          <button
                            onClick={() => handleOpenAddProduct(selectedCategoryTab !== 'all' ? selectedCategoryTab : undefined)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs"
                          >
                            <Plus className="w-4 h-4" /> Add Product Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isSelected = selectedProductIds.includes(p.id);
                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectProduct(p.id)}
                              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                            />
                          </td>

                          {/* Product Details & Image Thumbnail */}
                          <td className="p-4 flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                              <img
                                src={
                                  p.images?.[0] ||
                                  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80'
                                }
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              {p.images && p.images.length > 1 && (
                                <span className="absolute bottom-1 right-1 bg-slate-900/85 text-white text-[8px] font-black px-1 py-0.2 rounded">
                                  {p.images.length} 📸
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <p className="font-black text-slate-900 truncate text-xs">{p.name}</p>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {p.brand} • SKU: {p.sku}
                              </p>
                              {p.availableColors && p.availableColors.length > 0 && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  {p.availableColors.slice(0, 3).map((col) => (
                                    <span
                                      key={col}
                                      className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold"
                                    >
                                      {col}
                                    </span>
                                  ))}
                                  {p.availableColors.length > 3 && (
                                    <span className="text-[9px] text-slate-400">+{p.availableColors.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* 1-Click Move Category Dropdown */}
                          <td className="p-4">
                            <select
                              value={p.category}
                              onChange={(e) => handleChangeProductCategory(p.id, e.target.value)}
                              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer focus:ring-2 focus:ring-amber-500"
                              title="Move product to another category"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.slug}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Price & MRP */}
                          <td className="p-4">
                            <span className="font-black text-slate-900 text-xs">₹{p.salePrice}</span>
                            <span className="text-slate-400 line-through ml-1.5 text-[11px]">₹{p.originalPrice}</span>
                            {p.discountPercentage > 0 && (
                              <span className="block text-[10px] font-black text-emerald-600">
                                {p.discountPercentage}% OFF
                              </span>
                            )}
                          </td>

                          {/* Sizes List */}
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1 max-w-[140px]">
                              {(p.availableSizes || []).map((s) => (
                                <span
                                  key={s}
                                  className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Stock Counter */}
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleQuickStockAdjust(p, -1)}
                                disabled={p.stockQuantity <= 0}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer"
                                title="Reduce stock by 1"
                              >
                                -
                              </button>
                              <span
                                className={`font-black px-1 text-xs ${
                                  p.stockQuantity <= 5 ? 'text-rose-600' : 'text-slate-900'
                                }`}
                              >
                                {p.stockQuantity}
                              </span>
                              <button
                                onClick={() => handleQuickStockAdjust(p, 1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                                title="Add stock by 1"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Active / Deactivate Toggle Button */}
                          <td className="p-4">
                            <button
                              onClick={() => handleQuickToggleStatus(p)}
                              className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                                p.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              }`}
                              title="Click to toggle Active / Deactivated"
                            >
                              {p.status === 'active' ? '● Active (चालू)' : '○ Deactivated (बंद)'}
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditProduct(p)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition-colors cursor-pointer"
                                title="Edit Product & Photos"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDuplicateProduct(p.id)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                                title="Duplicate Product"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: CATEGORIES MANAGER (FULL GRID) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-lg font-black text-slate-900">Footwear Categories & Collections</h3>
              <p className="text-xs text-slate-500">
                Add new categories, upload collection banner photos, and toggle visibility on the store.
              </p>
            </div>
            <button
              onClick={handleOpenAddCategory}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Category (नई कैटेगरी)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const productCount = products.filter((p) => p.category === cat.slug).length;

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                        {cat.gender || 'All'}
                      </span>
                      <h4 className="text-base font-black mt-1 leading-tight">{cat.name}</h4>
                    </div>
                    <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/20">
                      {productCount} Products
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {cat.description || 'Footwear collection for everyday comfort and style.'}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">/{cat.slug}</span>
                      <button
                        onClick={() => handleToggleCategoryActive(cat)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black cursor-pointer ${
                          cat.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {cat.isActive ? '● Active' : '○ Deactivated'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedCategoryTab(cat.slug);
                          setActiveAdminTab('products');
                        }}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>View Products ({productCount})</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: ORDERS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-5">
          {/* Order Status Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1">Filter Status:</span>
              {['all', 'New', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-black border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Footwear Ordered</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status & Update</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-500">
                        No orders found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <span className="font-black text-slate-900 block">{order.orderNumber}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>

                        <td className="p-4">
                          <p className="font-black text-slate-900">{order.customerName}</p>
                          <p className="text-[11px] text-slate-500">{order.mobileNumber}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">
                            {order.address}, {order.locality}
                          </p>
                        </td>

                        <td className="p-4">
                          <div className="space-y-1 max-w-xs">
                            {order.items.map((i, idx) => (
                              <p key={idx} className="text-xs text-slate-800 truncate">
                                • {i.productName}{' '}
                                <span className="font-black text-slate-900">
                                  ({i.selectedSize}, {i.selectedColor})
                                </span>{' '}
                                x{i.quantity}
                              </p>
                            ))}
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-black text-slate-900 text-xs">₹{order.totalAmount}</span>
                          {order.deliveryCharge === 0 ? (
                            <span className="block text-[10px] text-emerald-600 font-bold">Free Delivery</span>
                          ) : (
                            <span className="block text-[10px] text-slate-400">+ ₹{order.deliveryCharge} Del.</span>
                          )}
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[10px] font-bold">
                            {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                          </span>
                        </td>

                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : order.status === 'Cancelled'
                                ? 'bg-rose-50 border-rose-300 text-rose-800'
                                : 'bg-amber-50 border-amber-300 text-amber-800'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="View Invoice"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleSendWhatsAppUpdate(order)}
                              className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 cursor-pointer"
                              title="Send WhatsApp Update"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: PROMO BANNERS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'banners' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-lg font-black text-slate-900">Homepage Offer Banners</h3>
              <p className="text-xs text-slate-500">
                Upload festive banners, discount sliders, and promotion announcements.
              </p>
            </div>
            <button
              onClick={() => {
                setBannerForm({
                  title: 'Special Footwear Sale',
                  subtitle: 'Flat 35% OFF on Sports & Loafers',
                  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
                  buttonText: 'Shop Offer',
                  link: 'mens-shoes',
                  order: banners.length + 1,
                  isActive: true
                });
                setIsEditingBanner(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((ban) => (
              <div key={ban.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="relative aspect-21/9 bg-slate-100">
                  <img src={ban.image} alt={ban.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 p-4 flex flex-col justify-end text-white">
                    <h4 className="font-black text-sm">{ban.title}</h4>
                    <p className="text-xs text-slate-200">{ban.subtitle}</p>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${ban.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {ban.isActive ? '● Active' : '○ Disabled'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setBannerForm(ban);
                        setIsEditingBanner(true);
                      }}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this banner?')) {
                          await deleteBanner(ban.id);
                          addToast('Banner removed', 'info');
                        }
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 5: STORE SETTINGS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Store Settings & WhatsApp Integration</h3>
            <p className="text-xs text-slate-500">
              Configure store name, proprietor Md. MARUF contact number, shop address, and delivery charges.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Store Brand Name</label>
                <input
                  type="text"
                  value={settingsForm.brandName || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proprietor / Owner Name</label>
                <input
                  type="text"
                  value={settingsForm.ownerName || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Mobile Number</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Store Address</label>
                <input
                  type="text"
                  value={settingsForm.address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Free Delivery Minimum Order (₹)</label>
                <input
                  type="number"
                  value={settingsForm.freeDeliveryThreshold ?? 999}
                  onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Standard Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryCharge ?? 60}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryCharge: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Top Announcement Strip Text</label>
              <input
                type="text"
                value={settingsForm.announcementText || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT MODAL (ULTRA SIMPLE) */}
      {/* ========================================================================= */}
      <AdminProductModal
        isOpen={isEditingProduct}
        onClose={() => setIsEditingProduct(false)}
        productForm={productForm}
        setProductForm={setProductForm}
        onSave={handleSaveProduct}
        categories={categories}
        brands={brands}
        onOpenAddCategory={handleOpenAddCategory}
      />

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT CATEGORY MODAL */}
      {/* ========================================================================= */}
      <AdminCategoryModal
        isOpen={isEditingCategory}
        onClose={() => setIsEditingCategory(false)}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        onSave={handleSaveCategory}
      />

      {/* ========================================================================= */}
      {/* MODAL 3: INVOICE / ORDER DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-600">FOOTWEAR ORDER INVOICE</span>
                <h3 className="text-lg font-black text-slate-900">#{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-1.5 text-xs">
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Phone / WhatsApp:</strong> {selectedOrder.mobileNumber}</p>
              <p><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.locality}, {selectedOrder.city} - {selectedOrder.pincode}</p>
              <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-800 uppercase">Ordered Footwear:</h4>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      <p className="text-slate-500">Size: {item.selectedSize} • Color: {item.selectedColor} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Charge</span>
                <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Bill Amount</span>
                <span>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Bill
              </button>
              <button
                onClick={() => handleSendWhatsAppUpdate(selectedOrder)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
