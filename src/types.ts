export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  subcategory?: string;
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  description: string;
  images: string[];
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  sku: string;
  availableSizes: string[];
  availableColors: string[];
  stockQuantity: number;
  status: 'active' | 'draft' | 'archived';
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  order: number;
  isActive: boolean;
  gender?: 'Men' | 'Women' | 'Kids' | 'All';
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  isActive: boolean;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  model: string;
  image: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'New' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  mobileNumber: string;
  whatsappNumber: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'COD' | 'WhatsApp_Payment' | 'UPI_On_Delivery';
  source: 'website' | 'whatsapp';
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  isActive: boolean;
  order: number;
}

export interface StoreSettings {
  brandName: string;
  ownerName?: string;
  tagline: string;
  address: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  logoUrl?: string;
  aboutUs: string;
  businessHours: string;
  freeDeliveryThreshold: number;
  deliveryCharge: number;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    googleMaps?: string;
  };
  policies: {
    shippingPolicy: string;
    returnPolicy: string;
    privacyPolicy: string;
    termsConditions: string;
  };
  announcementText?: string;
  showAnnouncement: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSales: number;
  recentOrders: Order[];
  lowStockProducts: Product[];
}
