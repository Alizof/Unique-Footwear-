import React, { useState, useEffect } from 'react';
import { Product, ProductReview } from '../types';
import { useStore } from '../context/StoreContext';
import { api } from '../lib/api';
import {
  X,
  Heart,
  ShoppingBag,
  Zap,
  MessageCircle,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Ruler,
  ChevronRight,
  Send,
  Sparkles,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    setIsCheckoutOpen,
    setIsSizeGuideOpen,
    generateWhatsAppProductEnquiry,
    generateWhatsAppProductEnquiryHindi,
    openGeneralWhatsAppChat,
    addToast,
    settings,
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIdx(0);
      setSelectedSize(
        selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0
          ? selectedProduct.availableSizes[0]
          : 'Standard'
      );
      setSelectedColor(
        selectedProduct.availableColors && selectedProduct.availableColors.length > 0
          ? selectedProduct.availableColors[0]
          : 'Standard'
      );
      setQuantity(1);

      // Load reviews
      api.getReviews(selectedProduct.id)
        .then((data) => setReviews(data))
        .catch(() => setReviews([]));
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const isFavorite = isInWishlist(selectedProduct.id);
  const images = selectedProduct.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'];

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppEnquiry = (isHindi: boolean = false) => {
    const msg = isHindi
      ? generateWhatsAppProductEnquiryHindi(selectedProduct, selectedSize)
      : generateWhatsAppProductEnquiry(selectedProduct, selectedSize);
    openGeneralWhatsAppChat(msg);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      addToast('Please provide your name and review message', 'error');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const created = await api.addReview(selectedProduct.id, {
        customerName: newReviewName.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
      });
      setReviews([created, ...reviews]);
      setNewReviewName('');
      setNewReviewComment('');
      setShowReviewForm(false);
      addToast('Thank you! Your verified review has been posted.', 'success');
    } catch (err) {
      addToast('Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={() => setSelectedProduct(null)}
    >
      <div
        id="product-detail-card"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Column: Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={images[activeImageIdx]}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {selectedProduct.discountPercentage > 0 && (
                    <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
                      {selectedProduct.discountPercentage}% OFF
                    </span>
                  )}
                  {selectedProduct.isBestSeller && (
                    <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
                      Best Seller
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                    isFavorite
                      ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
                      : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIdx === idx
                          ? 'border-amber-500 ring-2 ring-amber-500/20'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Delivery & Trust Highlights */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Prompt Local Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>7-Day Size Exchange</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Quality Assured</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp Order Desk</span>
                </div>
              </div>
            </div>

            {/* Right Column: Details & Ordering */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                {/* Brand & Model */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-md">
                    {selectedProduct.brand}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Model: {selectedProduct.model}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-slate-950 mt-2 leading-tight">
                  {selectedProduct.name}
                </h1>

                {/* SKU and Rating */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedProduct.rating || '4.8'}</span>
                    <span className="text-slate-500 font-normal">({reviews.length || selectedProduct.reviewCount || 12} reviews)</span>
                  </div>
                  <span className="text-slate-400">SKU: <strong className="font-mono text-slate-600">{selectedProduct.sku}</strong></span>
                  <span className={`font-semibold px-2 py-0.5 rounded-md ${
                    selectedProduct.stockQuantity > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {selectedProduct.stockQuantity > 0 ? `In Stock (${selectedProduct.stockQuantity} pairs)` : 'Out of Stock'}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950">
                    {formatPrice(selectedProduct.salePrice)}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.salePrice && (
                    <span className="text-sm sm:text-base text-slate-400 line-through">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                  {selectedProduct.discountPercentage > 0 && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      Save {formatPrice(selectedProduct.originalPrice - selectedProduct.salePrice)} ({selectedProduct.discountPercentage}%)
                    </span>
                  )}
                </div>

                {/* Size Selection */}
                {selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Select Footwear Size (India / UK):
                      </label>
                      <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 underline underline-offset-2"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                            selectedSize === size
                              ? 'bg-slate-900 text-white ring-2 ring-amber-500 shadow-sm'
                              : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {selectedProduct.availableColors && selectedProduct.availableColors.length > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                      Available Color: <span className="text-amber-700 font-medium normal-case">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            selectedColor === color
                              ? 'bg-amber-100 text-amber-900 border border-amber-400 font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper */}
                <div className="mt-4 flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-slate-700 hover:bg-slate-200 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stockQuantity || 10, quantity + 1))}
                      className="px-3 py-1 text-slate-700 hover:bg-slate-200 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4 text-red-400" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all active:scale-98"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* WhatsApp Enquiry Options (Hindi + English) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleWhatsAppEnquiry(true)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
                    title="हिंदी में WhatsApp पर पूछें (Owner: Md. MARUF)"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>🇮🇳 WhatsApp पूछताछ (हिंदी)</span>
                  </button>

                  <button
                    onClick={() => handleWhatsAppEnquiry(false)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-slate-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98 border border-slate-700"
                    title="Enquire on WhatsApp in English"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enquire in English</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Description, Specifications, Reviews */}
          <div className="mt-10 pt-8 border-t border-slate-200 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 mb-2">
                Product Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Specifications */}
            {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 mb-3">
                  Footwear Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="font-semibold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950">
                    Customer Reviews ({reviews.length})
                  </h3>
                  <p className="text-xs text-slate-500">Real feedback from local Kokdoro & Kanke shoppers</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-colors"
                >
                  {showReviewForm ? 'Cancel' : '✍️ Write a Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 space-y-3 animate-in fade-in duration-200"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Submit Your Review
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Your Name / Location</label>
                      <input
                        type="text"
                        required
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        placeholder="e.g. Ramesh Sahu (Pithoria)"
                        className="w-full px-3 py-2 bg-white text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Rating</label>
                      <div className="flex items-center gap-1 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Review & Footwear Experience</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Tell us about the comfort, sizing fit, durability, and styling..."
                      className="w-full px-3 py-2 bg-white text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingReview ? 'Posting...' : 'Post Verified Review'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    No reviews yet. Be the first to review this footwear!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {rev.customerName}
                          </span>
                          {rev.verifiedPurchase && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-sm flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {rev.date}
                        </span>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3 h-3 ${
                              idx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
