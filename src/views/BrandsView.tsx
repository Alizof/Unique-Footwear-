import React from 'react';
import { useStore } from '../context/StoreContext';
import { Award, ArrowRight, ShieldCheck } from 'lucide-react';

export const BrandsView: React.FC = () => {
  const { brands, products, setSelectedBrandSlug, setCurrentView } = useStore();

  const handleBrandSelect = (slug: string) => {
    setSelectedBrandSlug(slug);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="brands-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center justify-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          <span>Authorized & Premium Brands</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          Featured Footwear Brands
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Shop authentic footwear from industry-leading manufacturers and our exclusive signature line at Kokdoro Chowk.
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.filter((b) => b.isActive).map((brand) => {
          const brandProducts = products.filter(
            (p) => p.brand.toLowerCase() === brand.name.toLowerCase() && p.status === 'active'
          );

          return (
            <div
              key={brand.id}
              onClick={() => handleBrandSelect(brand.slug)}
              className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-amber-500/50 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center mx-auto mb-4 p-2 group-hover:scale-105 transition-transform">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {brand.description || 'Durable & stylish footwear engineered for performance and comfort.'}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {brandProducts.length} Models
                </span>
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Brand Trust Guarantee Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">100% Genuine Brands Guarantee</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              All footwear is directly sourced with manufacturer warranties and certified quality.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedBrandSlug(null);
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shrink-0 transition-colors"
        >
          View Full Store Collection
        </button>
      </div>
    </div>
  );
};
