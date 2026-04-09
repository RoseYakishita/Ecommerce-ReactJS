import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [{ data: productsData }, categoriesData] = await Promise.all([
          getProducts({ limit: 12 }), // Fetch more for slider
          getCategories()
        ]);
        
        setFeaturedProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  const slide = (direction) => {
    const container = sliderRef.current;
    if (!container) return;
    
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center mb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=2000" 
            alt="Modern living room" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-4 text-center max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-textMain leading-[1.1]">
            Elevate Your <br/><span className="text-primary italic font-serif">Living Space</span>
          </h1>
          <p className="text-xl md:text-2xl text-textMain/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Curated minimalist furniture that combines timeless aesthetics with modern functionality.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="group inline-flex items-center justify-center rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary h-14 px-10 text-lg bg-primary text-white hover:bg-primary/90 shadow-xl hover:scale-105 active:scale-95 duration-300">
              Shop Collection <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/products?category=1" className="inline-flex items-center justify-center rounded-full font-semibold transition-all h-14 px-10 text-lg bg-white/20 backdrop-blur-md text-textMain border border-white/30 hover:bg-white/30 duration-300">
              Browse Categories
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-4xl font-bold tracking-tight mb-4 font-heading">Shop by Category</h2>
          <div className="h-1 w-20 bg-primary opacity-30 rounded-full"></div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-secondary/20 h-40 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/products?category=${category.id}`}
                  className="group relative flex flex-col items-center justify-center p-8 bg-white border border-secondary rounded-2xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-lg text-textMain group-hover:text-primary capitalize z-10">{category.name}</span>
                  <p className="text-xs text-textLight mt-2 z-10 uppercase tracking-widest">{category.products?.length || 'View'} items</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Slider */}
      <section className="mb-24 overflow-hidden bg-secondary/5 py-16">
        <div className="container mx-auto px-4 mb-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-3 font-heading text-textMain">Featured Pieces</h2>
              <p className="text-textLight text-lg italic">Handpicked icons of modern design.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => slide('prev')}
                className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center bg-white hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => slide('next')}
                className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center bg-white hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative container mx-auto px-4">
          <div 
            ref={sliderRef}
            className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-10 cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="w-[180px] md:w-[240px] aspect-[4/5] bg-secondary/20 rounded-2xl animate-pulse flex-shrink-0"></div>
              ))
            ) : (
              featuredProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  className="w-[180px] md:w-[240px] flex-shrink-0 snap-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
          {/* Subtle gradient edges */}
          <div className="absolute top-0 left-0 h-full w-[10vw] bg-gradient-to-r from-secondary/5 to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 h-full w-[10vw] bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none z-10"></div>
        </div>

        <div className="container mx-auto px-4 mt-12 text-center">
          <Link 
            to="/products" 
            className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all duration-300 border-b-2 border-primary/20 pb-1"
          >
            Explore Entire Collection <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Decorative Section */}
      <section className="container mx-auto px-4 mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Sustainability First</span>
          <h2 className="text-5xl font-bold tracking-tight mb-8 leading-[1.1] text-textMain font-heading">Crafted for a Lifetime.</h2>
          <p className="text-xl text-textLight leading-relaxed mb-10">
            We believe in slow furniture. Each piece is designed to withstand generations of use, using responsibly sourced materials and artisan techniques.
          </p>
          <div className="grid grid-cols-2 gap-8 border-t border-secondary pt-10">
            <div>
              <p className="text-3xl font-bold text-textMain mb-1">100%</p>
              <p className="text-sm text-textLight uppercase tracking-widest font-medium">FSC Certified Wood</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-textMain mb-1">5 Year</p>
              <p className="text-sm text-textLight uppercase tracking-widest font-medium">Warranty</p>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200" 
            alt="Artisanship" 
            className="w-full h-full object-cover aspect-[4/5]"
          />
        </div>
      </section>
    </div>
  );
}
