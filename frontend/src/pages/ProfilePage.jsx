import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import Button from '../components/Button';
import api from '../services/api';

export default function ProfilePage() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="p-8 text-center text-textLight">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <Button onClick={handleLogout} className="bg-red-50 text-red-600 hover:bg-red-100 border-none">
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-secondary/10 p-6 rounded-lg border border-secondary">
            <h2 className="text-xl font-semibold mb-4 text-primary">Account Details</h2>
            <p className="mb-2"><span className="text-textLight">Name:</span> {user?.name}</p>
            <p className="mb-2"><span className="text-textLight">Email:</span> {user?.email}</p>
            <p className="mb-2"><span className="text-textLight">Role:</span> <span className="font-bold">{user?.role}</span></p>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Order History ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="bg-secondary/5 border border-secondary p-8 text-center rounded-lg">
              <p className="text-textLight mb-4">You haven't placed any orders yet.</p>
              <Button onClick={() => navigate('/products')}>Start Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-secondary rounded-lg overflow-hidden">
                  <div className="bg-secondary/20 p-4 border-b border-secondary flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-xs text-textLight">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${Number(order.totalAmount).toFixed(2)}</p>
                      <span className={`inline-block px-2 py-1 mt-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 divide-y divide-secondary/50">
                    {order.items?.map(item => (
                      <div key={item.id} className="py-2 flex justify-between items-center text-sm">
                        <div className="flex gap-4 items-center">
                          <img src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200'} alt={item.product?.name} className="w-12 h-12 object-cover rounded" />
                          <div>
                            <p className="font-medium">{item.product?.name}</p>
                            <p className="text-textLight">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">${Number(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
