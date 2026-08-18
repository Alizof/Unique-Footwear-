import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Tag, Sparkles, Flame, Clock, Percent, ShieldCheck, ShoppingBag } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { products, setCurrentView } = useStore();

  // Filter products with high discount or marked on special sale
  const discountedProducts = products.filter(
    (p) => p.status === 'active' && (p.discountPercentage >= 20 || p.originalPrice > p.salePrice)
  );

  return (
    <div id="offers-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-8 sm:p-12 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
            <span>Festive & Clearance Mega Sale</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Up to 60% OFF on Top Trending Footwear
          </h1>
          <p className="text-sm sm:text-base text-amber-100">
            Exclusive deals on genuine sports sneakers, formal leather shoes, daily comfort sandals, and festive ethnic footwear at Kokdoro Chowk store.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-4 py-2 rounded-xl bg-white text-amber-700 font-extrabold text-xs shadow-sm flex items-center gap-1.5">
              <Percent className="w-4 h-4" /> CODE: UNIQUESTYLE
            </span>
            <span className="text-xs text-amber-100 font-medium">
              Free delivery on orders above ₹999 across Ranchi & Kanke
            </span>
          </div>
        </div>
      </div>

      {/* Special Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950">Limited Period Deals</h4>
            <p className="text-xs text-amber-800/80 mt-1">
              Seasonal stock clearance prices updated weekly. Grab your sizes before they run out!
            </p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200/70 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-orange-950">Combo & Family Discounts</h4>
            <p className="text-xs text-orange-800/80 mt-1">
              Order 2 or more pairs and get an instant extra WhatsApp discount upon checkout confirmation.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Original Guarantee</h4>
            <p className="text-xs text-slate-600 mt-1">
              Every discounted pair is 100% brand new, authentic, with 7-day size exchange warranty.
            </p>
          </div>
        </div>
      </div>

      {/* Sale Products */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-600" />
              All On-Sale Footwear ({discountedProducts.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Top curated value picks sorted by highest discount percentage.
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Browse Full Catalog</span>
          </button>
        </div>

        {discountedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No active clearance items right now</h3>
            <p className="text-xs text-slate-500 mt-1">
              Check back soon or explore our complete regular collection!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
