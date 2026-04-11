import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-secondary/30 pt-16 pb-8 border-t border-secondary mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
          <Link to="/" className="text-2xl font-bold tracking-tighter text-primary block mb-4">
            Lumina
          </Link>
          <p className="text-textLight text-sm max-w-xs">
            Designing comfortable, minimal, and modern living spaces for everyone.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm text-textLight">
            <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/products?category=sofa" className="hover:text-primary">Sofas</Link></li>
            <li><Link to="/products?category=table" className="hover:text-primary">Tables</Link></li>
            <li><Link to="/products?category=chair" className="hover:text-primary">Chairs</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-textLight">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><a href="#" className="hover:text-primary">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-primary">Care Guide</a></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Newsletter</h3>
          <p className="text-sm text-textLight mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-white border border-secondary px-4 py-2 text-sm w-full rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-r-md text-sm hover:bg-[#7a4f25] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 border-t border-secondary pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-textLight">
        <p>&copy; {new Date().getFullYear()} Lumina Furniture. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
