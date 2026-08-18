import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { GENDER_CATEGORY_TABS, SubCategoryItem } from '../data/categoryNavigationData';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  MessageCircle,
  Award,
  Flame,
  Zap,
  Tag,
  CheckCircle2,
  PhoneCall,
  Phone,
  UserCheck,
  Navigation,
  Clock,
  MapPin,
  SlidersHorizontal,
  Menu,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    settings,
    banners,
    categories,
    brands,
    products,
    isLoadingProducts,
    setCurrentView,
    setSelectedCategorySlug,
    setSelectedBrandSlug,
    setSelectedGenderFilter,
    setIsCategoryDrawerOpen,
    openGeneralWhatsAppChat,
  } = useStore();

  const [activeHomeGenderTab, setActiveHomeGenderTab] = useState<'Men' | 'Women' | 'Boys - Kids' | 'Girls - Kids'>('Men');

  const activeBanners = banners.filter((b) => b.isActive);
  const heroBanner = activeBanners.length > 0
    ? activeBanners[0]
    : {
        title: 'WELCOME TO UNIQUE STYLE FOOTWEAR',
        subtitle: 'Discover the latest footwear for every occasion.',
        badge: 'NEW ARRIVALS 2026',
        imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1600&q=85',
        buttonText: 'Shop Now',
        secondaryButtonText: 'Explore Collection',
      };

  const featuredProducts = products.filter((p) => p.isFeatured && p.status === 'active').slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival && p.status === 'active').slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller && p.status === 'active').slice(0, 8);

  const handleSubCategoryClick = (item: SubCategoryItem) => {
    setSelectedCategorySlug(item.categorySlug || item.slug);
    setSelectedBrandSlug(null);
    if (item.gender) {
      setSelectedGenderFilter(item.gender);
    }
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenderCardClick = (genderId: 'Men' | 'Women' | 'Boys - Kids' | 'Girls - Kids') => {
    setActiveHomeGenderTab(genderId);
  };

  const currentHomeTab = GENDER_CATEGORY_TABS.find((t) => t.id === activeHomeGenderTab) || GENDER_CATEGORY_TABS[0];

  const handleBrandClick = (slug: string) => {
    setSelectedBrandSlug(slug);
    setSelectedCategorySlug(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="home-view" className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. HERO BANNER */}
      <section id="hero-banner" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[520px] flex items-center bg-gradient-to-r from-red-950 via-slate-950 to-red-950 shadow-2xl border border-red-900/40">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroBanner.imageUrl}
              alt="Footwear Hero"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-35 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl p-6 sm:p-12 lg:p-16 space-y-5">
            {heroBanner.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/25 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-widest backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{heroBanner.badge}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {heroBanner.title || 'WELCOME TO UNIQUE STYLE FOOTWEAR'}
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
              {heroBanner.subtitle || 'Discover the latest footwear for every occasion.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setSelectedBrandSlug(null);
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 sm:px-8 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>{heroBanner.buttonText || 'Shop Now'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('categories');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 sm:px-7 py-3.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-2xl text-sm font-bold backdrop-blur-md border border-white/20 transition-all active:scale-95"
              >
                {heroBanner.secondaryButtonText || 'Explore Collection'}
              </button>

              <button
                onClick={() => openGeneralWhatsAppChat()}
                className="px-4 py-3.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                title="Direct WhatsApp Order"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span className="hidden sm:inline">WhatsApp Order</span>
              </button>
            </div>

            {/* Micro store pill */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-red-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Kokdoro Chowk, Pithoria, Kanke
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                Open 9AM - 9PM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section id="shop-by-category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-700 mb-1">
              <span>Find Your Fit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Shop By Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select category to explore specialized footwear collection for Men, Women & Kids
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm shadow-red-600/20 transition-all active:scale-95"
              title="Open Category Sidebar (☰)"
            >
              <Menu className="w-4 h-4 text-white" />
              <span>☰ Select Category</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('categories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-slate-900 hover:text-red-600 flex items-center gap-1 group"
            >
              <span>Full Explorer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 4 Main Gender Cards (Men, Women, Boys - Kids, Girls - Kids) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {GENDER_CATEGORY_TABS.map((tab) => {
            const isActive = tab.id === activeHomeGenderTab;
            return (
              <button
                key={tab.id}
                id={`home-gender-tab-${tab.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleGenderCardClick(tab.id)}
                className={`relative p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all text-left flex flex-col items-center sm:items-start group ${
                  isActive
                    ? 'bg-red-50/70 border-red-500 shadow-md ring-2 ring-red-500/20'
                    : 'bg-white border-slate-200 hover:border-red-200 hover:bg-red-50/30 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 w-full">
                  {/* Photo Container with Dark Pill Badge */}
                  <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden shadow-xs bg-slate-200 shrink-0">
                    <img
                      src={tab.avatarImage}
                      alt={tab.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-3 pb-1 flex items-center justify-center">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white">
                        {tab.badgeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Text Information */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm sm:text-base font-extrabold tracking-tight truncate ${
                        isActive ? 'text-red-900' : 'text-slate-950'
                      }`}
                    >
                      {tab.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                      {tab.items.length} Shoe Categories
                    </p>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-2 transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white font-black'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-red-100 group-hover:text-red-900'
                      }`}
                    >
                      {isActive ? 'Selected' : 'View Styles'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Gender's Footwear Subcategories Grid (Matches Category Selection Modal) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {currentHomeTab.title} Footwear Collection
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Click any style to view products
            </span>
          </div>

          {/* 2 to 5 column Footwear Subcategories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-6 gap-x-4">
            {currentHomeTab.items.map((item) => (
              <div
                key={item.id}
                id={`home-cat-item-${item.id}`}
                onClick={() => handleSubCategoryClick(item)}
                className="group flex flex-col items-center text-center cursor-pointer select-none p-2.5 rounded-2xl hover:bg-red-50/40 transition-all duration-200"
              >
                {/* Light Gray Circular Background Container with Centered Shoe Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#f4f5f7] border border-slate-200/80 group-hover:border-red-400 flex items-center justify-center p-2.5 transition-all duration-200 group-hover:scale-105 group-hover:bg-white group-hover:shadow-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xs group-hover:rotate-2 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                {/* Category Name Label Below Image */}
                <span className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-red-700 transition-colors leading-snug">
                  {item.name}
                </span>

                {/* Micro Brand / Style Note */}
                {item.brandSuggestion && (
                  <span className="text-[10px] text-slate-500 font-medium mt-1 line-clamp-1 bg-slate-100 group-hover:bg-red-100 group-hover:text-red-900 px-2 py-0.5 rounded-md transition-colors">
                    {item.brandSuggestion}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section id="featured-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-red-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Featured Footwear
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setSelectedBrandSlug(null);
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-red-600 flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-2xl h-72 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. PROMOTIONAL OFFER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-900 via-red-950 to-slate-950 text-white p-6 sm:p-12 shadow-2xl border border-red-800/60">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider">
              SPECIAL DISCOUNTS & OFFERS
            </span>
            <h3 className="text-2xl sm:text-4xl font-black leading-tight text-white">
              Get Up To 50% Off On Running Sneakers & Sandals
            </h3>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
              Explore authentic footwear from Red Tape, Campus, Sparx, Asian, Woodland and our Signature series. Direct WhatsApp orders available for all Ranchi & Kanke residents.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentView('offers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white hover:bg-amber-300 text-red-950 rounded-xl text-xs font-black transition-colors"
              >
                View Discount Deals
              </button>
              <button
                onClick={() => openGeneralWhatsAppChat('Hello, please share the latest discount offers on running shoes and sandals')}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Enquire via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section id="new-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-red-700 mb-1">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              <span>Just Dropped</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-red-600 flex items-center gap-1 group"
          >
            <span>See More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. POPULAR BRANDS SHOWCASE */}
      <section id="popular-brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-red-700 mb-1">
              <Award className="w-3.5 h-3.5 text-red-600" />
              <span>Trusted Manufacturers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Featured Footwear Brands
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentView('brands');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-red-600 flex items-center gap-1 group"
          >
            <span>All Brands</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {brands.filter((b) => b.isActive).map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.slug)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-600 hover:shadow-xl hover:shadow-red-600/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-red-700 transition-colors">
                {brand.name}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {brand.description || 'Quality Footwear'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BEST SELLERS */}
      <section id="best-sellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-red-700 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-red-600 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. WHY CHOOSE US */}
      <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-red-700">
            Our Promise
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Why Choose UNIQUE STYLE FOOTWEAR?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Located at Kokdoro Chowk, Pithoria, Kanke. Managed by proprietor <strong className="text-slate-800 font-bold">{settings.ownerName || 'Md. MARUF'}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">100% Quality Footwear</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every pair is carefully inspected for sole durability, stitching excellence, and comfortable insole cushioning.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Multiple Leading Brands</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose from Red Tape, Campus, Sparx, Asian, Woodland, Bata, Relaxo, and our exclusive Signature in-house designs.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Latest Trend Designs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From contemporary chunk sneakers to classic formal oxfords and comfortable home slides, we stay ahead of fashion trends.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Affordable Prices</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enjoy honest retail pricing and generous seasonal discounts on your favorite footwear.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Easy Local Ordering</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simple online ordering with Cash on Delivery and prompt delivery across Pithoria, Kanke, and Ranchi.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Direct WhatsApp Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct assistance and instantaneous order verification via WhatsApp: +91 {settings.whatsappNumber || '9709057763'}.
            </p>
          </div>
        </div>
      </section>

      {/* 9. DEDICATED STORE CONTACT & OWNER DETAILS SECTION */}
      <section id="store-contact-details" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Ambient background glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>CONTACT DETAILS & PROPRIETOR</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  Contact UNIQUE STYLE FOOTWEAR
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Owner: <strong className="text-white">{settings.ownerName || 'Md. MARUF'}</strong> • Mobile / WhatsApp: <strong className="text-emerald-400 font-mono">+91 {settings.whatsappNumber || '9709057763'}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700 flex items-center gap-1.5"
                >
                  <span>Full Contact Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3 Contact Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Owner Information */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Store Proprietor</span>
                  <h3 className="text-xl font-black text-white">{settings.ownerName || 'Md. MARUF'}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Direct owner of Unique Style Footwear. Available for footwear enquiries, bulk customer requests, and local orders.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Business Owner
                  </span>
                </div>
              </div>

              {/* Card 2: Mobile & WhatsApp */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Direct Number</span>
                  <h3 className="text-xl font-black text-emerald-400 font-mono">+91 {settings.whatsappNumber || '9709057763'}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Call or WhatsApp directly for instant footwear sizing confirmation, home delivery, and photo requests.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <a
                    href={`https://wa.me/91${(settings.whatsappNumber || '9709057763').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${settings.ownerName || 'Md. MARUF'}, I am looking for footwear at Unique Style Footwear.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:+91${(settings.phoneNumber || settings.whatsappNumber || '9709057763').replace(/[^0-9]/g, '')}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black flex items-center justify-center gap-1.5 border border-slate-700 transition-all active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Direct Call</span>
                  </a>
                </div>
              </div>

              {/* Card 3: Physical Location */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Store Address</span>
                  <h3 className="text-base font-bold text-white leading-snug">{settings.address || 'Kokdoro Chowk, Pithoria, Kanke'}</h3>
                  <p className="text-xs text-slate-400">
                    Open Mon-Sun: 9:00 AM - 9:00 PM • Easy roadside parking available
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Unique Style Footwear, Kokdoro Chowk, Pithoria, Kanke')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-slate-950" />
                    <span>Get GPS Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PROMINENT WHATSAPP CTA SECTION */}
      <section id="whatsapp-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>24/7 WHATSAPP HINDI CHATBOT & STORE DESK</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold">
                <span>🇮🇳 हिंदी भाषा सहायता उपलब्ध</span>
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              जूते चुनने में मदद चाहिए? <br />
              <span className="text-emerald-400">WhatsApp हिंदी चैटबॉट</span> से तुरंत पूछें!
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              हमारे 24/7 स्मार्ट WhatsApp चैटबॉट या प्रोप्राइटर <strong className="text-white font-bold">{settings.ownerName || 'Md. MARUF'}</strong> से सीधे हिंदी या English में बात करें। साइज, मॉडल, फोटो और होम डिलीवरी की पूरी जानकारी तुरंत पाएँ।
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => openGeneralWhatsAppChat(`नमस्ते मोहम्मद मारुफ़ जी (Unique Style Footwear), मुझे जूतों के डिजाइन और साइज के बारे में जानकारी चाहिए।`)}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xl shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>WhatsApp चैट शुरू करें (हिंदी / EN)</span>
              </button>

              <a
                href={`tel:+91${(settings.phoneNumber || settings.whatsappNumber || '9709057763').replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-2 text-xs font-mono text-emerald-300 bg-slate-800/80 px-4 py-3.5 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Owner: <strong className="text-white">{settings.ownerName || 'Md. MARUF'}</strong> (+91 {settings.whatsappNumber || '9709057763'})</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
