import React from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Instagram,
  Facebook,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setCurrentView, setSelectedCategorySlug, categories, openGeneralWhatsAppChat } = useStore();

  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ownerName = settings.ownerName || 'Md. MARUF';
  const whatsappNumber = settings.whatsappNumber || '9709057763';
  const phoneNumber = settings.phoneNumber || '9709057763';

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast Local Delivery</h4>
              <p className="text-xs text-slate-400">Pithoria, Kanke & Ranchi</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Quality Assured</h4>
              <p className="text-xs text-slate-400">Curated Durable Footwear</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Easy 7-Day Exchange</h4>
              <p className="text-xs text-slate-400">Hassle-free size replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">WhatsApp Ordering</h4>
              <p className="text-xs text-slate-400">Direct assistance with Owner</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Store Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" isDark={true} onClick={() => handleNav('home')} />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.aboutUs ||
                `Unique Style Footwear is your trusted destination for modern footwear, sports shoes, sandals, formal footwear, and slippers at Kokdoro Chowk, Pithoria, Kanke. Owned & managed by ${ownerName}.`}
            </p>
            <div className="pt-2 flex items-center gap-3">
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => openGeneralWhatsAppChat()}
                className="w-9 h-9 rounded-lg bg-emerald-950 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-colors border border-emerald-800/40"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Explore Store
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop')}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  All Footwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('categories')}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  Shop By Category
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('brands')}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  Featured Brands
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('offers')}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  Offers & Discounts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  Contact & Store Location
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Top Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategorySlug(cat.slug);
                      handleNav('shop');
                    }}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Location & Owner Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Owner & Contact
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              {/* Owner */}
              <div className="flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Owner / Proprietor</span>
                  <strong className="text-white block font-bold text-sm">{ownerName}</strong>
                </span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block font-medium">UNIQUE STYLE FOOTWEAR</strong>
                  {settings.address || 'Kokdoro Chowk, Pithoria, Kanke'}
                </span>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <button
                  onClick={() => openGeneralWhatsAppChat()}
                  className="text-emerald-400 hover:underline font-mono font-bold"
                >
                  +91 {whatsappNumber}
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <a href={`tel:+91${phoneNumber.replace(/[^0-9]/g, '')}`} className="font-mono hover:text-white transition-colors">
                  +91 {phoneNumber}
                </a>
              </div>

              {/* Timings */}
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.businessHours || 'Daily: 9:00 AM - 9:00 PM'}</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleNav('admin')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Policies */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} <strong className="text-slate-400">{settings.brandName}</strong> (Owner: {ownerName}). All rights reserved.
            Located at Kokdoro Chowk, Pithoria, Kanke.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleNav('policy-shipping')}
              className="hover:text-slate-300 transition-colors"
            >
              Shipping Policy
            </button>
            <span>•</span>
            <button
              onClick={() => handleNav('policy-return')}
              className="hover:text-slate-300 transition-colors"
            >
              Return & Exchange
            </button>
            <span>•</span>
            <button
              onClick={() => handleNav('policy-privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => handleNav('policy-terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
