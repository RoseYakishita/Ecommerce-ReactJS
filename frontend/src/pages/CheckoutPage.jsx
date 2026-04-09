import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import Button from '../components/Button';
<<<<<<< HEAD
import { createOrderApi, createMomoPaymentApi } from '../services/api';
import momoLogo from '../assets/MoMo-Logo-New.png';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal } = useStore();
=======
import { createOrderApi } from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useStore();
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
<<<<<<< HEAD
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [loading, setLoading] = useState(false);

  const subtotalRaw = getCartTotal();
  const subtotal = Math.round(subtotalRaw * 100) / 100; 
  const shippingUsd = 1.00; // Flat rate 1 USD
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% Tax
  const total = Math.round((subtotal + shippingUsd + tax) * 100) / 100; // Final total rounded 
=======

  const subtotal = getCartTotal();
  const shipping = subtotal > 1500 ? 0 : 50;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setLoading(true);
    try {
      const order = await createOrderApi(paymentMethod);
      
      if (paymentMethod === 'MOMO') {
        const momoRes = await createMomoPaymentApi(order.id);
        if (momoRes.payUrl) {
          useStore.getState().fetchCart(); // Fetch cart effectively clears local due to API side effects usually. Or manually clear:
          window.location.href = momoRes.payUrl;
          return;
        } else {
          alert('Something went wrong redirecting to MoMo: ' + JSON.stringify(momoRes));
        }
      } else {
        alert('Order placed successfully! Thank you for your purchase.');
        useStore.getState().fetchCart();
        navigate('/');
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
=======
    try {
      await createOrderApi();
      alert('Order placed successfully! Thank you for your purchase.');
      useStore.getState().fetchCart();
      navigate('/');
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No items to checkout</h2>
        <Button onClick={() => navigate('/products')}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Form */}
        <div className="lg:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-textMain mb-1">Email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-textMain mb-1">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-textMain mb-1">Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-textMain mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-textMain mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-textMain mb-1">Postal code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-textMain mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`relative flex flex-col items-center justify-center gap-3 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'CASH'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-secondary hover:border-primary/40 hover:bg-secondary/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH"
                    checked={paymentMethod === 'CASH'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="absolute top-3 right-3 w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <div className="w-14 h-14 rounded-full bg-white border border-secondary flex items-center justify-center text-2xl">
                    💵
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">COD</p>
                    <p className="text-xs text-textLight">Thanh toán khi nhận hàng</p>
                  </div>
                </label>

                <label
                  className={`relative flex flex-col items-center justify-center gap-3 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'MOMO'
                      ? 'border-pink-500 bg-pink-50 shadow-sm'
                      : 'border-secondary hover:border-pink-400 hover:bg-pink-50/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="MOMO"
                    checked={paymentMethod === 'MOMO'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="absolute top-3 right-3 w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <img
                    src={momoLogo}
                    alt="MoMo"
                    className="h-16 w-16 object-contain"
                  />
                  <div className="text-center">
                    <p className="font-semibold text-pink-700">MoMo</p>
                    <p className="text-xs text-textLight">Ví điện tử MoMo</p>
                  </div>
                </label>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
=======
            <Button type="submit" size="lg" className="w-full">
              Place Order
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/2">
          <div className="bg-secondary/10 rounded-lg p-6 lg:p-8 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="divide-y divide-secondary mb-6 max-h-[400px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="w-16 h-16 bg-white rounded-md overflow-hidden shrink-0 border border-secondary">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-textMain">{item.name}</h3>
                    <p className="text-xs text-textLight mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-secondary text-sm">
              <div className="flex justify-between">
                <span className="text-textLight">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textLight">Shipping</span>
<<<<<<< HEAD
                <span className="font-medium">{`$${shippingUsd.toFixed(2)}`}</span>
=======
                <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
              </div>
              <div className="flex justify-between">
                <span className="text-textLight">Estimated Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
            </div>

<<<<<<< HEAD
            <div className="mt-6 pt-6 border-t border-secondary flex flex-col items-end text-lg font-bold">
              <div className="flex justify-between w-full">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-textLight font-medium mt-1 text-right">
                <div>≈ {Math.round(total * 25000).toLocaleString('vi-VN')} VND</div>
                <div className="text-xs mt-0.5">
                  {paymentMethod === 'MOMO' ? 'Tỷ giá hiển thị cho thanh toán MoMo' : 'Tỷ giá tham khảo cho COD'}
                </div>
              </div>
=======
            <div className="mt-6 pt-6 border-t border-secondary flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
