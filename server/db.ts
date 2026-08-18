import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Product, Category, Brand, Order, Banner, StoreSettings, ProductReview, DashboardStats, OrderStatus } from '../src/types.js';

interface DatabaseSchema {
  admin: {
    username: string;
    passwordHash: string;
    passwordSalt: string;
  };
  settings: StoreSettings;
  categories: Category[];
  brands: Brand[];
  banners: Banner[];
  products: Product[];
  orders: Order[];
  reviews: ProductReview[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Helper for password hashing
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return testHash === hash;
}

const initialSettings: StoreSettings = {
  brandName: 'UNIQUE STYLE FOOTWEAR',
  ownerName: 'Md. MARUF',
  tagline: 'WELCOME TO UNIQUE STYLE FOOTWEAR - Premium Quality Footwear for Everyone',
  address: 'Kokdoro Chowk, Pithoria, Kanke',
  whatsappNumber: '9709057763',
  phoneNumber: '9709057763',
  email: 'uniquestylefootwear@gmail.com',
  logoUrl: '',
  aboutUs: 'Unique Style Footwear is your premier footwear destination located at Kokdoro Chowk, Pithoria, Kanke, proudly owned and operated by Md. MARUF. We bring you the latest fashion-forward shoes, comfortable sandals, traditional slippers, sports footwear, and formal shoes from leading brands at the most honest and affordable prices. Every pair is curated for durability, unmatched comfort, and trendsetting style.',
  businessHours: 'Monday - Sunday: 9:00 AM - 9:00 PM',
  freeDeliveryThreshold: 999,
  deliveryCharge: 60,
  announcementText: '🔥 Special Offer: Free Delivery across Kanke & Ranchi on orders above ₹999! Order directly on WhatsApp: 9709057763.',
  showAnnouncement: true,
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    googleMaps: 'https://maps.google.com/?q=Kokdoro+Chowk+Pithoria+Kanke'
  },
  policies: {
    shippingPolicy: 'We provide prompt delivery across Kokdoro Chowk, Pithoria, Kanke, Ranchi, and all surrounding areas within 24-48 hours. Orders placed via WhatsApp or website are verified instantly.',
    returnPolicy: 'Easy 7-day size exchange and return policy on unworn footwear with original packaging and tags.',
    privacyPolicy: 'Your personal and order information is handled strictly for processing your footwear orders and customer support. We respect your complete privacy.',
    termsConditions: 'All prices are in Indian Rupees (INR). Cash on Delivery and direct WhatsApp UPI payments are accepted upon delivery verification.'
  }
};

const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: "Men's Shoes",
    slug: 'mens-shoes',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    description: 'Casual, formal, sneakers, and lifestyle footwear for men',
    order: 1,
    isActive: true,
    gender: 'Men'
  },
  {
    id: 'cat-2',
    name: "Sports Shoes",
    slug: 'sports-shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    description: 'Running, training, gym, and athletic footwear with maximum grip',
    order: 2,
    isActive: true,
    gender: 'All'
  },
  {
    id: 'cat-3',
    name: "Men's Sandals",
    slug: 'mens-sandals',
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80',
    description: 'Comfortable daily wear, floaters, and ethnic sandals',
    order: 3,
    isActive: true,
    gender: 'Men'
  },
  {
    id: 'cat-4',
    name: "Men's Slippers & Slides",
    slug: 'mens-slippers',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-lightweight slippers, home slides, and flip flops',
    order: 4,
    isActive: true,
    gender: 'Men'
  },
  {
    id: 'cat-5',
    name: "Women's Shoes",
    slug: 'womens-shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    description: 'Fashion sneakers, casual walking shoes, and party wear',
    order: 5,
    isActive: true,
    gender: 'Women'
  },
  {
    id: 'cat-6',
    name: "Women's Sandals & Heels",
    slug: 'womens-sandals',
    image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=600&q=80',
    description: 'Elegant flats, wedges, block heels, and festive sandals',
    order: 6,
    isActive: true,
    gender: 'Women'
  },
  {
    id: 'cat-7',
    name: "Women's Slippers",
    slug: 'womens-slippers',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    description: 'Soft cushioned everyday home and outdoor slippers',
    order: 7,
    isActive: true,
    gender: 'Women'
  },
  {
    id: 'cat-8',
    name: "Formal Shoes",
    slug: 'formal-shoes',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80',
    description: 'Classic leather lace-ups, derbys, oxfords, and slip-on loafers',
    order: 8,
    isActive: true,
    gender: 'Men'
  },
  {
    id: 'cat-9',
    name: "Kids Footwear",
    slug: 'kids-footwear',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80',
    description: 'Durable, lightweight and playful shoes for boys and girls',
    order: 9,
    isActive: true,
    gender: 'Kids'
  },
  {
    id: 'cat-10',
    name: "School Shoes",
    slug: 'school-shoes',
    image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=600&q=80',
    description: 'Sturdy black and white uniform school shoes and canvas',
    order: 10,
    isActive: true,
    gender: 'Kids'
  },
  {
    id: 'cat-11',
    name: "Boots",
    slug: 'boots',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80',
    description: 'Rugged outdoor boots, high-top ankle boots, and trekking shoes',
    order: 11,
    isActive: true,
    gender: 'All'
  },
  {
    id: 'cat-12',
    name: "Flip Flops",
    slug: 'flip-flops',
    image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=600&q=80',
    description: 'Waterproof beach and everyday flip flops',
    order: 12,
    isActive: true,
    gender: 'All'
  }
];

const initialBrands: Brand[] = [
  {
    id: 'brand-1',
    name: 'Red Tape',
    slug: 'red-tape',
    logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=200&q=80',
    description: 'Premium casual sneakers and formal leather footwear',
    isActive: true
  },
  {
    id: 'brand-2',
    name: 'Campus',
    slug: 'campus',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
    description: 'High performance sports, running and athleisure footwear',
    isActive: true
  },
  {
    id: 'brand-3',
    name: 'Sparx',
    slug: 'sparx',
    logo: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=200&q=80',
    description: 'Youthful sporty sandals, floaters, and running sneakers',
    isActive: true
  },
  {
    id: 'brand-4',
    name: 'Asian',
    slug: 'asian',
    logo: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=200&q=80',
    description: 'Affordable, stylish lightweight sports and casual shoes',
    isActive: true
  },
  {
    id: 'brand-5',
    name: 'Woodland',
    slug: 'woodland',
    logo: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=200&q=80',
    description: 'Tough all-terrain boots, leather outdoor adventure footwear',
    isActive: true
  },
  {
    id: 'brand-6',
    name: 'Bata',
    slug: 'bata',
    logo: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=200&q=80',
    description: 'Classic formal, comfort school and family footwear collection',
    isActive: true
  },
  {
    id: 'brand-7',
    name: 'Relaxo',
    slug: 'relaxo',
    logo: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=200&q=80',
    description: 'Iconic durable slippers, flite sandals, and daily comfort wear',
    isActive: true
  },
  {
    id: 'brand-8',
    name: 'Unique Style Signature',
    slug: 'unique-style-signature',
    logo: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=200&q=80',
    description: 'Exclusive handcrafted in-house footwear collection for custom fits',
    isActive: true
  }
];

const initialBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'WELCOME TO UNIQUE STYLE FOOTWEAR',
    subtitle: 'Discover the latest footwear for every occasion with supreme comfort and durable quality.',
    badge: 'NEW SEASON 2026',
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    secondaryButtonText: 'Explore Collection',
    secondaryButtonLink: '/categories',
    isActive: true,
    order: 1
  },
  {
    id: 'banner-2',
    title: 'Athletic & Sports Edition',
    subtitle: 'Engineered for energy return, lightweight cushion & superior outdoor traction.',
    badge: 'UP TO 40% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Explore Sports',
    buttonLink: '/shop?category=sports-shoes',
    secondaryButtonText: 'Order on WhatsApp',
    secondaryButtonLink: '#whatsapp-cta',
    isActive: true,
    order: 2
  },
  {
    id: 'banner-3',
    title: 'Handcrafted Formal Elegance',
    subtitle: 'Pure leather finishes, modern silhouettes, and comfortable cushioned insoles for work & celebrations.',
    badge: 'BEST SELLERS',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'View Formals',
    buttonLink: '/shop?category=formal-shoes',
    isActive: true,
    order: 3
  }
];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Red Tape Men Retro Dynamic Running Shoes',
    brand: 'Red Tape',
    model: 'RT-DYNA-902',
    category: 'sports-shoes',
    subcategory: 'Running Shoes',
    gender: 'Men',
    description: 'High-cushion athletic running shoes featuring breathable knit upper, EVA shock-absorbing mid-sole, and textured anti-slip rubber outsole. Perfect for daily jogging, gym workouts, and smart casual streetwear.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 3899,
    salePrice: 1699,
    discountPercentage: 56,
    sku: 'USF-RT-902',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Red/White', 'All Black', 'Navy Blue'],
    stockQuantity: 24,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 42,
    specifications: {
      'Upper Material': 'Engineered Mesh Fabric',
      'Sole Material': 'Lightweight EVA & TPR',
      'Closure': 'Lace-Up',
      'Ankle Height': 'Low Top',
      'Toe Shape': 'Round Toe',
      'Warranty': '3 Months Manufacturer Warranty'
    },
    tags: ['running', 'sports', 'red tape', 'gym', 'cushioned'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Campus Oxyfit Men Breathable Walking Sneakers',
    brand: 'Campus',
    model: 'CAMP-OXY-410',
    category: 'mens-shoes',
    subcategory: 'Casual Sneakers',
    gender: 'Men',
    description: 'Modern lifestyle sneakers crafted with high-density memory foam footbed and airy mesh for all-day freshness. Ideal for office casuals, college, and weekend travel.',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 1999,
    salePrice: 1199,
    discountPercentage: 40,
    sku: 'USF-CAMP-410',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    availableColors: ['Triple White', 'Slate Grey', 'Olive Green'],
    stockQuantity: 18,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 35,
    specifications: {
      'Upper Material': 'Breathable Flyknit',
      'Insole': 'Memory Tech Foam',
      'Sole Material': 'Phylon Rubber',
      'Closure': 'Lace-Up',
      'Occasion': 'Casual & Walking'
    },
    tags: ['sneakers', 'campus', 'white shoes', 'walking'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Woodland Rugged High-Ankle Leather Adventure Boots',
    brand: 'Woodland',
    model: 'WOOD-ANKLE-X8',
    category: 'boots',
    subcategory: 'Trekking Boots',
    gender: 'Men',
    description: 'Heavy-duty nubuck leather outdoor boots built for extreme durability, rocky trails, and monsoon terrain. Features deep lugged rubber tread and padded collar support.',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 4995,
    salePrice: 3299,
    discountPercentage: 34,
    sku: 'USF-WOOD-X8',
    availableSizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Camel Brown', 'Deep Khaki', 'Black'],
    stockQuantity: 12,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 28,
    specifications: {
      'Upper Material': 'Genuine Nubuck Leather',
      'Sole Material': 'Deep-Groove Thermoplastic Rubber',
      'Closure': 'Heavy Duty Metal Eyelet Lace-Up',
      'Water Resistance': 'Water Resistant Finish',
      'Occasion': 'Outdoor, Trekking & Riding'
    },
    tags: ['boots', 'woodland', 'leather', 'trekking', 'rugged'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Classic Hand-Polished Oxford Formal Shoes',
    brand: 'Unique Style Signature',
    model: 'USF-OXFORD-PRIME',
    category: 'formal-shoes',
    subcategory: 'Leather Formals',
    gender: 'Men',
    description: 'Signature formal dress shoes with handcrafted burnished finish, cushioned arch-support insole, and sleek dress sole. Essential for business suits, formal meetings, and weddings.',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 2799,
    salePrice: 1499,
    discountPercentage: 46,
    sku: 'USF-FORM-001',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Burnished Tan', 'Midnight Black', 'Rich Cherry'],
    stockQuantity: 15,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 51,
    specifications: {
      'Upper Material': 'Synthetic Patent Finish Leather',
      'Lining Material': 'Soft Breathable PU',
      'Sole Material': 'Anti-Skid Air-Mix Sole',
      'Closure': 'Closed Lace-Up (Oxford)',
      'Occasion': 'Formal & Festive'
    },
    tags: ['formal', 'oxford', 'wedding', 'office', 'tan'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Sparx High-Grip Active Outdoor Floater Sandals',
    brand: 'Sparx',
    model: 'SPX-FLT-618',
    category: 'mens-sandals',
    subcategory: 'Floaters',
    gender: 'Men',
    description: 'Rugged all-weather sports sandals with quick-adjust velcro straps, shock-absorbing contoured footbed, and water-friendly quick-drying material.',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 1199,
    salePrice: 799,
    discountPercentage: 33,
    sku: 'USF-SPX-618',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Black/Red', 'Grey/Neon Orange', 'Navy/Sky'],
    stockQuantity: 30,
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 39,
    specifications: {
      'Strap Material': 'Heavy Duty Synthetic Webbing',
      'Sole Material': 'Dual-Tone Durable Rubber',
      'Closure': 'Hook-and-Loop (Velcro)',
      'Waterproof': 'Yes, Quick Drying',
      'Occasion': 'Daily Casual & Monsoon'
    },
    tags: ['sandals', 'sparx', 'floaters', 'daily wear', 'monsoon'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: "Women's Pastel Cloud Foam Walking Sneakers",
    brand: 'Asian',
    model: 'ASN-W-CLOUD',
    category: 'womens-shoes',
    subcategory: 'Sports & Walking',
    gender: 'Women',
    description: 'Feather-light women walking shoes designed with aesthetic pastel accents, ultra-soft footbed padding, and slip-on sock fit collar.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 1799,
    salePrice: 949,
    discountPercentage: 47,
    sku: 'USF-ASN-W01',
    availableSizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    availableColors: ['Blush Pink', 'Lilac Frost', 'Cloud White'],
    stockQuantity: 16,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 27,
    specifications: {
      'Upper Material': 'Flexible 3D Air Mesh',
      'Sole Material': 'Ultralight Cushion EVA',
      'Closure': 'Slip-On with Elastic Lace',
      'Heel Height': '1.2 inch Comfort Cushion',
      'Occasion': 'Walking, College & Gym'
    },
    tags: ['women', 'sneakers', 'pink', 'lightweight', 'walking'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: "Women's Chic Embellished Party Block Heels",
    brand: 'Unique Style Signature',
    model: 'USF-HEEL-GLAM',
    category: 'womens-sandals',
    subcategory: 'Block Heels',
    gender: 'Women',
    description: 'Chic 2-inch block heel sandals with cushioned footbed and shimmering metallic ankle straps. Perfectly balanced for prolonged party comfort without foot fatigue.',
    images: [
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 2299,
    salePrice: 1299,
    discountPercentage: 43,
    sku: 'USF-W-HEEL-01',
    availableSizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    availableColors: ['Rose Gold', 'Shimmering Silver', 'Classic Black'],
    stockQuantity: 14,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 19,
    specifications: {
      'Upper Material': 'Synthetic Metallic Finish Leather',
      'Heel Type': '2.2 inch Stable Block Heel',
      'Sole Material': 'Anti-Slipping Rubber Base',
      'Closure': 'Adjustable Buckle',
      'Occasion': 'Wedding, Festive & Evening Party'
    },
    tags: ['women', 'heels', 'sandals', 'party', 'rose gold'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Relaxo Flite Extra Soft Ortho Comfort Slippers',
    brand: 'Relaxo',
    model: 'FLT-ORTHO-10',
    category: 'mens-slippers',
    subcategory: 'Ortho Slippers',
    gender: 'Men',
    description: 'Ergonomic doctor-recommended extra soft slippers with acupressure texture and arch support for relieving heel pain and everyday home wear.',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 699,
    salePrice: 449,
    discountPercentage: 35,
    sku: 'USF-FLT-ORTHO',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Midnight Blue', 'Chestnut Brown', 'Black'],
    stockQuantity: 40,
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 64,
    specifications: {
      'Material': 'Super Soft EVA Cushion',
      'Feature': 'Ortho Arch Support & Anti-Slip Base',
      'Sole': 'Flexible Grip Rubber',
      'Closure': 'Slip On',
      'Occasion': 'Daily Home & Doctor Recommended'
    },
    tags: ['slippers', 'ortho', 'relaxo', 'comfort', 'soft'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-9',
    name: 'Kids Dynamic Flash LED Light Sports Shoes',
    brand: 'Asian',
    model: 'ASN-KIDS-LED',
    category: 'kids-footwear',
    subcategory: 'Kids Sports Shoes',
    gender: 'Kids',
    description: 'Vibrant kids sneakers with responsive multi-color LED motion lights in the heel, easy velcro strap fastening, and impact-cushioning rubber base.',
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 1499,
    salePrice: 799,
    discountPercentage: 46,
    sku: 'USF-KIDS-LED-01',
    availableSizes: ['UK 10 Kids', 'UK 11 Kids', 'UK 12 Kids', 'UK 13 Kids', 'UK 1', 'UK 2', 'UK 3'],
    availableColors: ['Electric Blue', 'Hot Pink', 'Flame Black'],
    stockQuantity: 22,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 31,
    specifications: {
      'Upper': 'Lightweight Mesh & Synthetic Leather',
      'Sole': 'Shock Absorbing LED Light Sole',
      'Closure': 'Easy Pull Velcro Strap',
      'Weight': 'Featherlight 180g',
      'Age Group': '3 - 10 Years'
    },
    tags: ['kids', 'led shoes', 'light shoes', 'boys', 'girls'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-10',
    name: 'Bata Tough Sole All-Weather School Uniform Shoes',
    brand: 'Bata',
    model: 'BATA-SCH-PRO',
    category: 'school-shoes',
    subcategory: 'Uniform Shoes',
    gender: 'Kids',
    description: 'Heavy duty, scuff-resistant black school shoes with reinforced toe bumper, breathable anti-bacterial lining, and durable slip-proof PVC outsole.',
    images: [
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 899,
    salePrice: 599,
    discountPercentage: 33,
    sku: 'USF-SCH-BATA',
    availableSizes: ['UK 11 Kids', 'UK 12 Kids', 'UK 13 Kids', 'UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5', 'UK 6'],
    availableColors: ['Polished Black', 'Standard White Canvas'],
    stockQuantity: 35,
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 48,
    specifications: {
      'Upper Material': 'High Grade Scuff-Resistant Synthetic Leather',
      'Sole Material': 'Direct-Injected Solid PVC Sole',
      'Closure': 'Velcro Strap / Lace-up',
      'Ideal For': 'School Uniform & Daily Student Wear',
      'Care': 'Easy to clean with damp cloth and shoe polish'
    },
    tags: ['school shoes', 'bata', 'black shoes', 'uniform', 'durable'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-11',
    name: "Women's Ergonomic Comfort Slip-On Slides",
    brand: 'Unique Style Signature',
    model: 'USF-W-SLIDE-COZY',
    category: 'womens-slippers',
    subcategory: 'Slides',
    gender: 'Women',
    description: 'Plush memory foam comfort slide slippers with textured non-slip sole and soft upper band. Perfect for lounging at home or quick neighborhood errands.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 799,
    salePrice: 499,
    discountPercentage: 37,
    sku: 'USF-W-SLD-01',
    availableSizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    availableColors: ['Dusty Rose', 'Mint Sage', 'Beige Neutral'],
    stockQuantity: 20,
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 16,
    specifications: {
      'Material': 'High Resilience EVA Foam',
      'Footbed': 'Anatomical Deep Heel Cup',
      'Waterproof': '100% Washable & Quick Dry',
      'Occasion': 'Home Loungewear & Casual'
    },
    tags: ['women', 'slides', 'slippers', 'home wear', 'comfy'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-12',
    name: 'Everyday Waterproof Beach & Home Flip Flops',
    brand: 'Relaxo',
    model: 'RLX-BAHAMAS-9',
    category: 'flip-flops',
    subcategory: 'Flip Flops',
    gender: 'Unisex',
    description: 'Vibrant, ultra-flexible lightweight rubber flip flops with high traction grip sole and soft toe post for zero chafing.',
    images: [
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 399,
    salePrice: 249,
    discountPercentage: 37,
    sku: 'USF-RLX-FF9',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Tropical Blue', 'Sunset Orange', 'Jet Black'],
    stockQuantity: 50,
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 82,
    specifications: {
      'Material': '100% Virgin Natural Rubber Blend',
      'Strap': 'Soft Non-Chafing Polymer Strap',
      'Sole': 'Wave Pattern Anti-Slip Tread',
      'Usage': 'Beach, Monsoon & Bathroom Wear'
    },
    tags: ['flip flops', 'slippers', 'relaxo', 'budget', 'waterproof'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-13',
    name: 'Red Tape Men Classic Suede Tassel Driving Loafers',
    brand: 'Red Tape',
    model: 'RT-LOAF-701',
    category: 'mens-shoes',
    subcategory: 'Loafers',
    gender: 'Men',
    description: 'Crafted from fine faux suede with hand-stitched detailing, decorative tassel accent, and flexible rubber driving nubs for premium comfort.',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 2999,
    salePrice: 1499,
    discountPercentage: 50,
    sku: 'USF-RT-LF701',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Tan Brown', 'Navy Blue', 'Olive Suede'],
    stockQuantity: 16,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 34,
    specifications: {
      'Upper Material': 'Velvety Micro-Suede',
      'Sole Material': 'Grip Driving Sole',
      'Closure': 'Slip-on',
      'Occasion': 'Semi-formal, Casual & Party'
    },
    tags: ['loafers', 'red tape', 'men', 'casual', 'suede'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-14',
    name: 'Asian Men Air-Breeze Perforated Full Moulded Shoes',
    brand: 'Asian',
    model: 'ASN-MLD-502',
    category: 'mens-shoes',
    subcategory: 'Full Moulded Shoes',
    gender: 'Men',
    description: 'Ultra-lightweight full injection moulded casual shoes with 360-degree ventilation mesh perforations, water-resistant build, and soft cushioned insole.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 1299,
    salePrice: 699,
    discountPercentage: 46,
    sku: 'USF-ASN-MLD502',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Deep Navy', 'Steel Grey', 'All Black'],
    stockQuantity: 28,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 21,
    specifications: {
      'Upper Material': 'High Grade Breathable Polymer',
      'Sole Material': 'Shock Absorbing EVA',
      'Closure': 'Slip-on',
      'Waterproof': '100% Water Resistant',
      'Occasion': 'Daily Monsoon, Walking & Travel'
    },
    tags: ['full moulded shoes', 'asian', 'moulded', 'waterproof', 'men'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-15',
    name: 'Relaxo Comfort Lightweight Slip-On Clogs & Crocks',
    brand: 'Relaxo',
    model: 'RLX-CLG-88',
    category: 'flip-flops',
    subcategory: 'Crocks',
    gender: 'Men',
    description: 'Ergonomic pivoting heel strap clogs with breathable port holes, anti-skid wavy base, and feather-light bounce comfort for home, beach, and garden.',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 899,
    salePrice: 549,
    discountPercentage: 38,
    sku: 'USF-RLX-CLG88',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Navy Blue', 'Olive Green', 'Charcoal'],
    stockQuantity: 32,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 47,
    specifications: {
      'Material': 'Superlite Croslite-Type Foam',
      'Strap': 'Adjustable Pivoting Heel Strap',
      'Washable': 'Yes, Easy Wash with Water',
      'Occasion': 'Daily Leisure, Rainy Season & Beach'
    },
    tags: ['crocks', 'clogs', 'relaxo', 'men', 'waterproof'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-16',
    name: 'Campus Boys Turbo-Sprint Athletic Running Shoes',
    brand: 'Campus',
    model: 'CAMP-BOYS-705',
    category: 'sports-shoes',
    subcategory: 'Sports',
    gender: 'Kids',
    description: 'High-octane boys running shoes with shock absorbing spring-cushion heel pod, breathable dynamic mesh, and rapid-pull velcro lace strap.',
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 1699,
    salePrice: 999,
    discountPercentage: 41,
    sku: 'USF-CAMP-B705',
    availableSizes: ['UK 11 Kids', 'UK 12 Kids', 'UK 13 Kids', 'UK 1', 'UK 2', 'UK 3'],
    availableColors: ['Royal Blue/Orange', 'Black/Lime', 'Navy/Red'],
    stockQuantity: 20,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 38,
    specifications: {
      'Upper Material': 'Knitted 3D Breathable Mesh',
      'Sole Material': 'Phylon Air Cushion Sole',
      'Closure': 'Velcro + Elastic Laces',
      'Target Audience': 'Boys - Kids (4-12 Years)'
    },
    tags: ['boys', 'kids', 'sports', 'campus', 'running'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-17',
    name: 'Bata Toughees Girls Classic Black Mary-Jane School Shoes',
    brand: 'Bata',
    model: 'BATA-GIRL-SCH',
    category: 'school-shoes',
    subcategory: 'School Shoes',
    gender: 'Kids',
    description: 'Official girl student school shoes featuring scuff-resistant polished black finish, sturdy metal buckle strap, padded collar, and slip-free PVC outsole.',
    images: [
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 899,
    salePrice: 599,
    discountPercentage: 33,
    sku: 'USF-BATA-GSCH',
    availableSizes: ['UK 10 Kids', 'UK 11 Kids', 'UK 12 Kids', 'UK 13 Kids', 'UK 1', 'UK 2', 'UK 3', 'UK 4'],
    availableColors: ['Polished Black'],
    stockQuantity: 30,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 54,
    specifications: {
      'Upper Material': 'High Gloss Scuff-Resistant Synthetic',
      'Sole Material': 'Solid Direct Injected PVC',
      'Closure': 'Buckle Strap (Mary Jane)',
      'Target Audience': 'Girls - Kids School Uniform'
    },
    tags: ['school shoes', 'bata', 'girls', 'black', 'uniform'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-18',
    name: 'Unique Style Girls Floral Glitter Party Sandals',
    brand: 'Unique Style Signature',
    model: 'USF-GIRL-GLITZ',
    category: 'kids-footwear',
    subcategory: 'Sandals',
    gender: 'Kids',
    description: 'Adorable festive sandals embellished with sparkling 3D glitter flower accents, soft foam cushioned insole, and gentle ankle velcro fastening.',
    images: [
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 1199,
    salePrice: 699,
    discountPercentage: 41,
    sku: 'USF-G-GLITZ',
    availableSizes: ['UK 10 Kids', 'UK 11 Kids', 'UK 12 Kids', 'UK 13 Kids', 'UK 1', 'UK 2'],
    availableColors: ['Rose Gold Glitter', 'Silver Shimmer', 'Pastel Pink'],
    stockQuantity: 18,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 29,
    specifications: {
      'Upper Material': 'Glitter Synthetic PU with Floral Details',
      'Sole Material': 'Soft Anti-Slip TPR',
      'Closure': 'Velcro Ankle Strap',
      'Target Audience': 'Girls - Kids Party & Festive'
    },
    tags: ['girls', 'sandals', 'party', 'glitter', 'kids'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-19',
    name: 'Sparx Boys All-Terrain Adventure Sports Sandals',
    brand: 'Sparx',
    model: 'SPX-BOY-402',
    category: 'kids-footwear',
    subcategory: 'Sandals',
    gender: 'Kids',
    description: 'Tough outdoor sport sandals with dual velcro adjustability, anti-skid grooved rubber grip, and water-friendly cushioned footbed.',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 899,
    salePrice: 599,
    discountPercentage: 33,
    sku: 'USF-SPX-B402',
    availableSizes: ['UK 11 Kids', 'UK 12 Kids', 'UK 13 Kids', 'UK 1', 'UK 2', 'UK 3'],
    availableColors: ['Black/Neon Orange', 'Navy/Sky Blue'],
    stockQuantity: 25,
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 33,
    specifications: {
      'Upper Material': 'Durable Webbed Fabric',
      'Sole Material': 'Dual Density Rubber Sole',
      'Closure': 'Double Velcro Straps',
      'Target Audience': 'Boys - Kids Outdoor & Casual'
    },
    tags: ['boys', 'sandals', 'sparx', 'adventure', 'kids'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-20',
    name: 'Campus Boys Warm Collar Winter High-Top Sneakers',
    brand: 'Campus',
    model: 'CAMP-B-HI',
    category: 'kids-footwear',
    subcategory: 'Sneakers',
    gender: 'Kids',
    description: 'High-top trendy fashion sneakers with padded fleece collar for snug ankle warmth, sturdy rubber toe cap, and cool casual street look.',
    images: [
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 1799,
    salePrice: 999,
    discountPercentage: 44,
    sku: 'USF-CAMP-BHI',
    availableSizes: ['UK 12 Kids', 'UK 13 Kids', 'UK 1', 'UK 2', 'UK 3'],
    availableColors: ['Camel Tan', 'Charcoal Grey', 'Midnight Black'],
    stockQuantity: 15,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 17,
    specifications: {
      'Upper Material': 'Premium PU Leather & Fleece Padding',
      'Sole Material': 'Vulcanized Grip Rubber',
      'Closure': 'Side Zipper + Lace-Up',
      'Target Audience': 'Boys - Kids Winter & Casual'
    },
    tags: ['boys', 'sneakers', 'high top', 'campus', 'winter'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-21',
    name: 'Bata Women Office Classic Ballerinas & Comfort Low Flats',
    brand: 'Bata',
    model: 'BATA-W-FLAT',
    category: 'womens-shoes',
    subcategory: 'Loafers & Flats',
    gender: 'Women',
    description: 'Timeless slip-on ballet flats engineered with soft memory foam cushion bed, flexible sole, and chic minimalist bow detail.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80'
    ],
    originalPrice: 1499,
    salePrice: 899,
    discountPercentage: 40,
    sku: 'USF-BATA-WFLAT',
    availableSizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    availableColors: ['Nude Beige', 'Jet Black', 'Burgundy Cherry'],
    stockQuantity: 22,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 41,
    specifications: {
      'Upper Material': 'Soft PU Leather',
      'Insole': 'Comfort Memory Insole',
      'Sole Material': 'Flexible Rubber Sole',
      'Closure': 'Slip-on',
      'Occasion': 'Office, Daily Work & College'
    },
    tags: ['women', 'flats', 'bata', 'loafers', 'office'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'USF-2026-1001',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    customerName: 'Rahul Kumar Singh',
    mobileNumber: '9835123456',
    whatsappNumber: '9835123456',
    address: 'Near Kali Mandir, Main Road',
    locality: 'Kokdoro Chowk',
    city: 'Pithoria, Kanke',
    state: 'Jharkhand',
    pincode: '834006',
    note: 'Please call before delivery in the afternoon.',
    items: [
      {
        productId: 'prod-1',
        productName: 'Red Tape Men Retro Dynamic Running Shoes',
        brand: 'Red Tape',
        model: 'RT-DYNA-902',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        selectedSize: 'UK 8',
        selectedColor: 'Red/White',
        quantity: 1,
        unitPrice: 1699,
        totalPrice: 1699
      }
    ],
    subtotal: 1699,
    deliveryCharge: 0,
    discount: 0,
    totalAmount: 1699,
    status: 'Confirmed',
    paymentMethod: 'COD',
    source: 'whatsapp'
  },
  {
    id: 'ord-1002',
    orderNumber: 'USF-2026-1002',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    customerName: 'Pooja Kumari',
    mobileNumber: '7004123890',
    whatsappNumber: '7004123890',
    address: 'House #42, Block B, Pithoria Market',
    locality: 'Pithoria',
    city: 'Kanke, Ranchi',
    state: 'Jharkhand',
    pincode: '834006',
    note: 'Size UK 5 needed for festive event.',
    items: [
      {
        productId: 'prod-7',
        productName: "Women's Chic Embellished Party Block Heels",
        brand: 'Unique Style Signature',
        model: 'USF-HEEL-GLAM',
        image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
        selectedSize: 'UK 5',
        selectedColor: 'Rose Gold',
        quantity: 1,
        unitPrice: 1299,
        totalPrice: 1299
      },
      {
        productId: 'prod-11',
        productName: "Women's Ergonomic Comfort Slip-On Slides",
        brand: 'Unique Style Signature',
        model: 'USF-W-SLIDE-COZY',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
        selectedSize: 'UK 5',
        selectedColor: 'Dusty Rose',
        quantity: 1,
        unitPrice: 499,
        totalPrice: 499
      }
    ],
    subtotal: 1798,
    deliveryCharge: 0,
    discount: 0,
    totalAmount: 1798,
    status: 'Shipped',
    paymentMethod: 'COD',
    source: 'website'
  },
  {
    id: 'ord-1003',
    orderNumber: 'USF-2026-1003',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    customerName: 'Amit Sahu',
    mobileNumber: '8709321456',
    whatsappNumber: '8709321456',
    address: 'Kanke Block Chowk',
    locality: 'Kanke',
    city: 'Ranchi',
    state: 'Jharkhand',
    pincode: '834006',
    note: '',
    items: [
      {
        productId: 'prod-4',
        productName: 'Classic Hand-Polished Oxford Formal Shoes',
        brand: 'Unique Style Signature',
        model: 'USF-OXFORD-PRIME',
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
        selectedSize: 'UK 9',
        selectedColor: 'Burnished Tan',
        quantity: 1,
        unitPrice: 1499,
        totalPrice: 1499
      }
    ],
    subtotal: 1499,
    deliveryCharge: 0,
    discount: 0,
    totalAmount: 1499,
    status: 'Delivered',
    paymentMethod: 'COD',
    source: 'whatsapp'
  }
];

const initialReviews: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    customerName: 'Vikash Mehta (Pithoria)',
    rating: 5,
    comment: 'Super fast delivery in Kokdoro Chowk! The Red Tape running shoes are authentic and incredibly comfortable for morning runs. Value for money.',
    date: '2026-08-10',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    customerName: 'Sanjay Oraon',
    rating: 5,
    comment: 'Great grip and very lightweight. Ordered directly on WhatsApp, got same-day delivery.',
    date: '2026-08-12',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-4',
    customerName: 'Manish Verma (Kanke)',
    rating: 5,
    comment: 'The tan color oxford formal shoe finish is pure class. Perfect fit with office trousers and blazers.',
    date: '2026-08-08',
    verifiedPurchase: true
  }
];

class Database {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadDatabase();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Validate core sections
        if (parsed && parsed.products && parsed.admin) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading existing db.json, generating default state:', e);
    }

    const defaultAdminHash = hashPassword('admin123');
    const defaultData: DatabaseSchema = {
      admin: {
        username: 'admin',
        passwordHash: defaultAdminHash.hash,
        passwordSalt: defaultAdminHash.salt
      },
      settings: initialSettings,
      categories: initialCategories,
      brands: initialBrands,
      banners: initialBanners,
      products: initialProducts,
      orders: initialOrders,
      reviews: initialReviews
    };

    this.saveImmediate(defaultData);
    return defaultData;
  }

  private saveImmediate(data: DatabaseSchema) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db.json:', e);
    }
  }

  public save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveImmediate(this.data);
      this.saveTimeout = null;
    }, 150);
  }

  // Admin Auth
  public getAdmin() {
    return this.data.admin;
  }

  public updateAdminCredentials(username: string, newPassword?: string) {
    if (username) {
      this.data.admin.username = username.trim();
    }
    if (newPassword) {
      const hashed = hashPassword(newPassword.trim());
      this.data.admin.passwordHash = hashed.hash;
      this.data.admin.passwordSalt = hashed.salt;
    }
    this.save();
  }

  // Settings
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // Categories
  public getCategories(): Category[] {
    return this.data.categories.sort((a, b) => a.order - b.order);
  }

  public getCategoryById(id: string): Category | undefined {
    return this.data.categories.find(c => c.id === id);
  }

  public addCategory(cat: Omit<Category, 'id'>): Category {
    const newCategory: Category = {
      ...cat,
      id: 'cat-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };
    this.data.categories.push(newCategory);
    this.save();
    return newCategory;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    const deleted = this.data.categories.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Brands
  public getBrands(): Brand[] {
    return this.data.brands;
  }

  public getBrandById(id: string): Brand | undefined {
    return this.data.brands.find(b => b.id === id);
  }

  public addBrand(brand: Omit<Brand, 'id'>): Brand {
    const newBrand: Brand = {
      ...brand,
      id: 'brand-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      slug: brand.slug || brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };
    this.data.brands.push(newBrand);
    this.save();
    return newBrand;
  }

  public updateBrand(id: string, updates: Partial<Brand>): Brand | null {
    const idx = this.data.brands.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.brands[idx] = { ...this.data.brands[idx], ...updates };
    this.save();
    return this.data.brands[idx];
  }

  public deleteBrand(id: string): boolean {
    const initialLen = this.data.brands.length;
    this.data.brands = this.data.brands.filter(b => b.id !== id);
    const deleted = this.data.brands.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Banners
  public getBanners(): Banner[] {
    return this.data.banners.sort((a, b) => a.order - b.order);
  }

  public addBanner(banner: Omit<Banner, 'id'>): Banner {
    const newBanner: Banner = {
      ...banner,
      id: 'banner-' + Date.now()
    };
    this.data.banners.push(newBanner);
    this.save();
    return newBanner;
  }

  public updateBanner(id: string, updates: Partial<Banner>): Banner | null {
    const idx = this.data.banners.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.banners[idx] = { ...this.data.banners[idx], ...updates };
    this.save();
    return this.data.banners[idx];
  }

  public deleteBanner(id: string): boolean {
    const initialLen = this.data.banners.length;
    this.data.banners = this.data.banners.filter(b => b.id !== id);
    const deleted = this.data.banners.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Products
  public getProducts(filters?: {
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
    status?: string;
    sort?: string;
  }): Product[] {
    let result = [...this.data.products];

    if (!filters) return result;

    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category || p.subcategory?.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.brand && filters.brand !== 'all') {
      result = result.filter(p => p.brand.toLowerCase() === filters.brand?.toLowerCase());
    }

    if (filters.gender && filters.gender !== 'all') {
      result = result.filter(p => p.gender === filters.gender || p.gender === 'Unisex');
    }

    if (filters.size && filters.size !== 'all') {
      result = result.filter(p => p.availableSizes.includes(filters.size!));
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.salePrice >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.salePrice <= filters.maxPrice!);
    }

    if (filters.featured) {
      result = result.filter(p => p.isFeatured);
    }

    if (filters.bestSeller) {
      result = result.filter(p => p.isBestSeller);
    }

    if (filters.newArrival) {
      result = result.filter(p => p.isNewArrival);
    }

    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          result.sort((a, b) => a.salePrice - b.salePrice);
          break;
        case 'price-desc':
          result.sort((a, b) => b.salePrice - a.salePrice);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'discount':
          result.sort((a, b) => b.discountPercentage - a.discountPercentage);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'popular':
        default:
          result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount);
          break;
      }
    }

    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const discount = prod.originalPrice > prod.salePrice
      ? Math.round(((prod.originalPrice - prod.salePrice) / prod.originalPrice) * 100)
      : 0;

    const newProduct: Product = {
      ...prod,
      id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      discountPercentage: discount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const current = this.data.products[idx];
    const origPrice = updates.originalPrice !== undefined ? updates.originalPrice : current.originalPrice;
    const salePrice = updates.salePrice !== undefined ? updates.salePrice : current.salePrice;
    const discount = origPrice > salePrice
      ? Math.round(((origPrice - salePrice) / origPrice) * 100)
      : 0;

    this.data.products[idx] = {
      ...current,
      ...updates,
      discountPercentage: discount,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.products[idx];
  }

  public duplicateProduct(id: string): Product | null {
    const source = this.getProductById(id);
    if (!source) return null;

    const copy: Product = {
      ...source,
      id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: `${source.name} (Copy)`,
      sku: `${source.sku}-COPY-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.products.unshift(copy);
    this.save();
    return copy;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    const deleted = this.data.products.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Orders
  public getOrders(filters?: { status?: string; search?: string }): Order[] {
    let result = [...this.data.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(o => o.status === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.mobileNumber.includes(q) ||
        o.whatsappNumber.includes(q) ||
        o.address.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const orderCount = this.data.orders.length + 1001;
    const orderNumber = `USF-${new Date().getFullYear()}-${orderCount}`;
    const newOrder: Order = {
      ...orderInput,
      id: 'ord-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      orderNumber,
      createdAt: new Date().toISOString()
    };

    // Deduct stock for ordered items
    for (const item of newOrder.items) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        const newStock = Math.max(0, prod.stockQuantity - item.quantity);
        this.updateProduct(prod.id, { stockQuantity: newStock });
      }
    }

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: OrderStatus): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    this.save();
    return order;
  }

  public deleteOrder(id: string): boolean {
    const initialLen = this.data.orders.length;
    this.data.orders = this.data.orders.filter(o => o.id !== id && o.orderNumber !== id);
    const deleted = this.data.orders.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Reviews
  public getReviewsForProduct(productId: string): ProductReview[] {
    return this.data.reviews.filter(r => r.productId === productId);
  }

  public addReview(review: Omit<ProductReview, 'id' | 'date'>): ProductReview {
    const newReview: ProductReview = {
      ...review,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    this.data.reviews.unshift(newReview);

    // Update product rating and count
    const prodReviews = this.getReviewsForProduct(review.productId);
    const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / prodReviews.length).toFixed(1));
    this.updateProduct(review.productId, {
      rating: avgRating,
      reviewCount: prodReviews.length
    });

    this.save();
    return newReview;
  }

  // Dashboard Stats
  public getDashboardStats(): DashboardStats {
    const totalProducts = this.data.products.length;
    const totalCategories = this.data.categories.length;
    const totalBrands = this.data.brands.length;
    const totalOrders = this.data.orders.length;
    const pendingOrders = this.data.orders.filter(o => ['New', 'Confirmed', 'Processing', 'Packed'].includes(o.status)).length;
    const completedOrders = this.data.orders.filter(o => o.status === 'Delivered').length;
    const cancelledOrders = this.data.orders.filter(o => o.status === 'Cancelled').length;

    const totalSales = this.data.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const recentOrders = this.getOrders().slice(0, 8);
    const lowStockProducts = this.data.products.filter(p => p.stockQuantity <= 15).slice(0, 8);

    return {
      totalProducts,
      totalCategories,
      totalBrands,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalSales,
      recentOrders,
      lowStockProducts
    };
  }
}

export const db = new Database();
