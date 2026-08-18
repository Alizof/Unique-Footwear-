import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star, MessageCircle, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    setSelectedProduct,
    setIsCheckoutOpen,
    sendWhatsAppOrder,
    openGeneralWhatsAppChat,
    generateWhatsAppProductEnquiry,
  } = useStore();

  const isFavorite = isInWishlist(product.id);
  const primaryImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';

  const defaultSize = product.availableSizes && product.availableSizes.length > 0
    ? product.availableSizes[0]
    : 'Standard';

  const defaultColor = product.availableColors && product.availableColors.length > 0
    ? product.availableColors[0]
    : 'Standard';

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, defaultSize, defaultColor, 1);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = generateWhatsAppProductEnquiry(product, defaultSize);
    openGeneralWhatsAppChat(msg);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-950 shadow-xs hover:shadow-2xl hover:shadow-slate-950/10 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100/80 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discountPercentage > 0 && (
            <span className="bg-red-600 text-white font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm shadow-red-600/30">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-slate-950 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm border border-slate-800">
              Best Seller
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            isFavorite
              ? 'bg-red-50 text-red-600 border border-red-300 scale-105'
              : 'bg-white/90 text-slate-600 hover:text-red-600 hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
        </button>

        {/* Quick View Hover Action (Desktop) */}
        <div className="hidden sm:flex absolute inset-x-2 bottom-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex-1 py-1.5 bg-slate-950/95 hover:bg-red-600 text-white rounded-xl text-xs font-bold backdrop-blur-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-95 border border-slate-800 hover:border-red-600"
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            Quick View
          </button>
          <button
            onClick={handleWhatsAppEnquiry}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold backdrop-blur-xs flex items-center justify-center shadow-md transition-transform active:scale-95"
            title="Enquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          {/* Brand & Model Row */}
          <div className="flex items-center justify-between gap-1 text-xs mb-1">
            <span className="font-black text-red-700 uppercase tracking-widest text-[11px] truncate">
              {product.brand}
            </span>
            <span className="text-slate-400 font-mono text-[10px] truncate">
              {product.model}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-800 ml-1">
                {product.rating || '4.8'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              ({product.reviewCount || 12})
            </span>
          </div>

          {/* Available Sizes Chips Preview */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="flex items-center gap-1 mt-2 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-0.5">
                Sizes:
              </span>
              {product.availableSizes.slice(0, 4).map((size, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-bold font-mono border border-slate-200/60"
                >
                  {size.replace('UK ', '')}
                </span>
              ))}
              {product.availableSizes.length > 4 && (
                <span className="text-[10px] text-slate-400 font-bold">
                  +{product.availableSizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-base sm:text-lg font-black text-red-700 font-sans tracking-tight">
              {formatPrice(product.salePrice)}
            </span>
            {product.originalPrice > product.salePrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart + Buy Now */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-slate-200/80 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-700 group-hover:text-red-700" />
              <span>Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white active:bg-red-800 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-md shadow-red-600/25 active:scale-95 group/btn"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
