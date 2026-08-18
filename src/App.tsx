import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CategorySidebarDrawer } from './components/CategorySidebarDrawer';
import { ToastContainer } from './components/Toast';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { CategoriesView } from './views/CategoriesView';
import { BrandsView } from './views/BrandsView';
import { OffersView } from './views/OffersView';
import { ContactView } from './views/ContactView';
import { PoliciesView } from './views/PoliciesView';
import { AdminDashboardView } from './views/AdminDashboardView';

const AppContent: React.FC = () => {
  const { currentView, isCategoryDrawerOpen, setIsCategoryDrawerOpen } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Global Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 w-full pb-16">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'categories' && <CategoriesView />}
        {currentView === 'brands' && <BrandsView />}
        {currentView === 'offers' && <OffersView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'policies' && <PoliciesView />}
        {currentView === 'admin' && <AdminDashboardView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppWidget />

      {/* Global Slideouts & Overlays */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <SizeGuideModal />
      <CategorySidebarDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AdminProvider>
  );
}
