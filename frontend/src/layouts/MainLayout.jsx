import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import useStore from '../store/useStore';

export default function MainLayout() {
  const fetchCart = useStore(state => state.fetchCart);
  const token = useStore(state => state.token);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-textMain bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
