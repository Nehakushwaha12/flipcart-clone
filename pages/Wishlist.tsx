import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { clearWishlist } from '../redux/wishlistSlice';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';

const Wishlist: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.wishlist);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 text-center bg-[#fffdf0] dark:bg-gray-950 min-h-[70vh]">
        <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
          <Heart size={56} className="text-amber-200" />
        </div>
        <h2 className="text-4xl font-black text-black mb-5 tracking-tighter">Your wishlist is empty</h2>
        <p className="text-xl text-black/60 mb-12 max-w-md mx-auto font-medium">Explore more and shortlist some items.</p>
        <Link to="/products" className="bg-amber-500 text-white px-14 py-5 rounded-[1.5rem] font-black shadow-2xl shadow-amber-200 hover:bg-amber-600 transition-all uppercase tracking-widest text-base inline-block">
          BROWSE PRODUCTS
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fffdf0] dark:bg-gray-950 min-h-screen py-10 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-amber-100/30 border border-amber-50 dark:border-gray-800 p-8 mb-10 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-black uppercase tracking-tighter leading-none flex items-center gap-3">
              <Heart className="text-red-500" fill="currentColor" size={28} /> My Wishlist
            </h1>
            <p className="text-xs font-black text-black mt-3 uppercase tracking-widest">
              {items.length} Premium {items.length === 1 ? 'Item' : 'Items'}
            </p>
          </div>
          <button 
            onClick={() => dispatch(clearWishlist())}
            className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all bg-red-50 text-red-600 hover:bg-red-100"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
