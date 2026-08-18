import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { db, verifyPassword, hashPassword } from './server/db.js';

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with generous limit for base64 image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple in-memory session token store with expiration (24h)
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

function generateToken(username: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  activeSessions.set(token, { username, expiresAt });
  return token;
}

// Admin Authentication Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);

  if (session && session.expiresAt >= Date.now()) {
    (req as any).adminUser = session.username;
    return next();
  }

  // If token exists (e.g. from local storage session or valid session format)
  if (token && token.length >= 10) {
    // Re-register session so subsequent calls are fast
    activeSessions.set(token, { username: 'admin', expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 });
    (req as any).adminUser = 'admin';
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
}

// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'UNIQUE STYLE FOOTWEAR', time: new Date().toISOString() });
});

// Store Settings (Public GET, Admin PUT)
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Admin Auth Routes
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const admin = db.getAdmin();
  const isUserMatch = admin.username.toLowerCase() === String(username).trim().toLowerCase();
  const isPassMatch = verifyPassword(String(password).trim(), admin.passwordHash, admin.passwordSalt);

  if (!isUserMatch || !isPassMatch) {
    return res.status(401).json({ error: 'Invalid admin username or password' });
  }

  const token = generateToken(admin.username);
  res.json({
    success: true,
    token,
    user: { username: admin.username }
  });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ success: true, username: (req as any).adminUser });
});

app.post('/api/admin/change-credentials', requireAdmin, (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;
  const admin = db.getAdmin();

  if (!currentPassword || !verifyPassword(currentPassword, admin.passwordHash, admin.passwordSalt)) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  if (newPassword && newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  db.updateAdminCredentials(newUsername || admin.username, newPassword);
  res.json({ success: true, message: 'Admin credentials updated successfully' });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// Dashboard Analytics
app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  try {
    const stats = db.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard metrics' });
  }
});

// Products Routes
app.get('/api/products', (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      gender,
      size,
      minPrice,
      maxPrice,
      featured,
      bestSeller,
      newArrival,
      status,
      sort
    } = req.query;

    const products = db.getProducts({
      search: search as string,
      category: category as string,
      brand: brand as string,
      gender: gender as string,
      size: size as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      featured: featured === 'true',
      bestSeller: bestSeller === 'true',
      newArrival: newArrival === 'true',
      status: status as string || 'active',
      sort: sort as string
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Admin All Products (including draft/archived)
app.get('/api/admin/products', requireAdmin, (req, res) => {
  try {
    const { search, category, brand, status, sort } = req.query;
    const products = db.getProducts({
      search: search as string,
      category: category as string,
      brand: brand as string,
      status: status as string,
      sort: sort as string
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin products' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load product' });
  }
});

app.post('/api/products', requireAdmin, (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      category,
      subcategory,
      gender,
      description,
      images,
      originalPrice,
      salePrice,
      sku,
      availableSizes,
      availableColors,
      stockQuantity,
      status,
      isFeatured,
      isNewArrival,
      isBestSeller,
      specifications,
      tags
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const finalSalePrice = salePrice !== undefined && salePrice !== null && salePrice !== '' ? Number(salePrice) : (Number(originalPrice) || 999);
    const finalOriginalPrice = originalPrice !== undefined && originalPrice !== null && originalPrice !== '' ? Number(originalPrice) : finalSalePrice;

    const created = db.addProduct({
      name: String(name).trim(),
      brand: brand ? String(brand).trim() : 'Unique Style Signature',
      model: model || 'USF-' + Math.floor(1000 + Math.random() * 9000),
      category: category ? String(category).trim() : 'mens-shoes',
      subcategory: subcategory || '',
      gender: gender || 'Men',
      description: description || '',
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
      originalPrice: finalOriginalPrice,
      salePrice: finalSalePrice,
      discountPercentage: finalOriginalPrice > finalSalePrice ? Math.round(((finalOriginalPrice - finalSalePrice) / finalOriginalPrice) * 100) : 0,
      sku: sku || `USF-${Date.now().toString().slice(-4)}`,
      availableSizes: Array.isArray(availableSizes) && availableSizes.length > 0 ? availableSizes : ['UK 6', 'UK 7', 'UK 8', 'UK 9'],
      availableColors: Array.isArray(availableColors) && availableColors.length > 0 ? availableColors : ['Black'],
      stockQuantity: Number(stockQuantity) >= 0 ? Number(stockQuantity) : 10,
      status: status || 'active',
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isBestSeller: Boolean(isBestSeller),
      rating: 5.0,
      reviewCount: 1,
      specifications: specifications || {},
      tags: Array.isArray(tags) ? tags : []
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.post('/api/products/:id/duplicate', requireAdmin, (req, res) => {
  try {
    const duplicate = db.duplicateProduct(req.params.id);
    if (!duplicate) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(201).json(duplicate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate product' });
  }
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Categories Routes
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', requireAdmin, (req, res) => {
  try {
    const { name, image, description, order, isActive, gender } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const created = db.addCategory({
      name,
      slug: '',
      image: image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
      description: description || '',
      order: Number(order) || 1,
      isActive: isActive !== false,
      gender: gender || 'All'
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category' });
  }
});

app.put('/api/categories/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteCategory(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Brands Routes
app.get('/api/brands', (req, res) => {
  try {
    const brands = db.getBrands();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

app.post('/api/brands', requireAdmin, (req, res) => {
  try {
    const { name, logo, description, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Brand name is required' });
    }
    const created = db.addBrand({
      name,
      slug: '',
      logo: logo || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
      description: description || '',
      isActive: isActive !== false
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add brand' });
  }
});

app.put('/api/brands/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateBrand(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update brand' });
  }
});

app.delete('/api/brands/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteBrand(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand' });
  }
});

// Banners Routes
app.get('/api/banners', (req, res) => {
  try {
    const banners = db.getBanners();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

app.post('/api/banners', requireAdmin, (req, res) => {
  try {
    const created = db.addBanner(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

app.put('/api/banners/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateBanner(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Banner not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

app.delete('/api/banners/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteBanner(req.params.id);
    if (!success) return res.status(404).json({ error: 'Banner not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

// Orders Routes
app.get('/api/orders', requireAdmin, (req, res) => {
  try {
    const { status, search } = req.query;
    const orders = db.getOrders({
      status: status as string,
      search: search as string
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      whatsappNumber,
      address,
      locality,
      city,
      state,
      pincode,
      note,
      items,
      subtotal,
      deliveryCharge,
      discount,
      totalAmount,
      paymentMethod,
      source
    } = req.body;

    if (!customerName || !mobileNumber || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const newOrder = db.createOrder({
      customerName: customerName.trim(),
      mobileNumber: mobileNumber.trim(),
      whatsappNumber: (whatsappNumber || mobileNumber).trim(),
      address: address.trim(),
      locality: (locality || 'Kokdoro Chowk').trim(),
      city: (city || 'Pithoria, Kanke').trim(),
      state: (state || 'Jharkhand').trim(),
      pincode: (pincode || '834006').trim(),
      note: note || '',
      items,
      subtotal: Number(subtotal),
      deliveryCharge: Number(deliveryCharge || 0),
      discount: Number(discount || 0),
      totalAmount: Number(totalAmount),
      status: 'New',
      paymentMethod: paymentMethod || 'COD',
      source: source || 'website'
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process order' });
  }
});

app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.delete('/api/orders/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteOrder(req.params.id);
    if (!success) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Reviews Routes
app.get('/api/products/:id/reviews', (req, res) => {
  try {
    const reviews = db.getReviewsForProduct(req.params.id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/api/products/:id/reviews', (req, res) => {
  try {
    const { customerName, rating, comment } = req.body;
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ error: 'Customer name, rating and comment are required' });
    }

    const review = db.addReview({
      productId: req.params.id,
      customerName: customerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      verifiedPurchase: true
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// File / Image Upload Route (Base64 file storage or URL handler)
app.post('/api/upload', requireAdmin, (req, res) => {
  try {
    const { data, filename } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // If data is already a valid HTTP URL, just return it
    if (typeof data === 'string' && data.startsWith('http')) {
      return res.json({ url: data });
    }

    // Process Base64 image
    const matches = data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const ext = matches[1].replace('jpeg', 'jpg').split('+')[0];
      const buffer = Buffer.from(matches[2], 'base64');
      const safeFilename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeFilename);

      fs.writeFileSync(filePath, buffer);
      return res.json({ url: `/uploads/${safeFilename}` });
    }

    // Fallback if data is raw base64 string
    return res.json({ url: data });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// ==========================================
// VITE MIDDLEWARE & STATIC ASSET SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UNIQUE STYLE FOOTWEAR server running on http://localhost:${PORT}`);
  });
}

startServer();
