import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RefreshCw, FileText, Lock, HelpCircle, ChevronDown } from 'lucide-react';

export const PoliciesView: React.FC = () => {
  const { settings } = useStore();
  const [activeTab, setActiveTab] = useState<'returns' | 'shipping' | 'privacy' | 'terms' | 'faq'>('returns');

  const ownerName = settings.ownerName || 'Md. MARUF';
  const whatsappNumber = settings.whatsappNumber || '9709057763';

  const faqs = [
    {
      q: 'How do I place an order via WhatsApp?',
      a: `Simply select your shoe model, pick your size and favorite color, and click "Order via WhatsApp". The complete order summary will be prepared instantly and sent to our WhatsApp at ${whatsappNumber}. You can also use our quick online checkout for Cash on Delivery.`
    },
    {
      q: 'What if the shoe size does not fit me properly?',
      a: 'We offer a hassle-free 7-Day Size Exchange policy. Keep the footwear unused with original tags and box, and visit our Kokdoro Chowk store or notify us on WhatsApp for an immediate size replacement.'
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes! Cash on Delivery and UPI on Delivery (PhonePe, Google Pay, Paytm) are available on all footwear orders across Pithoria, Kanke, and Ranchi.'
    },
    {
      q: 'How can I check in-store stock before visiting?',
      a: `You can browse our live online catalogue here or send a quick WhatsApp message to ${whatsappNumber} asking for size availability. Proprietor ${ownerName} and store staff respond quickly with live photos and sizes.`
    },
    {
      q: 'Are all footwear models genuine and durable?',
      a: 'Yes, 100%. We only stock authentic, quality-tested footwear with durable soles, breathable uppers, and long-lasting stitching backed by genuine manufacturer standards.'
    }
  ];

  return (
    <div id="policies-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Customer First Policies</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          Store Policies & Help Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Clear, transparent policies for a seamless shopping experience at {settings.brandName}.
        </p>
      </div>

      {/* Policy Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-3xl mx-auto">
        <button
          onClick={() => setActiveTab('returns')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'returns'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 text-red-600" />
          <span>Returns & Exchange</span>
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'shipping'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-red-600" />
          <span>Shipping & Delivery</span>
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'faq'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-red-600" />
          <span>Help & FAQ</span>
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'terms'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-red-600" />
          <span>Terms of Service</span>
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'privacy'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-red-600" />
          <span>Privacy Policy</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs leading-relaxed text-slate-700 text-sm space-y-6">
        {activeTab === 'returns' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-red-600" />
              7-Day Size Exchange & Return Policy
            </h2>
            <p>
              At <strong>{settings.brandName}</strong>, customer satisfaction is our top priority. We understand that finding the perfect shoe fit is essential for foot health and daily comfort.
            </p>
            <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-4 text-xs text-red-900 space-y-1">
              <p className="font-bold">Guidelines for Easy Exchange:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>Exchange request must be initiated within 7 days from the delivery or purchase date.</li>
                <li>The footwear must be brand new, unworn outdoors, with original tags and brand box intact.</li>
                <li>You can exchange for another size, different color, or any equivalent priced model in our store.</li>
              </ul>
            </div>
            <h3 className="text-base font-bold text-slate-900 pt-2">How to Request an Exchange:</h3>
            <p>
              Simply contact our WhatsApp customer support at <strong>+91 {whatsappNumber}</strong> with your Order Number and desired size, or visit our store at Kokdoro Chowk, Pithoria, Kanke.
            </p>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-red-600" />
              Shipping & Local Delivery Policy
            </h2>
            <p>
              We provide fast, reliable local delivery across Pithoria, Kanke, Ranchi, and nearby regions, as well as state-wide courier services.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Local Express Delivery (Pithoria & Kanke)</h4>
                <p className="text-xs text-slate-600 mt-1">Same day or next day delivery directly from our Kokdoro Chowk store.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Free Delivery on Orders Above ₹{settings.freeDeliveryThreshold || 999}</h4>
                <p className="text-xs text-slate-600 mt-1">Standard delivery charge of ₹{settings.deliveryCharge || 60} applies on smaller cart orders.</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Orders placed before 4:00 PM are processed the same business day. You receive real-time delivery updates directly on your WhatsApp number.
            </p>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-red-600" />
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all"
                >
                  <summary className="font-bold text-slate-900 text-xs sm:text-sm cursor-pointer list-none flex items-center justify-between gap-2">
                    <span>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200/60 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Terms and Conditions
            </h2>
            <p>
              Welcome to <strong>{settings.brandName}</strong> (Owned & Managed by {ownerName}). By accessing our website, placing an order, or communicating with us via WhatsApp, you agree to comply with our store operational guidelines.
            </p>
            <h3 className="text-sm font-bold text-slate-900">1. Product Pricing & Availability</h3>
            <p className="text-xs text-slate-600">
              All prices are in Indian Rupees (INR) and inclusive of all applicable taxes. Stock availability is maintained in real-time but subject to physical in-store walk-in sales.
            </p>
            <h3 className="text-sm font-bold text-slate-900">2. Order Confirmation</h3>
            <p className="text-xs text-slate-600">
              Orders placed online or via WhatsApp are verified by our team. In the rare event of stock unavailability, our team will promptly suggest alternative sizes or suitable substitutes.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Privacy Policy
            </h2>
            <p>
              Your privacy is extremely important to us. <strong>{settings.brandName}</strong> collects only the necessary personal contact details (such as Name, Phone number, and Delivery Address) strictly for dispatching your footwear and providing WhatsApp order status updates.
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5">
              <li>We do not sell, rent, or share your contact information with any third-party advertisers.</li>
              <li>Your WhatsApp number is used exclusively for order tracking, size confirmations, and store enquiries.</li>
              <li>You can request deletion of your contact history at any time by messaging our support line.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
