import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { GENDER_CATEGORY_TABS, SubCategoryItem } from '../data/categoryNavigationData';
import { X } from 'lucide-react';

interface CategorySidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'Men' | 'Women' | 'Boys - Kids' | 'Girls - Kids';
}

export const CategorySidebarDrawer: React.FC<CategorySidebarDrawerProps> = ({
  isOpen,
  onClose,
  defaultTab = 'Men',
}) => {
  const {
    setSelectedCategorySlug,
    setSelectedBrandSlug,
    setSelectedGenderFilter,
    setCurrentView,
  } = useStore();

  const [activeTabId, setActiveTabId] = useState<'Men' | 'Women' | 'Boys - Kids' | 'Girls - Kids'>(defaultTab);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Find current active gender tab
  const currentTab = useMemo(() => {
    return GENDER_CATEGORY_TABS.find((t) => t.id === activeTabId) || GENDER_CATEGORY_TABS[0];
  }, [activeTabId]);

  // Handle clicking a footwear subcategory item
  const handleItemClick = (item: SubCategoryItem) => {
    setSelectedCategorySlug(item.categorySlug || item.slug);
    setSelectedBrandSlug(null);
    if (item.gender) {
      setSelectedGenderFilter(item.gender);
    }
    setCurrentView('shop');
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isOpen) return null;

  return (
    <div
      id="category-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-start justify-start md:justify-center p-0 md:p-6 sm:items-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Category Selection Panel / Modal */}
      <div
        id="category-selection-modal"
        className="relative w-full max-w-[440px] sm:max-w-[480px] h-full sm:h-[90vh] max-h-[850px] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-slate-100 animate-in slide-in-from-left sm:zoom-in-95 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3.5 bg-white border-b border-slate-100 shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Select Category
          </h2>

          <button
            id="close-category-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Modal Content: Left Navigation + Right 2-Column Footwear Grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Vertical Navigation (4 Main Categories: Men, Women, Boys - Kids, Girls - Kids) */}
          <div className="w-[102px] sm:w-[112px] bg-[#f8f9fa] border-r border-slate-100 overflow-y-auto py-2.5 flex flex-col shrink-0 select-none">
            {GENDER_CATEGORY_TABS.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`main-cat-tab-${tab.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group relative w-full flex flex-col items-center pt-2 pb-2.5 px-2 transition-colors duration-150 text-center ${
                    isActive
                      ? 'bg-red-50 border-r-[3px] border-red-600'
                      : 'hover:bg-slate-200/50'
                  }`}
                >
                  {/* Photo Container with Pill Badge */}
                  <div className="relative w-[68px] h-[82px] sm:w-[74px] sm:h-[88px] rounded-xl overflow-hidden shadow-2xs bg-slate-200">
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
                    {/* Dark pill at bottom of photo with text (e.g. MEN, WOMEN, BOY, GIRL) */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-3 pb-1 flex items-center justify-center">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white">
                        {tab.badgeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Text Label Below Photo */}
                  <span
                    className={`mt-1.5 text-xs font-bold leading-tight tracking-tight ${
                      isActive ? 'text-red-700' : 'text-slate-800'
                    }`}
                  >
                    {tab.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Content Area (Footwear Title + 2-Column Grid) */}
          <div className="flex-1 bg-white overflow-y-auto px-4 sm:px-6 py-4">
            {/* Section Header */}
            <div className="mb-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Footwear
              </h3>
            </div>

            {/* 2-Column Footwear Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 pb-6">
              {currentTab.items.map((item) => (
                <div
                  key={item.id}
                  id={`footwear-item-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  className="group flex flex-col items-center text-center cursor-pointer select-none"
                >
                  {/* Light Gray Circular Background Container with Centered Shoe Image */}
                  <div className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] rounded-full bg-[#f4f5f7] flex items-center justify-center p-2.5 transition-transform duration-200 group-hover:scale-105 group-hover:bg-red-50 active:scale-95 border border-transparent group-hover:border-red-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xs"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  {/* Category Name Label Below Image */}
                  <span className="mt-2 text-xs sm:text-[13px] font-medium text-slate-900 group-hover:text-red-600 transition-colors leading-snug max-w-[100px]">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
