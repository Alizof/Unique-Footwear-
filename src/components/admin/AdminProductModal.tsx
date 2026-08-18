import React, { useState } from 'react';
import { Product, Category, Brand } from '../../types';
import { MultiImageUploader } from '../MultiImageUploader';
import { X, Save, Zap, Plus, Check, ShieldCheck, Sparkles } from 'lucide-react';

const PRESET_SIZES_ADULT = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
const PRESET_SIZES_KIDS = ['UK 10', 'UK 11', 'UK 12', 'UK 13', 'UK 1', 'UK 2', 'UK 3'];
const PRESET_COLORS = [
  'Black',
  'Tan Brown',
  'Dark Brown',
  'White',
  'Navy Blue',
  'Grey',
  'Olive',
  'Red',
  'Multi-color'
];

export const FOOTWEAR_PRESETS = [
  {
    label: '🏃 Sports / Running',
    name: 'Campus Air-Flex Running Shoes',
    categorySlug: 'sports-shoes',
    gender: 'Men' as const,
    brand: 'Campus',
    originalPrice: 1999,
    salePrice: 1299,
    stockQuantity: 25,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Black', 'Navy Blue', 'White'],
    description: 'High-performance breathable mesh running shoe with phylon shock-absorbing sole for daily running, walking, and gym.'
  },
  {
    label: '👞 Formal Leather',
    name: 'Red Tape Classic Derby Oxford Formals',
    categorySlug: 'formal-shoes',
    gender: 'Men' as const,
    brand: 'Red Tape',
    originalPrice: 2999,
    salePrice: 1699,
    stockQuantity: 18,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Black', 'Tan Brown', 'Dark Brown'],
    description: 'Premium handcrafted formal shoes with genuine leather finish, padded cushioned footbed, and anti-slip TPR sole.'
  },
  {
    label: '🥾 Casual Suede Loafers',
    name: 'Unique Style Handcrafted Driving Loafers',
    categorySlug: 'mens-shoes',
    gender: 'Men' as const,
    brand: 'Unique Style Signature',
    originalPrice: 2199,
    salePrice: 1399,
    stockQuantity: 30,
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Tan Brown', 'Navy Blue', 'Black'],
    description: 'Soft micro-suede slip-on loafers with driver rubber grip pods. Perfect for party wear, driving, and casual outings.'
  },
  {
    label: '👡 Sandals & Floaters',
    name: 'Sparx Heavy-Duty Outdoor Floaters',
    categorySlug: 'mens-sandals',
    gender: 'Men' as const,
    brand: 'Sparx',
    originalPrice: 1199,
    salePrice: 899,
    stockQuantity: 40,
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Black', 'Navy Blue', 'Olive'],
    description: 'Quick-dry outdoor strap sandals with sturdy grooved rubber sole and cushioned footbed for rough and tough use.'
  },
  {
    label: '🩴 Daily Comfort Slides',
    name: 'Bata Ultra-Comfort Cushion Slides',
    categorySlug: 'mens-slippers',
    gender: 'Unisex' as const,
    brand: 'Bata',
    originalPrice: 699,
    salePrice: 449,
    stockQuantity: 50,
    images: [
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9'],
    colors: ['Black', 'Navy Blue', 'Grey'],
    description: 'Super soft waterproof EVA foam slides with anti-skid bottom for bathroom, home, and daily casual wear.'
  },
  {
    label: '👠 Women\'s Heels & Sandals',
    name: 'Bata Glamour Block Heels & Ethnic Sandals',
    categorySlug: 'womens-shoes',
    gender: 'Women' as const,
    brand: 'Bata',
    originalPrice: 1799,
    salePrice: 1199,
    stockQuantity: 20,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    colors: ['Tan Brown', 'Black', 'Red'],
    description: 'Elegant festive and office footwear with cushioned memory footbed and comfortable 2-inch block heel.'
  },
  {
    label: '🧒 Kids School & Sports',
    name: 'Action School Time Uniform Shoes',
    categorySlug: 'kids-footwear',
    gender: 'Kids' as const,
    brand: 'Action',
    originalPrice: 899,
    salePrice: 599,
    stockQuantity: 35,
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['UK 10', 'UK 11', 'UK 12', 'UK 13', 'UK 1', 'UK 2', 'UK 3'],
    colors: ['Black', 'White'],
    description: 'Durable school uniform footwear with easy velcro strap closure and lightweight non-marking rubber sole.'
  }
];

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productForm: Partial<Product>;
  setProductForm: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  onSave: (e: React.FormEvent) => void;
  categories: Category[];
  brands: Brand[];
  onOpenAddCategory?: () => void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  productForm,
  setProductForm,
  onSave,
  categories,
  brands,
  onOpenAddCategory
}) => {
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [customColorInput, setCustomColorInput] = useState('');
  const [showAdvancedSpecs, setShowAdvancedSpecs] = useState(false);

  if (!isOpen) return null;

  const isEditing = !!productForm.id;

  const toggleSize = (size: string) => {
    const currentSizes = Array.isArray(productForm.availableSizes)
      ? [...productForm.availableSizes]
      : [];
    const updated = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setProductForm((prev) => ({ ...prev, availableSizes: updated }));
  };

  const addCustomSize = () => {
    if (!customSizeInput.trim()) return;
    const size = customSizeInput.trim();
    const currentSizes = Array.isArray(productForm.availableSizes)
      ? [...productForm.availableSizes]
      : [];
    if (!currentSizes.includes(size)) {
      setProductForm((prev) => ({ ...prev, availableSizes: [...currentSizes, size] }));
    }
    setCustomSizeInput('');
  };

  const toggleColor = (color: string) => {
    const currentColors = Array.isArray(productForm.availableColors)
      ? [...productForm.availableColors]
      : [];
    const updated = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    setProductForm((prev) => ({ ...prev, availableColors: updated }));
  };

  const addCustomColor = () => {
    if (!customColorInput.trim()) return;
    const col = customColorInput.trim();
    const currentColors = Array.isArray(productForm.availableColors)
      ? [...productForm.availableColors]
      : [];
    if (!currentColors.includes(col)) {
      setProductForm((prev) => ({ ...prev, availableColors: [...currentColors, col] }));
    }
    setCustomColorInput('');
  };

  const applyPreset = (preset: typeof FOOTWEAR_PRESETS[0]) => {
    const orig = preset.originalPrice;
    const sale = preset.salePrice;
    const disc = Math.round(((orig - sale) / orig) * 100);

    setProductForm((prev) => ({
      ...prev,
      name: preset.name,
      brand: preset.brand,
      category: preset.categorySlug,
      gender: preset.gender,
      originalPrice: orig,
      salePrice: sale,
      discountPercentage: disc,
      images: preset.images,
      availableSizes: preset.sizes,
      availableColors: preset.colors,
      description: preset.description,
      stockQuantity: preset.stockQuantity || 20,
      status: 'active',
      sku: `USF-${Math.floor(1000 + Math.random() * 9000)}`
    }));
  };

  const origPrice = Number(productForm.originalPrice) || 0;
  const salePrice = Number(productForm.salePrice) || 0;
  const calculatedDiscount =
    origPrice > 0 && salePrice > 0 && origPrice > salePrice
      ? Math.round(((origPrice - salePrice) / origPrice) * 100)
      : 0;

  const currentCategory = productForm.category || (categories[0]?.slug || 'mens-shoes');
  const currentBrand = productForm.brand || (brands[0]?.name || 'Unique Style Signature');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 space-y-5 max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-800 text-amber-400 flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider">
                {isEditing ? '✏️ Edit Product Details' : '➕ Add Footwear to Catalogue'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {isEditing ? `Edit: ${productForm.name || 'Footwear'}` : 'Add New Footwear (नया जूता जोड़ें)'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Presets (Only when adding new) */}
        {!isEditing && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-red-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-red-700" />
                1-Click Quick Fill Presets (त्वरित सैंपल से भरें):
              </span>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                1 क्लिक में ऑटो-फिल
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FOOTWEAR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-red-800 hover:text-white text-slate-800 text-xs font-bold border border-red-200 shadow-2xs transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={onSave} className="space-y-4">
          {/* 1. PRODUCT PICTURES (MULTI-IMAGE DIRECT UPLOAD / URLS) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <MultiImageUploader
              images={productForm.images || []}
              onChange={(imgs) => setProductForm({ ...productForm, images: imgs })}
              maxImages={6}
              label="📸 Product Pictures (जूते की फोटो - 1 से 6 फोटो जोड़ें)"
              helperText="कैमरे से फोटो लें, फोन/गैलरी से अपलोड करें या लिंक डालें। पहली फोटो मुख्य डिस्प्ले कवर बनेगी।"
            />
          </div>

          {/* 2. PRODUCT NAME & BRAND */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title / Name (जूते का नाम) *
              </label>
              <input
                type="text"
                required
                value={productForm.name || ''}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="e.g. Campus Air-Flex Sports Running Shoes"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Brand Name (ब्रांड का नाम) *
              </label>
              <input
                type="text"
                required
                value={productForm.brand || ''}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                placeholder="e.g. Campus / Red Tape / Sparx / Bata / Unique Style"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
              />
            </div>
          </div>

          {/* 3. CATEGORY & GENDER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Category (कैटेगरी) *
                </label>
                {onOpenAddCategory && (
                  <button
                    type="button"
                    onClick={onOpenAddCategory}
                    className="text-[11px] font-bold text-red-800 hover:text-red-900 flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> नई बनाएं
                  </button>
                )}
              </div>
              <select
                required
                value={currentCategory}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-red-800/20"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Gender (किसके लिए)
              </label>
              <select
                value={productForm.gender || 'Men'}
                onChange={(e) => setProductForm({ ...productForm, gender: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-red-800/20"
              >
                <option value="Men">Men (पुरुषों के लिए)</option>
                <option value="Women">Women (महिलाओं के लिए)</option>
                <option value="Kids">Kids (बच्चों के लिए)</option>
                <option value="Unisex">Unisex (सभी के लिए)</option>
              </select>
            </div>
          </div>

          {/* 4. PRICE, MRP & STOCK QUANTITY */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sale / Offer Price (ऑफर रेट ₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={productForm.salePrice !== undefined ? productForm.salePrice : ''}
                  onChange={(e) => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                  placeholder="e.g. 1299"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-900 bg-white focus:ring-2 focus:ring-red-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Original MRP (असली रेट ₹)
                </label>
                <input
                  type="number"
                  min={1}
                  value={productForm.originalPrice !== undefined ? productForm.originalPrice : ''}
                  onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                  placeholder="e.g. 1999"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-red-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stock Available (स्टॉक पीस)
                </label>
                <input
                  type="number"
                  min={0}
                  value={productForm.stockQuantity !== undefined ? productForm.stockQuantity : 10}
                  onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                  placeholder="e.g. 20"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-red-800/20"
                />
              </div>
            </div>

            {/* Live Discount Calculator */}
            {origPrice > 0 && salePrice > 0 && (
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="font-semibold text-slate-600">Calculated Discount:</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black text-xs">
                  {calculatedDiscount > 0 ? `${calculatedDiscount}% OFF` : 'MRP (0% OFF)'}
                </span>
                {origPrice > salePrice && (
                  <span className="text-slate-500 font-medium">Customer saves ₹{origPrice - salePrice} per pair</span>
                )}
              </div>
            )}
          </div>

          {/* 5. SIZES (1-CLICK INTERACTIVE SELECTION) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                📏 Available Sizes (साइज - क्लिक करके चुनें):
              </label>
              <span className="text-[11px] font-bold text-red-800">
                {(productForm.availableSizes || []).length} Selected
              </span>
            </div>

            {/* Adult UK Sizes */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Adult Sizes (UK / IND):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SIZES_ADULT.map((sz) => {
                  const isSelected = (productForm.availableSizes || []).includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-red-800 text-white shadow-2xs ring-2 ring-red-900/40'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {sz} {isSelected && <Check className="w-3 h-3 text-amber-300" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kids UK Sizes */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Kids Sizes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SIZES_KIDS.map((sz) => {
                  const isSelected = (productForm.availableSizes || []).includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-2xs ring-2 ring-amber-700/40'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {sz} {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Size */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                placeholder="Add custom size (e.g. Free Size / UK 13 / Euro 43)"
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white flex-1 focus:ring-2 focus:ring-red-800/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSize();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCustomSize}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                + Add Size
              </button>
            </div>
          </div>

          {/* 6. COLOURS (1-CLICK INTERACTIVE SELECTION) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                🎨 Available Colours (रंग - क्लिक करके चुनें):
              </label>
              <span className="text-[11px] font-bold text-red-800">
                {(productForm.availableColors || []).length} Selected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRESET_COLORS.map((col) => {
                const isSelected = (productForm.availableColors || []).includes(col);
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => toggleColor(col)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-red-800 text-white shadow-2xs ring-2 ring-red-900/40'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {col} {isSelected && <Check className="w-3 h-3 text-amber-300" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Color */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customColorInput}
                onChange={(e) => setCustomColorInput(e.target.value)}
                placeholder="Add custom colour (e.g. Camel / Maroon / Cherry Red)"
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white flex-1 focus:ring-2 focus:ring-red-800/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomColor();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCustomColor}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                + Add Colour
              </button>
            </div>
          </div>

          {/* 7. PRODUCT DESCRIPTION */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              📝 Product Description (प्रोडक्ट का विवरण)
            </label>
            <textarea
              rows={2}
              value={productForm.description || ''}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="मटेरियल, सोल कम्फर्ट, वाटरप्रूफिंग, रोज़ाना पहनने या पार्टी वियर के बारे में लिखें..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs resize-none text-slate-900 focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
            />
          </div>

          {/* 8. BADGES & HIGHLIGHTS */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              ⭐ Badges & Store Badging (दुकान पर हाइलाइट करें):
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setProductForm({ ...productForm, isFeatured: !productForm.isFeatured })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  productForm.isFeatured
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-600/30'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                ⭐ Featured ({productForm.isFeatured ? 'Yes' : 'No'})
              </button>
              <button
                type="button"
                onClick={() => setProductForm({ ...productForm, isBestSeller: !productForm.isBestSeller })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  productForm.isBestSeller
                    ? 'bg-red-800 text-white ring-2 ring-red-900/40'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                🔥 Best Seller ({productForm.isBestSeller ? 'Yes' : 'No'})
              </button>
              <button
                type="button"
                onClick={() => setProductForm({ ...productForm, isNewArrival: !productForm.isNewArrival })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  productForm.isNewArrival
                    ? 'bg-blue-600 text-white ring-2 ring-blue-700/40'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                ⚡ New Arrival ({productForm.isNewArrival ? 'Yes' : 'No'})
              </button>
            </div>
          </div>

          {/* 9. ADVANCED SPECIFICATIONS TOGGLE */}
          <div className="border border-slate-200 rounded-2xl p-3 bg-white">
            <button
              type="button"
              onClick={() => setShowAdvancedSpecs(!showAdvancedSpecs)}
              className="flex items-center justify-between w-full text-xs font-bold text-slate-700"
            >
              <span>⚙️ Additional Details & SKU (मॉडल कोड व मटेरियल स्पेसिफिकेशन)</span>
              <span className="text-red-800">{showAdvancedSpecs ? 'Hide ▲' : 'Show ▼'}</span>
            </button>

            {showAdvancedSpecs && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">SKU / Model Code</label>
                  <input
                    type="text"
                    value={productForm.sku || ''}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="e.g. USF-4902"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Subcategory / Tagline</label>
                  <input
                    type="text"
                    value={productForm.subcategory || ''}
                    onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                    placeholder="e.g. Lightweight Mesh / Leatherette"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 10. ACTIVE / DEACTIVATE STATUS TOGGLE */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Store Visibility Status (दुकान में दिखेगा या छुपाएं):</span>
              <span className="text-[11px] text-slate-500">
                {productForm.status !== 'draft' ? '🟢 Active - ग्राहक इसे स्टोर में देख और खरीद सकते हैं' : '⚪ Deactivated / Draft - वेबसाइट पर छुपा हुआ है'}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setProductForm({
                  ...productForm,
                  status: productForm.status === 'draft' ? 'active' : 'draft'
                })
              }
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                productForm.status !== 'draft'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {productForm.status !== 'draft' ? '● Active (चालू)' : '○ Deactivated (बंद)'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel (रद्द करें)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-red-800 hover:bg-red-900 text-white font-black rounded-xl text-xs shadow-md shadow-red-800/20 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>{isEditing ? 'Save Changes (अपडेट करें)' : 'Publish to Store (दुकान में जोड़ें)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
