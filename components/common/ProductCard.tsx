import React from 'react';
import { Product } from '../../types';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 relative flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        {/* Image Container */}
        <div className="relative h-48 sm:h-52 w-full bg-white flex items-center justify-center p-2 overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
            transition={{ duration: 0.3 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const seed = product.id ? String(product.id).replace(/\D/g, '').slice(0, 6) || '100' : '100';
              target.src = `https://picsum.photos/seed/${seed}/300/300`;
              target.onerror = null;
            }}
          />

          {/* Wishlist Button */}
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-300 hover:text-red-500 transition-all">
            <Heart size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 mb-1 group-hover:text-[#2874f0] transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center bg-[#388e3c] text-white px-1 py-0.5 rounded-[3px] text-[10px] gap-0.5 font-bold">
              {product.rating} <Star size={10} fill="currentColor" />
            </div>
            <span className="text-gray-500 text-[11px] font-medium">({product.reviewCount.toLocaleString()})</span>
            {product.isAssured && (
               <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fa_62673a.png" alt="assured" className="h-[15px] ml-auto" />
            )}
          </div>

          <div className="mt-auto pt-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
              <span className="text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-xs font-bold text-[#388e3c]">
                {product.discount}% off
              </span>
            </div>
            
            {product.isBudgetFriendly && (
              <div className="text-[10px] font-bold text-[#388e3c] mt-1 italic">
                Lowest price in 30 days
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
