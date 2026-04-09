import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const imageUrl = (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) 
    ? product.images[0] 
    : (product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800');

  return (
    <Link to={`/product/${product.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-secondary/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full">
      <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-secondary/10">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {product.stock < 10 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
            Low Stock
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-textMain text-sm md:text-base leading-tight truncate pr-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="font-bold text-primary whitespace-nowrap text-sm md:text-base">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-textLight uppercase tracking-wider bg-secondary/20 px-1.5 py-0.5 rounded">
            {typeof product.category === 'object' ? product.category?.name : (product.category || 'Furniture')}
          </span>

        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
            <span className="text-[10px] font-bold text-textMain">{product.rating || '4.8'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
