import { Product, Category, Brand, Order, Banner, StoreSettings, ProductReview, DashboardStats, OrderStatus } from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('usf_admin_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const data = await response.json();
      errorMsg = data.error || errorMsg;
    } catch {
      errorMsg = response.statusText;
    }
    throw new ApiError(response.status, errorMsg);
  }

  return response.json();
}

export const api = {
  // Store Settings
  getSettings: () => request<StoreSettings>('/settings'),
  updateSettings: (settings: Partial<StoreSettings>) => 
    request<{ success: boolean; settings: StoreSettings }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // Products
  getProducts: (params?: {
    search?: string;
    category?: string;
    brand?: string;
    gender?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    const qStr = query.toString();
    return request<Product[]>(`/products${qStr ? `?${qStr}` : ''}`);
  },

  getAdminProducts: (params?: { search?: string; category?: string; brand?: string; status?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    const qStr = query.toString();
    return request<Product[]>(`/admin/products${qStr ? `?${qStr}` : ''}`);
  },

  getProductById: (id: string) => request<Product>(`/products/${id}`),

  createProduct: (product: Partial<Product>) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  updateProduct: (id: string, product: Partial<Product>) =>
    request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  duplicateProduct: (id: string) =>
    request<Product>(`/products/${id}/duplicate`, {
      method: 'POST',
    }),

  deleteProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategories: () => request<Category[]>('/categories'),
  createCategory: (cat: Partial<Category>) =>
    request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(cat),
    }),
  updateCategory: (id: string, cat: Partial<Category>) =>
    request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cat),
    }),
  deleteCategory: (id: string) =>
    request<{ success: boolean }>(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Brands
  getBrands: () => request<Brand[]>('/brands'),
  createBrand: (brand: Partial<Brand>) =>
    request<Brand>('/brands', {
      method: 'POST',
      body: JSON.stringify(brand),
    }),
  updateBrand: (id: string, brand: Partial<Brand>) =>
    request<Brand>(`/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brand),
    }),
  deleteBrand: (id: string) =>
    request<{ success: boolean }>(`/brands/${id}`, {
      method: 'DELETE',
    }),

  // Banners
  getBanners: () => request<Banner[]>('/banners'),
  createBanner: (banner: Partial<Banner>) =>
    request<Banner>('/banners', {
      method: 'POST',
      body: JSON.stringify(banner),
    }),
  updateBanner: (id: string, banner: Partial<Banner>) =>
    request<Banner>(`/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(banner),
    }),
  deleteBanner: (id: string) =>
    request<{ success: boolean }>(`/banners/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val) query.set(key, val);
      });
    }
    const qStr = query.toString();
    return request<Order[]>(`/orders${qStr ? `?${qStr}` : ''}`);
  },

  getOrderById: (id: string) => request<Order>(`/orders/${id}`),

  createOrder: (orderData: any) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteOrder: (id: string) =>
    request<{ success: boolean }>(`/orders/${id}`, {
      method: 'DELETE',
    }),

  // Product Reviews
  getReviews: (productId: string) => request<ProductReview[]>(`/products/${productId}/reviews`),
  addReview: (productId: string, review: { customerName: string; rating: number; comment: string }) =>
    request<ProductReview>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    }),

  // Image Upload
  uploadImage: (base64Data: string, filename?: string) =>
    request<{ url: string }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ data: base64Data, filename }),
    }),

  // Admin Auth & Dashboard
  adminLogin: (credentials: { username: string; password: string }) =>
    request<{ success: boolean; token: string; user: { username: string } }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  adminCheck: () => request<{ success: boolean; username: string }>('/admin/me'),

  changeAdminCredentials: (data: { currentPassword: string; newUsername?: string; newPassword?: string }) =>
    request<{ success: boolean; message: string }>('/admin/change-credentials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getDashboardStats: () => request<DashboardStats>('/admin/dashboard'),
};
