import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/Button';
import ImageWithFallback from '../components/ImageWithFallback';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useStore();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="bg-secondary/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Your cart is empty</h1>
        <p className="text-textLight mb-8">
          Looks like you haven't added any furniture to your cart yet. Discover our latest collections.
        </p>
        <Button onClick={() => navigate('/products')} size="lg" className="w-full">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-secondary text-sm font-medium text-textLight">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-secondary">
            {cart.map((item) => (
              <div key={item.id} className="py-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                <div className="col-span-6 flex items-center w-full gap-4">
                  <div className="w-24 h-24 shrink-0 bg-secondary/10 rounded-md overflow-hidden">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-textMain line-clamp-2">
                      <Link to={`/product/${item.id}`} className="hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-textLight mt-1">${Number(item.price).toFixed(2)}</p>
                  </div>
                </div>

                <div className="col-span-3 flex justify-center w-full md:w-auto mt-4 md:mt-0">
                  <div className="flex items-center border border-secondary rounded-md">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-textLight hover:text-textMain transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-10 text-center text-sm font-medium">{item.quantity}</div>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-textLight hover:text-textMain transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="col-span-2 text-right w-full md:w-auto mt-2 md:mt-0 font-medium">
                  <span className="md:hidden text-textLight text-sm mr-2">Total:</span>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <div className="col-span-1 flex justify-end w-full md:w-auto mt-4 md:mt-0">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-textLight hover:text-red-500 transition-colors p-2"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white border border-secondary rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-textLight">Subtotal</span>
                <span className="font-medium">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textLight">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textLight">Tax</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-secondary pt-4 mb-8">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Estimated Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={() => navigate('/checkout')} size="lg" className="w-full">
              Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            <p className="text-xs text-textLight text-center mt-4">
              Secure checkout. Free shipping on qualifying orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
