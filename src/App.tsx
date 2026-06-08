/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { DataProvider, useGlobalData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { BrowseAssets } from './components/BrowseAssets';
import { Features } from './components/Features';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { Library } from './components/Library';
import { AssetModal } from './components/AssetModal';
import { ToastContainer } from './components/ToastContainer';
import { ScrollToTop } from './components/ScrollToTop';
import { AuthModal } from './components/AuthModal';
import { RemoveConfirmationModal } from './components/RemoveConfirmationModal';
import { Asset } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
  
  const { showAuthModal, setShowAuthModal } = useGlobalData();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: string) => {
    if (view === 'browse_category') {
      setCurrentView('browse');
    } else {
      setSelectedCategory('all');
      setCurrentView(view);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('browse');
  };

  return (
    <div className="min-h-screen font-sans bg-red-500 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar onNavigate={handleNavigate} />
      
      <main className="pt-16">
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-500">
            <Hero onNavigate={handleNavigate} />
            <Categories onCategoryClick={handleCategoryClick} />
            <Features />
          </div>
        )}

        {currentView === 'browse' && (
          <div className="animate-in fade-in duration-500">
            <BrowseAssets 
              initialCategory={selectedCategory} 
              onViewAsset={setViewingAsset} 
            />
          </div>
        )}

        {currentView === 'free' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-green-50 py-12 border-b border-green-100">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold text-green-900 mb-4">Free Community Assets</h1>
                <p className="text-green-700 max-w-2xl mx-auto text-lg">High-quality resources available at no cost for your personal and commercial projects.</p>
              </div>
            </div>
            <BrowseAssets 
              onlyFree={true} 
              onViewAsset={setViewingAsset} 
            />
          </div>
        )}

        {currentView === 'library' && (
          <div className="animate-in fade-in duration-500">
            <Library onViewAsset={setViewingAsset} />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="animate-in fade-in duration-500">
            <Contact />
          </div>
        )}

        {currentView === 'admin' && (
          <div className="animate-in fade-in duration-500">
            <AdminPanel />
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      
      {viewingAsset && (
        <AssetModal asset={viewingAsset} onClose={() => setViewingAsset(null)} />
      )}
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      
      <RemoveConfirmationModal />
      <ToastContainer />
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
