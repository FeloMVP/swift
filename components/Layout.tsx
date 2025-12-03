import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Home, FileText, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Apply', path: '/apply', icon: <FileText size={20} /> },
    { name: 'Legal', path: '/compliance', icon: <Shield size={20} /> },
  ];

  const firstName = user?.name.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 z-50 relative">
            <div className="bg-brand-600 text-white p-1.5 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">PesaSwift</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'text-brand-600' 
                    : 'text-slate-600 hover:text-brand-600'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-brand-700 font-semibold bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
                  <User size={18} />
                  <span>{firstName}</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-red-500 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  location.pathname === '/login' 
                    ? 'text-brand-600' 
                    : 'text-slate-600 hover:text-brand-600'
                }`}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-700 p-2 -mr-2 z-50 relative focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden flex flex-col pt-24 px-6 animate-in slide-in-from-top-5 duration-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-4 p-4 rounded-2xl text-lg font-medium transition-all ${
                    location.pathname === link.path 
                      ? 'bg-brand-50 text-brand-700 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`${location.pathname === link.path ? 'text-brand-600' : 'text-slate-400'}`}>
                    {link.icon}
                  </div>
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="h-px bg-gray-100 my-4"></div>

              {user ? (
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.phoneNumber}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-3 bg-white border border-gray-200 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-4 p-4 rounded-2xl text-lg font-medium transition-all ${
                    location.pathname === '/login' 
                      ? 'bg-brand-50 text-brand-700 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`${location.pathname === '/login' ? 'text-brand-600' : 'text-slate-400'}`}>
                    <LogIn size={20} />
                  </div>
                  <span>Login</span>
                </Link>
              )}
            </div>
            
            <div className="mt-auto mb-8 text-center text-slate-400 text-sm">
              <p>Licensed by CBK</p>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white">
                <div className="bg-brand-600 p-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <span className="text-xl font-bold tracking-tight">PesaSwift</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                Empowering Kenyans with instant, reliable financial solutions. Licensed Digital Credit Provider.
              </p>
            </div>

            {/* Column 2: Links - arranged in 2 columns for mobile */}
            <div className="grid grid-cols-2 gap-8 md:col-span-2">
              <div>
                <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                <ul className="space-y-4 text-sm">
                  <li><Link to="/" className="hover:text-brand-400 transition-colors block py-1">Home</Link></li>
                  <li><Link to="/apply" className="hover:text-brand-400 transition-colors block py-1">Apply for Loan</Link></li>
                  <li><Link to="/login" className="hover:text-brand-400 transition-colors block py-1">Login</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-6">Legal & Support</h4>
                <ul className="space-y-4 text-sm">
                  <li><Link to="/privacy" className="hover:text-brand-400 transition-colors block py-1">Privacy Policy</Link></li>
                  <li><Link to="/compliance" className="hover:text-brand-400 transition-colors block py-1">Terms of Service</Link></li>
                  <li><Link to="/compliance" className="hover:text-brand-400 transition-colors block py-1">Contact Us</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 text-center md:text-left">
            <p>&copy; 2023 PesaSwift Ltd.</p>
            <p className="mt-2 md:mt-0">Regulated by the Central Bank of Kenya (CBK).</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;