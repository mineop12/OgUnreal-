import { useState, useEffect } from 'react';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import { useGlobalData } from '../context/DataContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export function Navbar({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, setShowAuthModal, isAdminLoggedIn } = useGlobalData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Browse Assets', view: 'browse' },
    { label: 'Free Assets', view: 'free' },
    { label: 'Library', view: 'library' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white border-b border-slate-200 shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white font-bold text-lg italic">
              U
            </div>
            <span className="font-bold text-xl tracking-tight text-[#0F172A]">
              OGUnreal <span className="text-[#2563EB]">Assets</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex ml-10 space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.view)}
                className="text-[#64748B] hover:text-[#2563EB] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input type="text" placeholder="Search UE5 assets..." className="bg-slate-100 border-none rounded-full px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition-all hidden lg:block" />
              <Search className="absolute right-3 top-2 w-4 h-4 text-slate-400 hidden lg:block" />
            </div>
            
            {currentUser ? (
              <div className="flex items-center gap-4">
                {isAdminLoggedIn && (
                  <button 
                    onClick={() => onNavigate('admin')}
                    className="text-sm font-bold text-[#2563EB] hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Admin Dashboard
                  </button>
                )}
                <span className="text-sm font-bold text-[#0F172A] truncate max-w-[150px]">
                  {currentUser.email?.split('@')[0]}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-100 text-[#0F172A] p-2 rounded-full hover:bg-slate-200 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-[#2563EB] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  onNavigate(link.view);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              >
                {link.label}
              </button>
            ))}
            {isAdminLoggedIn && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-bold text-[#2563EB] hover:bg-blue-50"
              >
                Admin Dashboard
              </button>
            )}
            <div className="mt-4 pt-4 border-t border-slate-200">
              {currentUser ? (
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              ) : (
                <button 
                  onClick={() => { setShowAuthModal(true); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-bold text-[#2563EB] hover:bg-blue-50"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
