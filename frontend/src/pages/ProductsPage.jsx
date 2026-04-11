import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const sortParam = searchParams.get('sort') || 'featured';
  
  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState(sortParam); // featured, price-asc, price-desc, newest
  const [currentPage, setCurrentPage] = useState(pageParam);

  useEffect(() => {
    setActiveCategory(categoryParam || 'all');
  }, [categoryParam]);

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    setSortBy(sortParam);
  }, [sortParam]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          page: currentPage,
          limit: 12, // 4 rows of 3 on desktop
          search: searchParam || undefined,
          categoryId: activeCategory !== 'all' ? activeCategory : undefined,
          sort: sortBy,
        };

        const [response, categoriesData] = await Promise.all([
          getProducts(params),
          getCategories(),
        ]);

        const { data: productsData, total, lastPage: totalPages } = response;

        setProducts(productsData);
        setCategories(categoriesData);
        setTotalResults(total);
        setLastPage(totalPages);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory, sortBy, searchParam, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      const newParams = Object.fromEntries(searchParams.entries());
      newParams.page = newPage;
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-12 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {searchParam ? `Search: "${searchParam}"` : 'All Products'}
        </h1>
        <p className="text-textLight max-w-2xl">
          {searchParam 
            ? `Showing results for "${searchParam}" in our collection.`
            : "Discover our full collection of thoughtfully designed furniture and decor for your home."
          }
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4 font-semibold text-lg">
                <SlidersHorizontal className="w-5 h-5" />
                <h3>Categories</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => {
                      setActiveCategory('all');
                      const next = Object.fromEntries(searchParams.entries());
                      delete next.category;
                      next.page = '1';
                      setSearchParams(next);
                    }}
                    className={`text-sm w-full text-left transition-colors ${activeCategory === 'all' ? 'text-primary font-semibold' : 'text-textLight hover:text-textMain'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category.id}>
                    <button 
                      onClick={() => {
                        setActiveCategory(String(category.id));
                        const next = Object.fromEntries(searchParams.entries());
                        next.category = String(category.id);
                        next.page = '1';
                        setSearchParams(next);
                      }}
                      className={`text-sm w-full text-left capitalize transition-colors ${activeCategory === String(category.id) ? 'text-primary font-semibold' : 'text-textLight hover:text-textMain'}`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-secondary">
            <p className="text-sm text-textLight">
              Showing <span className="font-semibold text-textMain">{products.length}</span> of <span className="font-semibold text-textMain">{totalResults}</span> results
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-textLight hidden md:inline">Sort by:</span>
              <div className="relative">
                <select 
                  className="appearance-none bg-transparent pr-8 pl-4 py-2 border border-secondary rounded hover:border-textLight focus:outline-none focus:border-primary cursor-pointer text-sm font-medium"
                  value={sortBy}
                  onChange={(e) => {
                    const nextSort = e.target.value;
                    setSortBy(nextSort);
                    const next = Object.fromEntries(searchParams.entries());
                    next.sort = nextSort;
                    next.page = '1';
                    setSearchParams(next);
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-textLight" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-secondary/20 aspect-[3/4] rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2">Something went wrong</h3>
              <p className="text-textLight">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 text-primary hover:underline font-medium"
              >
                Retry
              </button>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {lastPage > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-secondary rounded-lg hover:bg-secondary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(lastPage)].map((_, i) => {
                      const page = i + 1;
                      // Logic to show limited pages if there are too many
                      if (lastPage > 7) {
                        if (page === 1 || page === lastPage || (page >= currentPage - 1 && page <= currentPage + 1)) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-primary text-white' : 'hover:bg-secondary/30 text-textMain'}`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="px-1 text-textLight text-xs">...</span>;
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-primary text-white' : 'hover:bg-secondary/30 text-textMain'}`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className="p-2 border border-secondary rounded-lg hover:bg-secondary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-textLight">Try adjusting your filters to find what you're looking for.</p>
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setSearchParams({});
                }} 
                className="mt-6 text-primary hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
