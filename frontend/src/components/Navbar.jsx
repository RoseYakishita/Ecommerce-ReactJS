import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import useStore from '../store/useStore';
import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const cartItemCount = useStore(state => state.getCartItemCount());
  const user = useStore(state => state.user);
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-[70] w-full border-b border-secondary bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tighter text-primary">
          Lumina
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">Products</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About Us</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 px-2 py-1 rounded">Admin Panel</Link>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6 relative">
          {/* Search Toggle */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearchSubmit} 
                  className="absolute right-0 flex items-center bg-secondary/95 border border-secondary rounded-full h-10 px-3 overflow-hidden z-20"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    autoFocus
                    className="bg-transparent border-none text-sm placeholder:text-textLight focus:outline-none w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-1 p-1 text-textMain hover:bg-secondary/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <button 
                  className="p-2.5 bg-secondary/30 hover:bg-secondary/50 border border-secondary/20 rounded-full transition-all text-textMain shadow-sm active:scale-95" 
                  aria-label="Search"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </AnimatePresence>
          </div>
          
          <Link to={user ? "/profile" : "/login"} className="p-2.5 bg-secondary/30 hover:bg-secondary/50 border border-secondary/20 rounded-full transition-all text-textMain shadow-sm active:scale-95">
            <User className="w-5 h-5" />
          </Link>
          
          <Link to="/cart" className="p-2.5 bg-secondary/30 hover:bg-secondary/50 border border-secondary/20 rounded-full transition-all text-textMain shadow-sm relative active:scale-95">
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          <button 
            className={`md:hidden p-2.5 border rounded-full transition-all text-textMain shadow-md active:scale-95 ${
              isMenuOpen ? 'bg-primary text-white border-primary scale-110' : 'bg-white border-secondary hover:bg-secondary/20'
            }`} 
            aria-label="Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>

    <MobileMenu 
      isOpen={isMenuOpen} 
      onClose={() => setIsMenuOpen(false)} 
      user={user} 
    />
  </>
  );
}
