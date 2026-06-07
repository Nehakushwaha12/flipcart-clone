import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { getProductById } from '../services/mockData';
import { ShoppingCart, Zap, Star, Tag, ChevronRight, Loader2, ShieldCheck, Truck, RotateCcw, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      let found: any = getProductById(id as any);

      if (!found && id) {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${encodeURIComponent(id)}`);
          if (res.ok) found = await res.json();
        } catch (err) {
          console.error('Failed to fetch product:', err);
        }
      }

      if (found) {
        found = {
          images: found.images || [found.image],
          description: found.description || found.title,
          reviewCount: found.reviewCount || 0,
          originalPrice: found.originalPrice || Math.round((found.price || 0) * 1.2),
          discount: found.discount || 15,
          isAssured: found.isAssured || true,
          ...found,
        };
        setActiveImage(found.image);
      }
      setProduct(found);
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffbeb] dark:bg-gray-950">
        <div className="flex flex-col items-center gap-6">
           <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
           <p className="text-black font-black uppercase tracking-[0.2em] animate-pulse">Analyzing Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-20 text-center bg-[#fffbeb] min-h-screen flex flex-col items-center justify-center text-black">
        <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Product Not Found</h2>
        <p className="text-black/50 mb-10 font-bold uppercase tracking-widest text-sm">This elite item might have been moved or archived.</p>
        <button onClick={() => navigate('/products')} className="bg-black text-white px-14 py-5 rounded-[1.5rem] font-black shadow-2xl hover:scale-105 transition-all tracking-widest text-sm">Browse Collections</button>
      </div>
    );
  }

  return (
    <div className="bg-[#fffbeb] dark:bg-gray-950 min-h-screen py-12 transition-colors duration-500 text-black">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 text-[10px] font-black text-black/30 mb-10 uppercase tracking-[0.2em]">
           <Link to="/" className="hover:text-amber-600 transition-colors">Elite Home</Link>
           <ChevronRight size={14} className="text-amber-200" />
           <Link to="/products" className="hover:text-amber-600 transition-colors">{product.category}</Link>
           <ChevronRight size={14} className="text-amber-200" />
           <span className="text-black truncate max-w-[300px]">{product.title}</span>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-amber-200/30 border border-amber-50 dark:border-gray-800 flex flex-col lg:flex-row overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50/20 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          
          {/* Left: Media Section */}
          <div className="lg:w-[55%] p-10 flex flex-col gap-10">
            <div className="flex gap-8 h-[600px]">
              {/* Thumbnail Bar */}
              <div className="w-24 flex flex-col gap-4 overflow-y-auto no-scrollbar shrink-0">
                {product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onMouseEnter={() => setActiveImage(img)}
                    className={`w-full aspect-square rounded-[1.5rem] border-4 overflow-hidden p-2 transition-all ${activeImage === img ? 'border-amber-500 scale-105 shadow-xl shadow-amber-200' : 'border-amber-50 hover:border-amber-200'}`}
                  >
                    <img src={img} className="w-full h-full object-contain" alt="" />
                  </button>
                ))}
              </div>

              {/* Main Image View */}
              <div className="flex-1 bg-amber-50/20 dark:bg-gray-800 rounded-[3rem] border border-amber-50 dark:border-gray-700 relative group overflow-hidden flex items-center justify-center p-12 shadow-inner">
                 <motion.img 
                   key={activeImage}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   src={activeImage} 
                   alt={product.title} 
                   className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                 />
                 <div className="absolute top-8 right-8 flex flex-col gap-4">
                    <button className="w-14 h-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-lg hover:text-red-500 hover:scale-110 transition-all text-black/20 flex items-center justify-center">
                      <Heart size={24} />
                    </button>
                    <button className="w-14 h-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-lg hover:text-amber-600 hover:scale-110 transition-all text-black/20 flex items-center justify-center">
                      <Share2 size={24} />
                    </button>
                 </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-6 relative z-10">
               <button 
                onClick={() => dispatch(addToCart(product))}
                className="py-6 bg-white border-4 border-black text-black font-black rounded-[2rem] shadow-xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-sm group"
               >
                 <ShoppingCart size={24} className="group-hover:scale-125 transition-transform" /> Add to Collection
               </button>
               <button 
                onClick={() => { dispatch(addToCart(product)); navigate('/cart'); }}
                className="py-6 bg-amber-500 text-white font-black rounded-[2rem] shadow-2xl shadow-amber-500/30 hover:bg-amber-600 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-sm group"
               >
                 <Zap size={24} fill="currentColor" className="group-hover:animate-bounce" /> Purchase Now
               </button>
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="lg:w-[45%] p-10 lg:p-16 bg-white dark:bg-gray-900 border-l border-amber-50 dark:border-gray-800 relative">
            <div className="flex items-center justify-between mb-6">
               <p className="text-xs font-black text-amber-600 uppercase tracking-[0.3em]">{product.brand}</p>
               {product.isAssured && (
                 <div className="flex items-center gap-2 bg-black text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl tracking-widest uppercase">
                   <ShieldCheck size={14} className="text-amber-500" /> Apna Assured
                 </div>
               )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-black dark:text-white leading-[1.1] mb-8 tracking-tighter uppercase">{product.title}</h1>

            <div className="flex items-center gap-6 mb-10">
               <div className="flex items-center bg-emerald-500 text-white px-4 py-1.5 rounded-xl font-black text-base gap-2 shadow-lg shadow-emerald-500/20">
                 {product.rating} <Star size={18} fill="currentColor" />
               </div>
               <p className="text-xs font-black text-black/30 uppercase tracking-widest">
                 {product.reviewCount?.toLocaleString()} Elite Reviews
               </p>
            </div>

            <div className="bg-amber-50/30 p-8 rounded-[2.5rem] mb-10 border border-amber-50">
               <p className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-2">Exclusive Price Offer</p>
               <div className="flex items-center gap-6">
                 <span className="text-5xl font-black text-black dark:text-white tracking-tighter">₹{product.price.toLocaleString()}</span>
                 <div className="flex flex-col">
                    <span className="text-lg text-black/30 line-through font-bold">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-lg font-black text-emerald-600 uppercase tracking-tighter">{product.discount}% OFF</span>
                 </div>
               </div>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-6 mb-12">
               <div className="flex flex-col items-center p-5 bg-[#fffdf5] rounded-[2rem] text-center border border-amber-50 group hover:border-amber-200 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Truck size={22} className="text-amber-500" />
                  </div>
                  <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">Prime Delivery</span>
               </div>
               <div className="flex flex-col items-center p-5 bg-[#fffdf5] rounded-[2rem] text-center border border-amber-50 group hover:border-amber-200 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <RotateCcw size={22} className="text-amber-500" />
                  </div>
                  <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">7-Day Refund</span>
               </div>
               <div className="flex flex-col items-center p-5 bg-[#fffdf5] rounded-[2rem] text-center border border-amber-50 group hover:border-amber-200 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={22} className="text-amber-500" />
                  </div>
                  <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">Secured Pay</span>
               </div>
            </div>

            {/* Offers */}
            <div className="space-y-6 pt-10 border-t border-amber-50 dark:border-gray-800">
               <h3 className="font-black text-black dark:text-white uppercase text-xs tracking-[0.3em]">Curated Offers For You</h3>
               <div className="space-y-4">
                  {[
                    "Elite Banking: 5% Unlimited Rewards with ApnaBank Elite Card",
                    "Flash Reward: Additional ₹2,500 off on this specific selection",
                    "Partner Offer: Sign up now for ₹500 instant wallet credit"
                  ].map((offer, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 hover:bg-amber-50/50 rounded-2xl transition-colors group">
                       <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 transition-colors">
                        <Tag size={12} className="text-amber-700 group-hover:text-white" />
                       </div>
                       <p className="text-xs text-black/60 dark:text-gray-400 font-bold leading-relaxed">{offer}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;