import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAdmin } from '../context/AdminContext';
import { GENDER_CATEGORY_TABS } from '../data/categoryNavigationData';
import { Logo } from './Logo';
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Phone,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  LayoutGrid,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedCategorySlug,
    setSelectedCategorySlug,
    selectedBrandSlug,
    setSelectedBrandSlug,
    searchQuery,
    setSearchQuery,
    cartCount,
    wishlist,
    setIsCartDrawerOpen,
    isCategoryDrawerOpen,
    setIsCategoryDrawerOpen,
    settings,
    openGeneralWhatsAppChat,
    categories,
    brands,
  } = useStore();

  const { isAdminLoggedIn } = useAdmin();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const handleNavClick = (view: string, catSlug?: string, brandSlug?: string) => {
    setCurrentView(view);
    if (catSlug !== undefined) setSelectedCategorySlug(catSlug);
    if (brandSlug !== undefined) setSelectedBrandSlug(brandSlug);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setCurrentView('shop');
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Welcome & Announcement Bar */}
      {settings.showAnnouncement && (
        <div id="header-top-welcome-bar" className="bg-[#b91c1c] text-white text-xs py-1.5 px-4 border-b border-red-800 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase text-[10px] sm:text-[11px] tracking-wider shadow-xs">
                <Sparkles className="w-3 h-3 text-slate-950 shrink-0" />
                WELCOME TO UNIQUE STYLE FOOTWEAR
              </span>
              <span className="hidden sm:inline text-red-100 font-medium text-[11px]">
                {settings.announcementText || '• Kokdoro Chowk, Pithoria, Kanke • Free Delivery in Ranchi above ₹999!'}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-red-100 font-medium">
              <span className="flex items-center gap-1 text-white text-[11px]">
                <strong className="text-amber-300">Owner:</strong> {settings.ownerName || 'Md. MARUF'}
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <MapPin className="w-3 h-3 text-amber-300" />
                {settings.address || 'Kokdoro Chowk, Pithoria, Kanke'}
              </span>
              <button
                onClick={() => openGeneralWhatsAppChat()}
                className="flex items-center gap-1 text-white hover:text-amber-200 transition-colors font-mono font-bold text-[11px]"
              >
                <MessageCircle className="w-3 h-3 text-amber-300" />
                +91 {settings.whatsappNumber || '9709057763'}
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1 text-red-200 hover:text-white transition-colors"
                title="Admin Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* 3-Line Sidebar Menu Button & Logo Group */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 3-Line Category Sidebar Button (Khadim's Signature Crimson Red) */}
            <button
              id="header-sidebar-3line-btn"
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-md shadow-red-600/25 transition-transform active:scale-95 border border-red-500/50 group"
              title="Open Categories Sidebar (☰)"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 group-hover:rotate-90 transition-transform" />
              <span className="font-bold">Categories</span>
            </button>

            {/* Logo */}
            <Logo
              size="md"
              onClick={() => {
                setSelectedCategorySlug(null);
                setSelectedBrandSlug(null);
                setSearchQuery('');
                handleNavClick('home');
              }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-home-btn"
              onClick={() => {
                setSelectedCategorySlug(null);
                setSelectedBrandSlug(null);
                setSearchQuery('');
                handleNavClick('home');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                currentView === 'home'
                  ? 'text-red-700 bg-red-50 font-black border border-red-200 shadow-2xs'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              Home
            </button>
            <button
              id="nav-shop-btn"
              onClick={() => {
                setSelectedCategorySlug(null);
                setSelectedBrandSlug(null);
                handleNavClick('shop');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                currentView === 'shop' && !selectedCategorySlug && !selectedBrandSlug
                  ? 'text-red-700 bg-red-50 font-black border border-red-200 shadow-2xs'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              Shop All
            </button>
            <button
              id="nav-select-category-btn"
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-red-700 bg-red-50 hover:bg-red-100 transition-all border border-red-200 shadow-2xs"
            >
              <Menu className="w-3.5 h-3.5 text-red-600" />
              <span>☰ Categories</span>
            </button>
            <button
              id="nav-brands-btn"
              onClick={() => handleNavClick('brands')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                currentView === 'brands'
                  ? 'text-red-700 bg-red-50 font-black border border-red-200 shadow-2xs'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              Brands
            </button>
            <button
              id="nav-offers-btn"
              onClick={() => handleNavClick('offers')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                currentView === 'offers'
                  ? 'text-red-700 bg-red-50 font-black border border-red-200 shadow-2xs'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              Offers
            </button>
            <button
              id="nav-contact-btn"
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                currentView === 'contact'
                  ? 'text-red-700 bg-red-50 font-black border border-red-200 shadow-2xs'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                id="desktop-search-input"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search shoes, sandals, slippers, brands..."
                className="w-full pl-9 pr-8 py-2 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs font-medium text-slate-900 placeholder-slate-400 rounded-full border border-slate-200 focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery('');
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Mobile Search Toggle Button */}
            <button
              id="mobile-search-toggle"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full md:hidden transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={() => handleNavClick('wishlist')}
              className="relative p-2 text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  wishlist.length > 0 ? 'text-red-600 fill-red-600' : ''
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-sm shadow-red-600/20 active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* WhatsApp Direct Connect (Desktop) */}
            <button
              id="header-whatsapp-btn"
              onClick={() => openGeneralWhatsAppChat()}
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold tracking-wide transition-all shadow-sm hover:shadow-emerald-600/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </button>

            {/* Mobile Menu 3-Line Hamburger Button - Direct Category Sidebar */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-xl lg:hidden transition-colors flex items-center gap-1 shadow-xs"
              aria-label="Open 3-Line Categories Menu"
              title="Categories (☰)"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Mobile Search Form (Slide Down) */}
        {isSearchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-slate-100">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="mobile-search-bar"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search brands, styles, sizes..."
                autoFocus
                className="w-full pl-10 pr-9 py-2.5 bg-slate-100 text-xs font-medium text-slate-900 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-2.5 py-1 bg-red-600 text-white text-xs font-black rounded-lg"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden fixed inset-0 top-[65px] bg-black/50 z-50 backdrop-blur-xs flex flex-col justify-between"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-white w-full max-h-[85vh] overflow-y-auto shadow-2xl p-5 border-b border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Welcome To Unique Style Footwear Badge */}
            <div className="p-3 mb-3 bg-red-50 rounded-2xl border border-red-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-red-950">
                  WELCOME TO UNIQUE STYLE FOOTWEAR
                </p>
                <p className="text-[10px] text-slate-600 font-medium">
                  Kokdoro Chowk, Pithoria, Kanke
                </p>
              </div>
            </div>

            {/* Quick WhatsApp Header */}
            <div className="flex items-center justify-between p-3 mb-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950">WhatsApp Order Desk (Owner: {settings.ownerName || 'Md. MARUF'})</p>
                  <p className="text-[11px] text-emerald-700 font-mono font-bold">+91 {settings.whatsappNumber || '9709057763'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  openGeneralWhatsAppChat();
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg"
              >
                Chat Now
              </button>
            </div>

            {/* Menu Links */}
            <div className="space-y-1">
              {/* Category Drawer Trigger Banner */}
              <button
                onClick={() => {
                  setIsCategoryDrawerOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-left font-bold text-sm bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-md mb-2 border border-red-600/50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Select Category</p>
                    <p className="text-[10px] text-red-100 font-normal">Men • Women • Boys • Girls</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setSelectedBrandSlug(null);
                  handleNavClick('home');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-medium text-sm ${
                  currentView === 'home'
                    ? 'bg-red-50 text-red-900 font-bold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>🏠 Home</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setSelectedBrandSlug(null);
                  handleNavClick('shop');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-medium text-sm ${
                  currentView === 'shop'
                    ? 'bg-red-50 text-red-900 font-bold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>👟 Shop All Footwear</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavClick('categories')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-medium text-sm ${
                  currentView === 'categories'
                    ? 'bg-red-50 text-red-900 font-bold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>📂 Categories</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavClick('brands')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-medium text-sm ${
                  currentView === 'brands'
                    ? 'bg-red-50 text-red-900 font-bold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>🏷️ Footwear Brands</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavClick('offers')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-medium text-sm ${
                  currentView === 'offers'
                    ? 'bg-red-50 text-red-900 font-bold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>🎁 Special Offers & Discounts</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-medium text-sm ${
                  currentView === 'contact'
                    ? 'bg-red-50 text-red-900 font-bold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>📍 Store Location & Contact</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Footwear Categories by Audience (Men, Women, Boys, Girls) */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Shop Footwear By Category
                </p>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCategoryDrawerOpen(true);
                  }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  View All (☰)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {GENDER_CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsCategoryDrawerOpen(true);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-400 border border-slate-200/80 text-left transition-colors"
                  >
                    <img
                      src={tab.avatarImage}
                      alt={tab.title}
                      referrerPolicy="no-referrer"
                      className="w-8 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-slate-900 truncate">
                        {tab.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {tab.items.length} Styles
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Portal Link */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Unique Style Footwear, Kokdoro Chowk</span>
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1 font-semibold text-amber-600 hover:underline"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export const MobileBottomBar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    setIsCartDrawerOpen,
    setIsCategoryDrawerOpen,
    openGeneralWhatsAppChat,
  } = useStore();

  return (
    <div
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg"
    >
      <div className="grid grid-cols-5 gap-1 items-center">
        <button
          id="mobile-bottom-home-btn"
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 rounded-lg text-[10px] font-semibold transition-colors ${
            currentView === 'home' ? 'text-red-600 font-bold' : 'text-slate-600'
          }`}
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>

        {/* 3-Line Category Button */}
        <button
          id="mobile-bottom-category-btn"
          onClick={() => setIsCategoryDrawerOpen(true)}
          className="flex flex-col items-center py-1 rounded-lg text-[10px] font-bold text-red-900 active:scale-95 transition-transform"
        >
          <div className="w-7 h-5 rounded-md bg-red-100 flex items-center justify-center text-red-700 border border-red-200">
            <Menu className="w-3.5 h-3.5" />
          </div>
          <span>Categories</span>
        </button>

        <button
          id="mobile-bottom-shop-btn"
          onClick={() => {
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 rounded-lg text-[10px] font-semibold transition-colors ${
            currentView === 'shop' ? 'text-red-600 font-bold' : 'text-slate-600'
          }`}
        >
          <span className="text-base">👟</span>
          <span>Shop</span>
        </button>

        <button
          id="mobile-bottom-cart-btn"
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center py-1 rounded-lg text-[10px] font-semibold text-slate-600"
        >
          <span className="text-base">🛒</span>
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        <button
          id="mobile-bottom-whatsapp-btn"
          onClick={() => openGeneralWhatsAppChat()}
          className="flex flex-col items-center py-1 rounded-lg text-[10px] font-bold text-emerald-600"
        >
          <span className="text-base">💬</span>
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
