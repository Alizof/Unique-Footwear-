import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { GENDER_CATEGORY_TABS, SubCategoryItem } from '../data/categoryNavigationData';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Truck, ArrowUpRight } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { categories, products, setSelectedCategorySlug, setSelectedBrandSlug, setSelectedGenderFilter, setCurrentView } = useStore();
  const [activeTabId, setActiveTabId] = useState<'Men' | 'Women' | 'Boys - Kids' | 'Girls - Kids'>('Men');

  const currentTab = GENDER_CATEGORY_TABS.find((t) => t.id === activeTabId) || GENDER_CATEGORY_TABS[0];

  const handleSubCategoryClick = (item: SubCategoryItem) => {
    setSelectedCategorySlug(item.categorySlug || item.slug);
    setSelectedBrandSlug(null);
    if (item.gender) {
      setSelectedGenderFilter(item.gender);
    }
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setSelectedBrandSlug(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="categories-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Interactive Category Explorer</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Select Footwear Category
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Browse by gender and shoe type with verified original brands, real store photos, and best local prices at Unique Style Footwear.
        </p>
      </div>

      {/* Main 2-Column Category Selector Component (Matching User's Reference Screenshots) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top bar header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
            <h2 className="text-base sm:text-lg font-black tracking-tight">
              Footwear Category Navigation
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-300 hidden sm:inline">
            Click on any item to view instant products & prices
          </span>
        </div>

        {/* 2-Column Body */}
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left Vertical Sidebar / Audience Tabs */}
          <div className="w-full md:w-48 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-3 md:p-4 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto shrink-0 select-none">
            {GENDER_CATEGORY_TABS.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`cat-view-tab-${tab.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group relative flex md:flex-col items-center gap-3 md:gap-2 p-2.5 sm:p-3 rounded-2xl transition-all duration-200 text-left md:text-center shrink-0 min-w-[130px] md:min-w-0 ${
                    isActive
                      ? 'bg-white shadow-md ring-2 ring-amber-500/80 text-amber-950 font-bold'
                      : 'hover:bg-slate-200/70 text-slate-700 font-medium'
                  }`}
                >
                  {/* Photo Container with Gender Badge */}
                  <div
                    className={`relative w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden shadow-xs border transition-transform duration-200 group-hover:scale-102 shrink-0 ${
                      isActive
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-200'
                    }`}
                  >
                    <img
                      src={tab.avatarImage}
                      alt={tab.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end justify-center pb-1">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white px-1.5 py-0.5 rounded-sm bg-slate-900/70 backdrop-blur-2xs">
                        {tab.badgeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="flex-1 md:w-full">
                    <span className="block text-xs sm:text-sm font-bold tracking-tight leading-snug">
                      {tab.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal hidden md:block">
                      {tab.items.length} Shoe Types
                    </span>
                  </div>

                  {/* Active Indicator Bar on right on desktop */}
                  {isActive && (
                    <span className="hidden md:block absolute -right-3.5 top-3 bottom-3 w-1.5 bg-amber-500 rounded-l-full shadow-xs"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Footwear Category Grid */}
          <div className="flex-1 p-5 sm:p-8 space-y-6 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>Footwear for {currentTab.title}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing all specialized styles, sports, formals, and comfort collections
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setSelectedBrandSlug(null);
                  setCurrentView('shop');
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full"
              >
                <span>View Full Shop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Circular Item Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8 pt-2">
              {currentTab.items.map((item) => {
                const count = products.filter(
                  (p) =>
                    p.status === 'active' &&
                    (p.category === item.categorySlug || p.subcategory === item.name)
                ).length;

                return (
                  <div
                    key={item.id}
                    id={`cat-explorer-item-${item.id}`}
                    onClick={() => handleSubCategoryClick(item)}
                    className="group flex flex-col items-center text-center cursor-pointer select-none p-2 rounded-2xl hover:bg-slate-50/80 transition-all duration-200"
                  >
                    {/* Circle Image Wrapper */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-50 border-2 border-slate-200/90 group-hover:border-amber-500 p-3 flex items-center justify-center shadow-xs group-hover:shadow-lg group-hover:scale-105 group-hover:bg-white transition-all duration-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover:rotate-3 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-xs">
                          {count}
                        </span>
                      )}
                    </div>

                    {/* Item Name Label */}
                    <span className="mt-3 text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                      {item.name}
                    </span>

                    {/* Brand Suggestion Tag */}
                    {item.brandSuggestion && (
                      <span className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-1 bg-slate-100 group-hover:bg-amber-100/70 group-hover:text-amber-900 px-2 py-0.5 rounded-md transition-colors">
                        {item.brandSuggestion}
                      </span>
                    )}

                    <span className="text-[11px] text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex items-center gap-0.5">
                      <span>Shop Now</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quality assurance footer */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">100% Original Brand Footwear</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">Quality Checked & Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium">Free Local Delivery Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standard Full Categories Grid Section */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              All Footwear Collections
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse complete categories catalog
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.filter((c) => c.isActive).map((category) => {
            const count = products.filter((p) => p.category === category.slug).length;

            return (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category.slug)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-amber-500/50 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {count} Products
                  </div>
                </div>

                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-950 group-hover:text-amber-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {category.description || 'Premium comfort and durability'}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-700 flex items-center justify-center transition-all shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
