import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../lib/api';
import { Order } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  MessageCircle,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  MapPin,
  ArrowLeft,
  Download,
  Printer,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    formatPrice,
    sendWhatsAppOrder,
    generateWhatsAppOrderMessage,
    addToast,
    settings,
  } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    whatsappNumber: '',
    address: '',
    locality: 'Kokdoro Chowk',
    city: 'Pithoria, Kanke',
    state: 'Jharkhand',
    pincode: '834006',
    note: '',
    paymentMethod: 'COD' as 'COD' | 'WhatsApp_Payment' | 'UPI_On_Delivery',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Auto-mirror mobile to whatsapp if whatsapp not explicitly changed
      ...(name === 'mobileNumber' && !prev.whatsappNumber ? { whatsappNumber: value } : {}),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent, isWhatsAppDirect: boolean = true) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 10) {
      addToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!formData.address.trim()) {
      addToast('Please enter your complete delivery address', 'error');
      return;
    }
    if (cart.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        model: item.product.model,
        image: (item.product.images && item.product.images[0]) || '',
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        unitPrice: item.product.salePrice,
        totalPrice: item.product.salePrice * item.quantity,
      }));

      const newOrder = await api.createOrder({
        customerName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        whatsappNumber: (formData.whatsappNumber || formData.mobileNumber).trim(),
        address: formData.address.trim(),
        locality: formData.locality.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        note: formData.note.trim(),
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryCharge: deliveryFee,
        discount: 0,
        totalAmount: cartTotal,
        paymentMethod: formData.paymentMethod,
        source: isWhatsAppDirect ? 'whatsapp' : 'website',
      });

      setCreatedOrder(newOrder);
      clearCart();

      // Trigger Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore confetti failures
      }

      addToast(`Order ${newOrder.orderNumber} placed successfully!`, 'success');

      if (isWhatsAppDirect) {
        sendWhatsAppOrder(newOrder);
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      addToast(error.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCreatedOrder(null);
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="checkout-modal-card"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              👟
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {createdOrder ? 'Order Confirmation' : 'Complete Your Footwear Order'}
              </h3>
              <p className="text-xs text-slate-500">
                {createdOrder
                  ? `Order ID: ${createdOrder.orderNumber}`
                  : 'Fast delivery across Kokdoro Chowk, Pithoria & Kanke'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Success State */}
        {createdOrder ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-950">
                Thank You, {createdOrder.customerName}!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Your order <strong className="font-mono text-slate-900">{createdOrder.orderNumber}</strong> has been registered with Unique Style Footwear.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900">
                <span>Items ({createdOrder.items.length})</span>
                <span>Total: {formatPrice(createdOrder.totalAmount)}</span>
              </div>

              <div className="space-y-2">
                {createdOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900">{item.productName}</span>
                      <p className="text-[11px] text-slate-500">
                        Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 text-slate-600">
                <p>
                  <strong>Delivery to:</strong> {createdOrder.address}, {createdOrder.locality}, {createdOrder.city} - {createdOrder.pincode}
                </p>
                <p className="mt-0.5">
                  <strong>Contact:</strong> {createdOrder.mobileNumber} (WhatsApp: {createdOrder.whatsappNumber})
                </p>
              </div>
            </div>

            {/* WhatsApp Resend & Action Buttons */}
            <div className="space-y-2.5 max-w-md mx-auto">
              <button
                onClick={() => sendWhatsAppOrder(createdOrder)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Open Order Details in WhatsApp</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={(e) => handleFormSubmit(e, true)} className="p-4 sm:p-6 space-y-5">
            {/* Customer Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                1. Delivery & Contact Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">
                    Calling Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    required
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="WhatsApp number for order updates"
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">
                    Locality / Landmark
                  </label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    placeholder="e.g. Near Kali Mandir, Kokdoro Chowk"
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-700 font-medium block mb-1">
                    Complete House / Street Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House number, building name, street, nearby shop/landmark..."
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">City / Area</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Pithoria, Kanke, Ranchi"
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="834006"
                      className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-700 font-medium block mb-1">
                    Special Instructions / Order Note (Optional)
                  </label>
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="e.g. Call before coming, deliver after 2 PM"
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-600" />
                2. Payment Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD'
                      ? 'bg-amber-50/80 border-amber-500 text-amber-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleInputChange}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>💵 Cash on Delivery (Pay upon receipt)</span>
                </label>

                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'WhatsApp_Payment'
                      ? 'bg-amber-50/80 border-amber-500 text-amber-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="WhatsApp_Payment"
                    checked={formData.paymentMethod === 'WhatsApp_Payment'}
                    onChange={handleInputChange}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>📱 UPI on Delivery (GPay / PhonePe / Paytm)</span>
                </label>
              </div>
            </div>

            {/* Order Summary Breakdown */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                Order Summary ({cart.length} footwear items)
              </h4>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-slate-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-amber-700 text-base">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: WhatsApp Order (Primary) & Web Direct */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-98 disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{isSubmitting ? 'Placing Order...' : 'Place Order on WhatsApp'}</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={(e) => handleFormSubmit(e as any, false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                Place Order (Direct Confirmation)
              </button>

              <div className="text-center text-[11px] text-slate-500">
                Official store desk (Owner: {settings.ownerName || 'Md. MARUF'}): <strong className="text-slate-800 font-mono">+91 {settings.whatsappNumber || '9709057763'}</strong> (Kokdoro Chowk, Pithoria, Kanke)
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
