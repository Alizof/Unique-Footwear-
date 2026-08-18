import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    brands,
    selectedCategorySlug,
    setSelectedCategorySlug,
    selectedBrandSlug,
    setSelectedBrandSlug,
    selectedGenderFilter,
    setSelectedGenderFilter,
    searchQuery,
    setSearchQuery,
    formatPrice,
    isLoadingProducts,
  } = useStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>(selectedGenderFilter || 'all');

  // Sync state if selectedGenderFilter changes from outside
  useEffect(() => {
    if (selectedGenderFilter) {
      setSelectedGender(selectedGenderFilter);
    }
  }, [selectedGenderFilter]);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popular');

  // Available Sizes for Footwear
  const allSizes = ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];

  // Extract all unique colors from products
  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.availableColors) {
        p.availableColors.forEach((c) => set.add(c));
      }
    });
    return Array.from(set);
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.status !== 'active') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.model.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q) ||
          (product.tags && product.tags.some((t) => t.toLowerCase().includes(q)));
        if (!matchSearch) return false;
      }

      // Category
      if (selectedCategorySlug && selectedCategorySlug !== 'all') {
        const targetSlug = selectedCategorySlug.toLowerCase();
        const catObj = categories.find((c) => c.slug.toLowerCase() === targetSlug);
        const catName = catObj ? catObj.name.toLowerCase() : '';
        const cleanTarget = targetSlug.replace(/-/g, ' ');

        const matchCategory =
          product.category.toLowerCase() === targetSlug ||
          (product.subcategory && product.subcategory.toLowerCase() === targetSlug) ||
          (product.subcategory && product.subcategory.toLowerCase().includes(cleanTarget)) ||
          (catName && product.category.toLowerCase().includes(catName)) ||
          (catName && product.name.toLowerCase().includes(catName)) ||
          product.name.toLowerCase().includes(cleanTarget) ||
          (product.tags && product.tags.some((t) => t.toLowerCase() === targetSlug || t.toLowerCase() === cleanTarget));

        if (!matchCategory) {
          return false;
        }
      }

      // Brand
      if (selectedBrandSlug && selectedBrandSlug !== 'all') {
        const brandObj = brands.find((b) => b.slug === selectedBrandSlug);
        const targetBrandName = brandObj ? brandObj.name : selectedBrandSlug;
        if (product.brand.toLowerCase() !== targetBrandName.toLowerCase()) {
          return false;
        }
      }

      // Gender
      if (selectedGender !== 'all') {
        if (product.gender !== selectedGender && product.gender !== 'Unisex') {
          return false;
        }
      }

      // Size
      if (selectedSize !== 'all') {
        if (!product.availableSizes || !product.availableSizes.includes(selectedSize)) {
          return false;
        }
      }

      // Color
      if (selectedColor !== 'all') {
        if (!product.availableColors || !product.availableColors.includes(selectedColor)) {
          return false;
        }
      }

      // Price
      if (product.salePrice > maxPrice) {
        return false;
      }

      // Stock
      if (inStockOnly && product.stockQuantity <= 0) {
        return false;
      }

      // Discount
      if (minDiscount > 0 && product.discountPercentage < minDiscount) {
        return false;
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategorySlug,
    selectedBrandSlug,
    selectedGender,
    selectedSize,
    selectedColor,
    maxPrice,
    inStockOnly,
    minDiscount,
    brands,
  ]);

  // Sorted Products
  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return result.sort((a, b) => a.salePrice - b.salePrice);
      case 'price-desc':
        return result.sort((a, b) => b.salePrice - a.salePrice);
      case 'rating':
        return result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'discount':
        return result.sort((a, b) => b.discountPercentage - a.discountPercentage);
      case 'newest':
        return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popular':
      default:
        return result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount);
    }
  }, [filteredProducts, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategorySlug(null);
    setSelectedBrandSlug(null);
    setSelectedGenderFilter('all');
    setSearchQuery('');
    setSelectedGender('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(5000);
    setInStockOnly(false);
    setMinDiscount(0);
    setSortBy('popular');
  };

  const hasActiveFilters =
    Boolean(selectedCategorySlug) ||
    Boolean(selectedBrandSlug) ||
    Boolean(searchQuery) ||
    selectedGender !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    maxPrice < 5000 ||
    inStockOnly ||
    minDiscount > 0;

  return (
    <div id="shop-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Title & Top Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Footwear Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Showing <strong className="text-slate-900 font-bold">{sortedProducts.length}</strong> available pairs
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search footwear..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 text-xs rounded-xl border border-slate-200 focus:bg-white focus:outline-hidden focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-3 pr-8 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-xl border border-slate-200 focus:outline-hidden appearance-none cursor-pointer"
            >
              <option value="popular">Sort: Popular</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden p-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-medium mr-1">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-900 border border-red-200 font-semibold">
              Search: "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
            </span>
          )}
          {selectedCategorySlug && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-900 border border-red-200 font-semibold">
              Category: {categories.find((c) => c.slug === selectedCategorySlug)?.name || selectedCategorySlug}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategorySlug(null)} />
            </span>
          )}
          {selectedBrandSlug && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-900 border border-red-200 font-semibold">
              Brand: {brands.find((b) => b.slug === selectedBrandSlug)?.name || selectedBrandSlug}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrandSlug(null)} />
            </span>
          )}
          {selectedGender !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-semibold">
              Gender: {selectedGender}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGender('all')} />
            </span>
          )}
          {selectedSize !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-semibold">
              Size: {selectedSize}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSize('all')} />
            </span>
          )}
          {minDiscount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-semibold">
              {minDiscount}%+ Discount
              <X className="w-3 h-3 cursor-pointer" onClick={() => setMinDiscount(0)} />
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-red-600 hover:text-red-700 font-bold ml-2 underline underline-offset-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        </div>
      )}

      {/* Main Grid with Sidebar Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6 text-xs bg-slate-50 p-5 rounded-3xl border border-slate-200/80 h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-red-600" />
              Filter By
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:text-red-700 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Gender Filter */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Gender / Department
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'Men', 'Women', 'Kids', 'Unisex'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedGender === g
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g === 'all' ? 'All' : g}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Categories
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategorySlug(null)}
                className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between font-medium ${
                  !selectedCategorySlug
                    ? 'bg-red-100 text-red-900 font-bold'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between font-medium ${
                      selectedCategorySlug === cat.slug
                        ? 'bg-red-100 text-red-900 font-bold'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Brands
            </h4>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrandSlug(null)}
                className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between font-medium ${
                  !selectedBrandSlug
                    ? 'bg-red-100 text-red-900 font-bold'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                <span>All Brands</span>
              </button>
              {brands.map((brand) => {
                const count = products.filter(
                  (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
                ).length;
                return (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrandSlug(brand.slug)}
                    className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between font-medium ${
                      selectedBrandSlug === brand.slug
                        ? 'bg-red-100 text-red-900 font-bold'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    <span className="truncate">{brand.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Filter Chips */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Footwear Size (India / UK)
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`py-1.5 rounded-lg text-center font-bold text-xs ${
                  selectedSize === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Sizes
              </button>
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-1.5 rounded-lg text-center font-bold font-mono text-xs ${
                    selectedSize === size
                      ? 'bg-red-600 text-white ring-2 ring-red-600 shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Max Price
              </h4>
              <span className="font-black text-red-700 font-mono">
                {formatPrice(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹200</span>
              <span>₹5,000</span>
            </div>
          </div>

          {/* Discount Filter */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Minimum Discount
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[0, 20, 30, 40, 50].map((d) => (
                <button
                  key={d}
                  onClick={() => setMinDiscount(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    minDiscount === d
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d === 0 ? 'Any' : `${d}%+`}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Cards Grid Area */}
        <div className="md:col-span-3">
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 text-3xl flex items-center justify-center mx-auto">
                🔍
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                No Footwear Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any footwear matching your specific filter criteria. Try clearing search filters or browsing all categories.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="bg-white w-full max-w-xs h-full p-5 overflow-y-auto space-y-5 text-xs shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-base text-slate-900">Filter Footwear</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Gender */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Department</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'Men', 'Women', 'Kids', 'Unisex'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        selectedGender === g
                          ? 'bg-slate-900 text-white font-bold'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Category</h4>
                <select
                  value={selectedCategorySlug || 'all'}
                  onChange={(e) =>
                    setSelectedCategorySlug(e.target.value === 'all' ? null : e.target.value)
                  }
                  className="w-full p-2 bg-slate-100 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brands */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Brand</h4>
                <select
                  value={selectedBrandSlug || 'all'}
                  onChange={(e) =>
                    setSelectedBrandSlug(e.target.value === 'all' ? null : e.target.value)
                  }
                  className="w-full p-2 bg-slate-100 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="all">All Brands</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.slug}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Size (India/UK)</h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedSize('all')}
                    className={`px-2.5 py-1 rounded-lg ${
                      selectedSize === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100'
                    }`}
                  >
                    All
                  </button>
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-2.5 py-1 rounded-lg font-mono ${
                        selectedSize === s ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold">Max Price</span>
                  <span className="font-bold text-amber-700">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-amber-500 text-slate-950 rounded-xl font-bold text-xs"
              >
                Apply Filters ({sortedProducts.length})
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl font-medium text-xs"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
