import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/Button';
import ImageWithFallback from '../components/ImageWithFallback';
import { getWishlistApi } from '../services/api';

export default function WishlistPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        const data = await getWishlistApi();
        setItems(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, navigate]);

  if (loading) {
    return <div className="p-8 text-center text-textLight">Loading wishlist...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="max-w-lg mx-auto text-center bg-secondary/10 border border-secondary rounded-xl p-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-white border border-secondary flex items-center justify-center mb-4">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-textLight mb-6">Save products you love and come back anytime.</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-secondary rounded-xl overflow-hidden shadow-sm">
              <Link to={`/product/${item.product?.id}`}>
                <div className="aspect-[4/3] bg-secondary/10">
                  <ImageWithFallback
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${item.product?.id}`} className="font-semibold hover:text-primary">
                  {item.product?.name}
                </Link>
                <p className="text-primary font-bold mt-1">${Number(item.product?.price || 0).toFixed(2)}</p>

                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => addToCart(item.product, 1)}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await toggleWishlist(item.productId);
                      setItems((prev) => prev.filter((x) => x.productId !== item.productId));
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
