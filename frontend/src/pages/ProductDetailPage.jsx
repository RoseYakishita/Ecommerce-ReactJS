import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Truck, Shield, ArrowLeft, Minus, Plus } from 'lucide-react';
import { getProductById, getProducts } from '../services/api';
import useStore from '../store/useStore';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { useToast } from '../components/ToastProvider';
import ImageWithFallback from '../components/ImageWithFallback';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useStore(state => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
          // Fetch related products
          const { data: allProducts } = await getProducts({ categoryId: data.categoryId });
          const related = allProducts
            .filter(p => p.id !== data.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Error fetching product details:", error);
        }
      } finally {
        setLoading(false);
        setQuantity(1);
        window.scrollTo(0, 0);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      showToast(`Added ${quantity} ${product.name} to cart.`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 animate-pulse">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          <div className="w-full md:w-1/2 aspect-square bg-secondary/20 rounded-lg"></div>
          <div className="w-full md:w-1/2 space-y-6 pt-4">
            <div className="h-4 bg-secondary/30 rounded w-24"></div>
            <div className="h-10 bg-secondary/30 rounded w-3/4"></div>
            <div className="h-6 bg-secondary/30 rounded w-32"></div>
            <div className="space-y-3 pt-6">
              <div className="h-4 bg-secondary/30 rounded w-full"></div>
              <div className="h-4 bg-secondary/30 rounded w-full"></div>
              <div className="h-4 bg-secondary/30 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="text-textLight mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Link to="/products" className="inline-flex items-center text-sm font-medium text-textLight hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-16 mb-24">
        {/* Gallery */}
        <div className="w-full md:w-1/2">
          <div className="bg-secondary/10 rounded-lg overflow-hidden border border-secondary aspect-square">
            <ImageWithFallback
              src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col pt-2 md:pt-8">
          <div className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            {typeof product.category === 'object' ? product.category?.name : product.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-secondary fill-current'}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-textLight">{product.rating} Rating</span>
          </div>

          <p className="text-3xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>

          <p className="text-textLight leading-relaxed mb-8 text-lg">
            {product.description}
          </p>

          {/* Product Specifications */}
          <div className="bg-secondary/10 rounded-xl p-6 mb-10 border border-secondary/20">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Specifications</h3>
            <div className="space-y-3 text-sm">
              {product.dimensions && (
                <div className="flex justify-between border-b border-secondary/30 pb-2">
                  <span className="text-textLight">Dimensions</span>
                  <span className="font-medium text-right">{product.dimensions}</span>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between border-b border-secondary/30 pb-2">
                  <span className="text-textLight">Material</span>
                  <span className="font-medium text-right">{product.material}</span>
                </div>
              )}

            </div>
          </div>

          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-medium text-sm">Quantity</span>
              <div className="flex items-center border border-secondary rounded-md">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-textLight hover:text-textMain transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-10 text-center font-medium">{quantity}</div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-textLight hover:text-textMain transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button onClick={handleAddToCart} size="lg" className="w-full md:w-auto md:min-w-[200px]">
              Add to Cart
            </Button>
          </div>

          <div className="border-t border-secondary mt-10 pt-8 grid grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-secondary/30 p-3 rounded-full text-primary">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Free Shipping</h4>
                <p className="text-xs text-textLight">On orders over $1,500</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-secondary/30 p-3 rounded-full text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">5-Year Warranty</h4>
                <p className="text-xs text-textLight">Guaranteed quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold tracking-tight">You might also like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
