import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
<<<<<<< HEAD
import PaymentResultPage from './pages/PaymentResultPage';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard'; // Will create this next

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
          <Route path="/payment-result" element={<PaymentResultPage />} />
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
          <Route path="/about" element={<div className="p-20 text-center text-3xl font-bold">About Us Page Coming Soon</div>} />
          <Route path="/contact" element={<div className="p-20 text-center text-3xl font-bold">Contact Page Coming Soon</div>} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
