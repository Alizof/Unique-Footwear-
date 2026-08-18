import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Send,
  Navigation,
  CheckCircle2,
  Car,
  CreditCard,
  Footprints,
  UserCheck,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { settings, addToast, openGeneralWhatsAppChat } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Footwear Sizing & Availability');
  const [message, setMessage] = useState('');

  const ownerName = settings.ownerName || 'Md. MARUF';
  const whatsappNum = settings.whatsappNumber || '9709057763';
  const phoneNum = settings.phoneNumber || '9709057763';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      addToast('Please fill in your name, contact number, and message.', 'error');
      return;
    }

    const encodedMessage = encodeURIComponent(
      `*New Store Enquiry for Owner ${ownerName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Customer Phone:* ${phone}\n` +
      `📌 *Topic:* ${subject}\n` +
      `💬 *Message:*\n${message}\n\n` +
      `📍 Store: UNIQUE STYLE FOOTWEAR, ${settings.address}`
    );

    const cleanNum = whatsappNum.replace(/[^0-9]/g, '');
    const fullNum = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum;
    const whatsappUrl = `https://wa.me/${fullNum}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    addToast('Enquiry forwarded to WhatsApp!', 'success');

    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div id="contact-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Direct Store Contact & Proprietor Info</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          Contact UNIQUE STYLE FOOTWEAR
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Reach out directly to store owner <strong className="text-slate-800 font-bold">{ownerName}</strong> or visit our showroom at Kokdoro Chowk, Pithoria, Kanke.
        </p>
      </div>

      {/* PROMINENT OWNER & CONTACT DETAILS HERO CARD */}
      <div id="owner-contact-details-card" className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Owner Profile & Verified Badge */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-red-400" />
              <span>OFFICIAL STORE PROPRIETOR & MANAGEMENT</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Store Owner & Proprietor</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span>{ownerName}</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                </span>
              </h2>
              <p className="text-sm text-slate-300 font-medium pt-1">
                Proprietor, <span className="text-red-400 font-bold">{settings.brandName}</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Welcome to Unique Style Footwear! Feel free to contact me directly for retail inquiries, size checking, home delivery in Kanke & Ranchi, wholesale footwear orders, or special seasonal discounts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile & WhatsApp</p>
                  <p className="text-sm font-black text-white font-mono">+91 {whatsappNum}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Store Landmark</p>
                  <p className="text-xs font-bold text-white">Kokdoro Chowk, Pithoria, Kanke</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Call & WhatsApp Action Buttons */}
          <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-3.5 text-center sm:text-left">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
              Quick Actions with {ownerName}
            </h3>

            <a
              href={`https://wa.me/91${whatsappNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`नमस्ते मोहम्मद मारुफ़ जी (Unique Style Footwear, कोकदोरो चौक), मुझे जूतों के डिजाइन और साइज के बारे में जानकारी चाहिए।`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>🇮🇳 WhatsApp चैट शुरू करें (हिंदी)</span>
            </a>

            <a
              href={`https://wa.me/91${whatsappNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${ownerName} (Unique Style Footwear), I have an enquiry regarding footwear styles and sizing.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enquire on WhatsApp (English)</span>
            </a>

            <a
              href={`tel:+91${phoneNum.replace(/[^0-9]/g, '')}`}
              className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Direct Phone Call (+91 {phoneNum})</span>
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Unique Style Footwear, Kokdoro Chowk, Pithoria, Kanke')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Navigation className="w-4 h-4 text-red-400" />
              <span>Open GPS Directions on Google Maps</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Store Hours: {settings.businessHours || 'Monday - Sunday: 9:00 AM - 9:00 PM'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Details Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
              Store Information
            </h2>

            {/* Owner Section */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200/60">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store Owner</p>
                <p className="text-sm font-black text-slate-900">{ownerName}</p>
                <p className="text-xs text-slate-500">Sole Proprietor & Store Manager</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200/60">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Physical Store Location</p>
                <p className="text-sm font-black text-slate-900">{settings.brandName}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{settings.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Unique Style Footwear, Kokdoro Chowk, Pithoria, Kanke')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 pt-1"
                >
                  <Navigation className="w-3.5 h-3.5" /> Get GPS Directions
                </a>
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone & WhatsApp</p>
                <p className="text-sm font-black text-slate-900">+91 {whatsappNum}</p>
                <p className="text-xs text-slate-500">Instant assistance & order booking via WhatsApp</p>
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/91${whatsappNum.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                  <a
                    href={`tel:+91${phoneNum.replace(/[^0-9]/g, '')}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store Timings</p>
                <p className="text-sm font-bold text-slate-900">{settings.businessHours || 'Monday - Sunday: 9:00 AM - 9:00 PM'}</p>
                <p className="text-xs text-slate-500">Open 7 days a week including festival holidays</p>
              </div>
            </div>
          </div>

          {/* In-Store Amenities */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-400">In-Store Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Footprints className="w-4 h-4 text-red-400 shrink-0" />
                <span>Comfort Size Trial Lounge</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Car className="w-4 h-4 text-red-400 shrink-0" />
                <span>Convenient Roadside Parking</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CreditCard className="w-4 h-4 text-red-400 shrink-0" />
                <span>UPI, Cards & Cash Accepted</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                <span>7-Day Easy Size Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Form & Interactive Map Preview */}
        <div className="lg:col-span-7 space-y-6">
          {/* Enquiry Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Send an Instant Message to {ownerName}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Have a question regarding shoe sizes, bulk family orders, or custom models? Fill out the details below to message us directly.
              </p>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-xs text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-xs text-slate-900 placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-xs text-slate-900 bg-white"
                >
                  <option value="Product Sizing & Availability">Product Sizing & Availability</option>
                  <option value="Store Visit & Location Enquiry">Store Visit & Location Enquiry</option>
                  <option value="Bulk & Family Order Discount">Bulk & Family Order Discount</option>
                  <option value="Size Exchange or Return Request">Size Exchange or Return Request</option>
                  <option value="Other Feedback">Other Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about shoe size, color availability, home delivery, or specific footwear models..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-xs text-slate-900 placeholder:text-slate-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to {ownerName} on WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Map Location Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Map & Route</h3>
                <p className="text-xs text-slate-500">Kokdoro Chowk, Main Pithoria-Kanke Road</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Unique Style Footwear, Kokdoro Chowk, Pithoria, Kanke')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-red-400" /> Open in Google Maps
              </a>
            </div>

            <div className="w-full h-52 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative flex items-center justify-center">
              <div className="text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-900">{settings.brandName}</h4>
                <p className="text-xs font-bold text-red-700">Owner: {ownerName}</p>
                <p className="text-xs text-slate-600 max-w-sm">
                  Kokdoro Chowk, Pithoria, Kanke, Ranchi District, Jharkhand
                </p>
                <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Phone / WhatsApp: +91 {whatsappNum}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
