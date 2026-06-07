import React, { useState } from 'react';
import { Product } from '../../types';
import { Heart, Star, ShoppingCart, ShieldCheck, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { addToCompare, removeFromCompare } from '../../redux/compareSlice';
import { toggleWishlist } from '../../redux/wishlistSlice';
import { RootState } from '../../redux/store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const compareItems = useSelector((state: RootState) => state.compare.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInCompare = compareItems.some(item => item.id === product.id);
  const isLiked = wishlistItems.some(item => item.id === product.id);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, quantity: 1 }));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) {
      dispatch(removeFromCompare(product.id));
    } else {
      if (compareItems.length >= 4) {
        alert("You can only compare up to 4 products at a time.");
        return;
      }
      dispatch(addToCompare(product));
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:shadow-amber-100 transition-all duration-300 overflow-hidden border border-amber-50 dark:border-gray-700 flex flex-col h-full relative"
    >
      {/* Wishlist Button */}
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(toggleWishlist(product)); }}
        className={`absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-colors z-20 ${isLiked ? 'text-red-500' : 'text-amber-300 hover:text-amber-500'}`}
      >
        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
      </button>

      {/* Compare Button */}
      <button 
        onClick={handleToggleCompare}
        className={`absolute top-4 left-4 p-2.5 backdrop-blur-sm rounded-full shadow-md transition-all z-20 ${isInCompare ? 'bg-amber-500 text-white' : 'bg-white/90 text-amber-400 hover:text-amber-600'}`}
        title={isInCompare ? "Remove from Compare" : "Add to Compare"}
      >
        <Scale size={20} />
      </button>

      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-[4/5] w-full bg-[#fffdf5] dark:bg-gray-900 overflow-hidden">
          <img
            src={product.image || "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
               const target = e.target as HTMLImageElement;
               target.src = "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400";
            }}
          />
          
          {product.isAssured && (
            <div className="absolute bottom-5 left-5 flex items-center gap-1.5 bg-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
              <ShieldCheck size={12} />
              APNA ASSURED
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-1">
          <p className="text-xs font-black text-black uppercase tracking-[0.3em] mb-3">{product.brand || 'Premium'}</p>
          <h3 className="text-base font-black text-black line-clamp-2 mb-4 group-hover:text-amber-600 transition-colors leading-relaxed">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center bg-emerald-500 text-white px-2.5 py-1 rounded-xl text-xs font-black">
              {product.rating} <Star size={12} fill="currentColor" className="ml-0.5" />
            </div>
            <span className="text-black text-xs font-black uppercase tracking-widest">({product.reviewCount?.toLocaleString()} reviews)</span>
          </div>

          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black text-black">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-black/50 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm font-black text-amber-500">{product.discount}% OFF</span>
                </>
              )}
            </div>
            <p className="text-xs font-bold text-black mb-8 flex items-center gap-1.5 uppercase tracking-wider">
              Free delivery <span className="text-amber-500 font-black">Tomorrow</span>
            </p>

            <button 
              onClick={handleAddToCart}
              className={`w-full border-2 py-4 rounded-[1.25rem] text-sm font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${
                isAdded 
                  ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600' 
                  : 'bg-amber-50 border-amber-100 hover:bg-amber-500 hover:text-white text-black'
              }`}
            >
              <ShoppingCart size={18} />
              {isAdded ? "ADDED TO CART" : "ADD TO CART"}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
