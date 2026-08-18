import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, Brand, CartItem, Order, Banner, StoreSettings } from '../types';
import { api } from '../lib/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Navigation & Views
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedBrandSlug: string | null;
  setSelectedBrandSlug: (slug: string | null) => void;
  selectedGenderFilter: string;
  setSelectedGenderFilter: (gender: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected Product & Modals
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isCategoryDrawerOpen: boolean;
  setIsCategoryDrawerOpen: (open: boolean) => void;

  // Global Data & Instant Mutations
  settings: StoreSettings;
  categories: Category[];
  brands: Brand[];
  banners: Banner[];
  products: Product[];
  isLoadingProducts: boolean;
  refreshStoreData: (silent?: boolean) => Promise<void>;

  // Instant Reactive Mutation Methods (< 1 sec / 0ms instant UI reflection)
  saveProduct: (productData: Partial<Product>) => Promise<Product>;
  deleteProduct: (productId: string) => Promise<boolean>;
  duplicateProduct: (productId: string) => Promise<Product>;
  quickUpdateProductStock: (productId: string, newStock: number) => Promise<void>;
  quickToggleProductStatus: (productId: string) => Promise<void>;
  quickToggleCategoryStatus: (categoryId: string) => Promise<void>;
  saveCategory: (categoryData: Partial<Category>) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
  saveBrand: (brandData: Partial<Brand>) => Promise<Brand>;
  deleteBrand: (brandId: string) => Promise<void>;
  saveBanner: (bannerData: Partial<Banner>) => Promise<Banner>;
  deleteBanner: (bannerId: string) => Promise<void>;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, selectedSize: string, selectedColor?: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedSize: string, selectedColor: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  freeDeliveryRemaining: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // WhatsApp Order & Enquiry Generators
  generateWhatsAppProductEnquiry: (product: Product, size?: string) => string;
  generateWhatsAppProductEnquiryHindi: (product: Product, size?: string) => string;
  generateWhatsAppOrderMessage: (order: Order) => string;
  sendWhatsAppOrder: (order: Order) => void;
  openGeneralWhatsAppChat: (customText?: string) => void;
  openHindiWhatsAppChat: (customText?: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Helpers
  formatPrice: (amount: number) => string;
}

const defaultSettings: StoreSettings = {
  brandName: 'UNIQUE STYLE FOOTWEAR',
  ownerName: 'Md. MARUF',
  tagline: 'WELCOME TO UNIQUE STYLE FOOTWEAR - Premium Footwear Collection',
  address: 'Kokdoro Chowk, Pithoria, Kanke',
  whatsappNumber: '9709057763',
  phoneNumber: '9709057763',
  email: 'uniquestylefootwear@gmail.com',
  aboutUs: 'Unique Style Footwear is your trusted destination for quality footwear at Kokdoro Chowk, Pithoria, Kanke, owned and managed by Md. MARUF.',
  businessHours: 'Monday - Sunday: 9:00 AM - 9:00 PM',
  freeDeliveryThreshold: 999,
  deliveryCharge: 60,
  announcementText: '🔥 Special Offer: Free Delivery across Kanke & Ranchi on orders above ₹999! Direct WhatsApp: 9709057763',
  showAnnouncement: true,
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    googleMaps: 'https://maps.google.com/?q=Kokdoro+Chowk+Pithoria+Kanke'
  },
  policies: {
    shippingPolicy: 'Fast delivery across Kokdoro Chowk, Pithoria, Kanke, and Ranchi within 24-48 hours.',
    returnPolicy: 'Easy 7-day size exchange on unused footwear in original packaging.',
    privacyPolicy: 'Your details are safe and confidential.',
    termsConditions: 'Cash on Delivery and direct WhatsApp UPI accepted.'
  }
};

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(null);
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Cart & Wishlist with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('usf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('usf_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('usf_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Save wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('usf_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist:', e);
    }
  }, [wishlist]);

  // Broadcast channel for multi-tab / window instant synchronization
  const broadcastUpdate = useCallback((type: string, payload: any) => {
    try {
      if (typeof window !== 'undefined') {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('usf_store_sync');
          bc.postMessage({ type, payload, timestamp: Date.now() });
          bc.close();
        }
        localStorage.setItem('usf_last_sync', JSON.stringify({ type, timestamp: Date.now() }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Fetch initial data & silent background sync
  const refreshStoreData = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent && products.length === 0) {
        setIsLoadingProducts(true);
      }
      const [fetchedSettings, fetchedCategories, fetchedBrands, fetchedBanners, fetchedProducts] = await Promise.all([
        api.getSettings().catch(() => defaultSettings),
        api.getCategories().catch(() => []),
        api.getBrands().catch(() => []),
        api.getBanners().catch(() => []),
        api.getProducts().catch(() => []),
      ]);

      if (fetchedSettings) setSettings(fetchedSettings);
      if (fetchedCategories) setCategories(fetchedCategories);
      if (fetchedBrands) setBrands(fetchedBrands);
      if (fetchedBanners) setBanners(fetchedBanners);
      if (fetchedProducts) setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading store data:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [products.length]);

  useEffect(() => {
    refreshStoreData();
  }, []);

  // Listen for multi-tab real-time updates
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('usf_store_sync');
        bc.onmessage = (event) => {
          if (event.data && event.data.type) {
            refreshStoreData(true);
          }
        };
      }
    } catch (e) {
      // ignore
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'usf_last_sync') {
        refreshStoreData(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshStoreData]);

  // =========================================================================
  // INSTANT REACTIVE CATALOGUE MUTATIONS (< 1 Second / 0ms UI Reflection)
  // =========================================================================

  const saveProduct = async (productData: Partial<Product>): Promise<Product> => {
    const origPrice = Number(productData.originalPrice) || Number(productData.salePrice) || 999;
    const salePrice = Number(productData.salePrice) || origPrice;
    const discount = origPrice > salePrice ? Math.round(((origPrice - salePrice) / origPrice) * 100) : 0;

    const sizes = Array.isArray(productData.availableSizes)
      ? productData.availableSizes
      : (productData.availableSizes as unknown as string || 'UK 6, UK 7, UK 8, UK 9')
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);

    const colors = Array.isArray(productData.availableColors)
      ? productData.availableColors
      : (productData.availableColors as unknown as string || 'Standard')
          .split(',')
          .map((c: string) => c.trim())
          .filter(Boolean);

    const isUpdate = !!productData.id;

    if (isUpdate) {
      const prodId = productData.id!;
      const optimisticUpdate: Partial<Product> = {
        ...productData,
        originalPrice: origPrice,
        salePrice: salePrice,
        discountPercentage: discount,
        availableSizes: sizes.length > 0 ? sizes : ['UK 6', 'UK 7', 'UK 8', 'UK 9'],
        availableColors: colors.length > 0 ? colors : ['Standard'],
        stockQuantity: productData.stockQuantity !== undefined ? Number(productData.stockQuantity) : 10,
        images: productData.images || [],
        status: productData.status || 'active',
        updatedAt: new Date().toISOString()
      };

      // 1. INSTANT ZERO-LATENCY IN-MEMORY REACT STATE UPDATE (0ms)
      setProducts((prev) =>
        prev.map((p) => (p.id === prodId ? { ...p, ...optimisticUpdate } as Product : p))
      );

      // 2. Sync active modal product if currently open
      setSelectedProduct((prev) =>
        prev && prev.id === prodId ? ({ ...prev, ...optimisticUpdate } as Product) : prev
      );

      // 3. Sync cart items price and photo if present in cart
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === prodId
            ? { ...item, product: { ...item.product, ...optimisticUpdate } as Product }
            : item
        )
      );

      // 4. Persist to server API in background
      try {
        const saved = await api.updateProduct(prodId, optimisticUpdate);
        setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
        setSelectedProduct((prev) => (prev && prev.id === saved.id ? saved : prev));
        setCart((prevCart) =>
          prevCart.map((item) => (item.product.id === saved.id ? { ...item, product: saved } : item))
        );
        broadcastUpdate('PRODUCT_UPDATED', saved);
        return saved;
      } catch (error) {
        console.error('Failed to save product to backend:', error);
        throw error;
      }
    } else {
      // Creating a new product
      const tempId = 'temp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
      const optimisticNew: Product = {
        id: tempId,
        name: productData.name || 'New Footwear Model',
        brand: productData.brand || 'Unique Style',
        model: productData.model || 'Footwear Model',
        sku: productData.sku || `USF-${Math.floor(1000 + Math.random() * 9000)}`,
        category: productData.category || 'mens-shoes',
        subcategory: productData.subcategory || 'Casual Shoes',
        gender: productData.gender || 'Men',
        originalPrice: origPrice,
        salePrice: salePrice,
        discountPercentage: discount,
        stockQuantity: productData.stockQuantity !== undefined ? Number(productData.stockQuantity) : 10,
        availableSizes: sizes.length > 0 ? sizes : ['UK 6', 'UK 7', 'UK 8', 'UK 9'],
        availableColors: colors.length > 0 ? colors : ['Standard'],
        images: productData.images || ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
        description: productData.description || 'Premium footwear curated by Unique Style Footwear.',
        specifications: productData.specifications || { 'Upper Material': 'Synthetic / Mesh', 'Sole Material': 'Durable Rubber' },
        isFeatured: !!productData.isFeatured,
        isBestSeller: !!productData.isBestSeller,
        isNewArrival: productData.isNewArrival !== undefined ? !!productData.isNewArrival : true,
        status: productData.status || 'active',
        rating: productData.rating || 4.8,
        reviewCount: productData.reviewCount || 1,
        tags: productData.tags || ['Comfort', 'Trending'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 1. INSTANT ZERO-LATENCY IN-MEMORY INSERTION (0ms)
      setProducts((prev) => [optimisticNew, ...prev]);

      // 2. Persist to server API
      try {
        const created = await api.createProduct(productData);
        setProducts((prev) => prev.map((p) => (p.id === tempId ? created : p)));
        broadcastUpdate('PRODUCT_CREATED', created);
        return created;
      } catch (error) {
        setProducts((prev) => prev.filter((p) => p.id !== tempId));
        console.error('Failed to create product:', error);
        throw error;
      }
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    // 1. INSTANT ZERO-LATENCY REMOVAL (0ms)
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setSelectedProduct((prev) => (prev && prev.id === productId ? null : prev));
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    setWishlist((prevWish) => prevWish.filter((id) => id !== productId));

    // 2. Persist deletion to server
    try {
      await api.deleteProduct(productId);
      broadcastUpdate('PRODUCT_DELETED', { id: productId });
      return true;
    } catch (error) {
      console.error('Failed to delete product from server:', error);
      refreshStoreData(true);
      throw error;
    }
  };

  const duplicateProduct = async (productId: string): Promise<Product> => {
    const original = products.find((p) => p.id === productId);
    if (original) {
      const optimisticCopy: Product = {
        ...original,
        id: 'temp-copy-' + Date.now(),
        name: `${original.name} (Copy)`,
        sku: `${original.sku}-COPY`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProducts((prev) => [optimisticCopy, ...prev]);
    }

    try {
      const duplicated = await api.duplicateProduct(productId);
      setProducts((prev) => {
        const filtered = prev.filter((p) => !p.id.startsWith('temp-copy-'));
        return [duplicated, ...filtered];
      });
      broadcastUpdate('PRODUCT_DUPLICATED', duplicated);
      return duplicated;
    } catch (error) {
      console.error('Failed to duplicate product:', error);
      refreshStoreData(true);
      throw error;
    }
  };

  const quickUpdateProductStock = async (productId: string, newStock: number) => {
    const qty = Math.max(0, newStock);
    // Instant update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockQuantity: qty, updatedAt: new Date().toISOString() } : p))
    );
    setSelectedProduct((prev) =>
      prev && prev.id === productId ? { ...prev, stockQuantity: qty } : prev
    );

    try {
      await api.updateProduct(productId, { stockQuantity: qty });
      broadcastUpdate('PRODUCT_STOCK_UPDATED', { id: productId, stockQuantity: qty });
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const quickToggleProductStatus = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'draft' : 'active';

    // Instant update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: nextStatus, updatedAt: new Date().toISOString() } : p))
    );
    setSelectedProduct((prev) =>
      prev && prev.id === productId ? { ...prev, status: nextStatus } : prev
    );

    try {
      await api.updateProduct(productId, { status: nextStatus });
      broadcastUpdate('PRODUCT_STATUS_UPDATED', { id: productId, status: nextStatus });
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const saveCategory = async (categoryData: Partial<Category>): Promise<Category> => {
    const isUpdate = !!categoryData.id;
    if (isUpdate) {
      const id = categoryData.id!;
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...categoryData } as Category : c)));
      const saved = await api.updateCategory(id, categoryData);
      setCategories((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      broadcastUpdate('CATEGORY_UPDATED', saved);
      return saved;
    } else {
      const tempId = 'temp-cat-' + Date.now();
      const optimisticCat: Category = {
        id: tempId,
        name: categoryData.name || '',
        slug: categoryData.slug || '',
        image: categoryData.image || '',
        description: categoryData.description || '',
        order: categoryData.order || categories.length + 1,
        isActive: categoryData.isActive !== false,
        gender: categoryData.gender || 'All'
      };
      setCategories((prev) => [...prev, optimisticCat]);
      const created = await api.createCategory(categoryData);
      setCategories((prev) => prev.map((c) => (c.id === tempId ? created : c)));
      broadcastUpdate('CATEGORY_CREATED', created);
      return created;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    await api.deleteCategory(categoryId);
    broadcastUpdate('CATEGORY_DELETED', { id: categoryId });
  };

  const quickToggleCategoryStatus = async (categoryId: string) => {
    const target = categories.find((c) => c.id === categoryId);
    if (!target) return;
    const nextState = !target.isActive;
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, isActive: nextState } : c))
    );
    try {
      await api.updateCategory(categoryId, { isActive: nextState });
      broadcastUpdate('CATEGORY_UPDATED', { ...target, isActive: nextState });
    } catch (e) {
      console.error('Failed to toggle category status:', e);
    }
  };

  const saveBrand = async (brandData: Partial<Brand>): Promise<Brand> => {
    const isUpdate = !!brandData.id;
    if (isUpdate) {
      const id = brandData.id!;
      setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...brandData } as Brand : b)));
      const saved = await api.updateBrand(id, brandData);
      setBrands((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
      broadcastUpdate('BRAND_UPDATED', saved);
      return saved;
    } else {
      const tempId = 'temp-brand-' + Date.now();
      const optimisticBrand: Brand = {
        id: tempId,
        name: brandData.name || '',
        slug: brandData.slug || '',
        logo: brandData.logo || '',
        description: brandData.description || '',
        isActive: brandData.isActive !== false
      };
      setBrands((prev) => [...prev, optimisticBrand]);
      const created = await api.createBrand(brandData);
      setBrands((prev) => prev.map((b) => (b.id === tempId ? created : b)));
      broadcastUpdate('BRAND_CREATED', created);
      return created;
    }
  };

  const deleteBrand = async (brandId: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== brandId));
    await api.deleteBrand(brandId);
    broadcastUpdate('BRAND_DELETED', { id: brandId });
  };

  const saveBanner = async (bannerData: Partial<Banner>): Promise<Banner> => {
    const isUpdate = !!bannerData.id;
    if (isUpdate) {
      const id = bannerData.id!;
      setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...bannerData } as Banner : b)));
      const saved = await api.updateBanner(id, bannerData);
      setBanners((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
      broadcastUpdate('BANNER_UPDATED', saved);
      return saved;
    } else {
      const tempId = 'temp-banner-' + Date.now();
      const optimisticBanner: Banner = {
        id: tempId,
        title: bannerData.title || '',
        subtitle: bannerData.subtitle || '',
        badge: bannerData.badge || 'PROMOTION',
        imageUrl: bannerData.imageUrl || '',
        buttonText: bannerData.buttonText || 'Shop Now',
        buttonLink: bannerData.buttonLink || 'shop',
        isActive: bannerData.isActive !== false,
        order: bannerData.order || banners.length + 1
      };
      setBanners((prev) => [...prev, optimisticBanner]);
      const created = await api.createBanner(bannerData);
      setBanners((prev) => prev.map((b) => (b.id === tempId ? created : b)));
      broadcastUpdate('BANNER_CREATED', created);
      return created;
    }
  };

  const deleteBanner = async (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    await api.deleteBanner(bannerId);
    broadcastUpdate('BANNER_DELETED', { id: bannerId });
  };

  const updateStoreSettings = async (newSettings: Partial<StoreSettings>): Promise<StoreSettings> => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    const res = await api.updateSettings(newSettings);
    if (res.settings) {
      setSettings(res.settings);
    }
    broadcastUpdate('SETTINGS_UPDATED', newSettings);
    return res.settings || (newSettings as StoreSettings);
  };

  // Cart operations
  const addToCart = (product: Product, selectedSize: string, selectedColor?: string, quantity: number = 1) => {
    const color = selectedColor || (product.availableColors && product.availableColors[0]) || 'Standard';
    const size = selectedSize || (product.availableSizes && product.availableSizes[0]) || 'Standard';

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIdx].quantity + quantity;
        if (newQty > product.stockQuantity) {
          addToast(`Maximum available stock is ${product.stockQuantity}`, 'error');
          return prevCart;
        }
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
        };
        addToast(`Updated ${product.name} quantity in cart!`, 'success');
        return updated;
      } else {
        if (product.stockQuantity < quantity) {
          addToast(`Product is currently out of stock`, 'error');
          return prevCart;
        }
        addToast(`Added ${product.name} (Size: ${size}) to cart!`, 'success');
        return [...prevCart, { product, selectedSize: size, selectedColor: color, quantity }];
      }
    });
  };

  const updateCartQuantity = (productId: string, selectedSize: string, selectedColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        ) {
          if (quantity > item.product.stockQuantity) {
            addToast(`Only ${item.product.stockQuantity} items in stock`, 'error');
            return { ...item, quantity: item.product.stockQuantity };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, selectedSize: string, selectedColor: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    );
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart computations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
  const deliveryFee = cartSubtotal >= (settings.freeDeliveryThreshold || 999) || cart.length === 0
    ? 0
    : (settings.deliveryCharge || 60);
  const cartTotal = cartSubtotal + deliveryFee;
  const freeDeliveryRemaining = Math.max(0, (settings.freeDeliveryThreshold || 999) - cartSubtotal);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        addToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Saved to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // WhatsApp helpers
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generateWhatsAppProductEnquiry = (product: Product, size?: string): string => {
    const sizeText = size ? ` (Size: ${size})` : '';
    return `Hello UNIQUE STYLE FOOTWEAR, I am interested in ${product.name}${sizeText}, Model: ${product.model}, Price: ${formatPrice(product.salePrice)}. Please provide more details regarding availability and delivery to Kokdoro Chowk / Pithoria / Kanke.`;
  };

  const generateWhatsAppProductEnquiryHindi = (product: Product, size?: string): string => {
    const sizeText = size ? ` (साइज: ${size})` : '';
    return `नमस्ते मोहम्मद मारुफ़ जी (Unique Style Footwear, कोकदोरो चौक), मुझे इस जूते के बारे में जानकारी चाहिए:\n• मॉडल: ${product.name}${sizeText}\n• ब्रांड: ${product.brand}\n• कीमत: ${formatPrice(product.salePrice)}\n\nकृपया बताएं क्या यह साइज दुकान में उपलब्ध है और होम डिलीवरी कैसे मिलेगी?`;
  };

  const generateWhatsAppOrderMessage = (order: Order): string => {
    const itemsList = order.items
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.productName}*\n   • Brand: ${item.brand} | Model: ${item.model}\n   • Size: ${item.selectedSize} | Color: ${item.selectedColor}\n   • Qty: ${item.quantity} × ${formatPrice(item.unitPrice)} = *${formatPrice(item.totalPrice)}*`
      )
      .join('\n\n');

    return `🛍️ *NEW ORDER - UNIQUE STYLE FOOTWEAR*
━━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* ${order.orderNumber}
👤 *Customer Name:* ${order.customerName}
📞 *Mobile:* ${order.mobileNumber}
💬 *WhatsApp:* ${order.whatsappNumber}
📍 *Delivery Address:*
${order.address}, ${order.locality}
${order.city}, ${order.state} - ${order.pincode}
${order.note ? `📝 *Note:* ${order.note}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━
👟 *ORDERED ITEMS:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* ${formatPrice(order.subtotal)}
🚚 *Delivery:* ${order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}
💵 *TOTAL AMOUNT:* *${formatPrice(order.totalAmount)}*
💳 *Payment Method:* ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
━━━━━━━━━━━━━━━━━━━━━
*Store:* UNIQUE STYLE FOOTWEAR
*Proprietor / Owner:* ${settings.ownerName || 'Md. MARUF'}
*Store Address:* Kokdoro Chowk, Pithoria, Kanke
*Contact / WhatsApp:* +91 ${settings.whatsappNumber || '9709057763'}

Please confirm my order and share estimated delivery time. Thank you!`;
  };

  const sendWhatsAppOrder = (order: Order) => {
    const message = generateWhatsAppOrderMessage(order);
    const cleanNumber = (settings.whatsappNumber || '9709057763').replace(/[^0-9]/g, '');
    const fullNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const url = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openGeneralWhatsAppChat = (customText?: string) => {
    const defaultMsg = `Hello UNIQUE STYLE FOOTWEAR (Owner: ${settings.ownerName || 'Md. MARUF'}, Kokdoro Chowk, Pithoria, Kanke), I would like to enquire about footwear designs, sizing, and store availability.`;
    const cleanNumber = (settings.whatsappNumber || '9709057763').replace(/[^0-9]/g, '');
    const fullNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const url = `https://wa.me/${fullNumber}?text=${encodeURIComponent(customText || defaultMsg)}`;
    window.open(url, '_blank');
  };

  const openHindiWhatsAppChat = (customText?: string) => {
    const defaultMsg = `नमस्ते मोहम्मद मारुफ़ जी (Unique Style Footwear, कोकदोरो चौक, पिठोरिया, कांके), मुझे जूतों के डिजाइन, साइज और दुकान के बारे में जानकारी चाहिए।`;
    const cleanNumber = (settings.whatsappNumber || '9709057763').replace(/[^0-9]/g, '');
    const fullNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const url = `https://wa.me/${fullNumber}?text=${encodeURIComponent(customText || defaultMsg)}`;
    window.open(url, '_blank');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedBrandSlug,
        setSelectedBrandSlug,
        selectedGenderFilter,
        setSelectedGenderFilter,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isCategoryDrawerOpen,
        setIsCategoryDrawerOpen,
        settings,
        categories,
        brands,
        banners,
        products,
        isLoadingProducts,
        refreshStoreData,
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
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        freeDeliveryRemaining,
        wishlist,
        toggleWishlist,
        isInWishlist,
        generateWhatsAppProductEnquiry,
        generateWhatsAppProductEnquiryHindi,
        generateWhatsAppOrderMessage,
        sendWhatsAppOrder,
        openGeneralWhatsAppChat,
        openHindiWhatsAppChat,
        toasts,
        addToast,
        removeToast,
        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
