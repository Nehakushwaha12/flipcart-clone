import React, { useEffect, useState } from 'react';
import { categories, products } from '../services/mockData';
import ProductCard from '../components/common/ProductCard';
import { ChevronLeft, ChevronRight, Timer, ArrowRight, TrendingUp, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AIRecommendations from '../components/common/AIRecommendations';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      tag: "FESTIVE EDITION '26",
      title: "Royal Ethnic Wear",
      subtitle: "Elegance redefined for the modern woman. Flat 50% Off on premium silks.",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1200",
      bgClass: "bg-gradient-to-r from-rose-900 via-pink-900 to-black",
      textColor: "text-white",
      subtextColor: "text-pink-200",
      btnClass: "bg-white text-rose-900 hover:bg-pink-50",
      textPos: "left",
      link: "/products?search=women"
    },
    {
      id: 2,
      tag: "URBAN STREETWEAR",
      title: "Men's Core Collection",
      subtitle: "Step up your style game with 2026's most anticipated streetwear drops.",
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1200",
      bgClass: "bg-gradient-to-r from-gray-100 to-gray-300",
      textColor: "text-gray-900",
      subtextColor: "text-gray-700",
      btnClass: "bg-gray-900 text-white hover:bg-black",
      textPos: "center",
      link: "/products?search=Men"
    },
    {
      id: 3,
      tag: "LUXURY FOOTWEAR",
      title: "Sneaker Vault '26",
      subtitle: "Exclusive drops from global designers. Walk the talk this season.",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200",
      bgClass: "bg-gradient-to-r from-slate-900 via-indigo-900 to-black",
      textColor: "text-white",
      subtextColor: "text-indigo-200",
      btnClass: "bg-indigo-500 text-white hover:bg-indigo-600",
      textPos: "left",
      link: "/products?search=shoes"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12 font-sans transition-colors duration-300">

      {/* Hero Section 2026 Redesign */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6 mb-16 relative z-10">
        <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl group border border-gray-100/20">
          <div className="absolute inset-0 z-0">
            {banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: index === currentSlide ? 1 : 0, scale: index === currentSlide ? 1 : 1.05 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`absolute inset-0 w-full h-full flex items-center ${banner.bgClass}`}
              >
                {/* Image background with mask */}
                <div className="absolute inset-0 z-0 right-0 left-auto w-full md:w-2/3 h-full">
                    <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgClass.split(' ')[1]} via-transparent to-transparent z-10`} />
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-80 md:opacity-100" />
                </div>

                {/* Glassmorphism Text Container */}
                <div className={`relative z-20 px-6 md:px-16 w-full max-w-7xl mx-auto flex ${banner.textPos === 'center' ? 'justify-center text-center' : 'justify-start text-left'}`}>
                  <div className={`max-w-xl backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl ${banner.textPos === 'center' ? 'items-center flex flex-col' : ''}`}>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: index === currentSlide ? 0 : 20, opacity: index === currentSlide ? 1 : 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="inline-block px-3 py-1 mb-6 border border-white/20 rounded-full backdrop-blur-md"
                    >
                      <span className={`text-xs font-bold tracking-widest uppercase ${banner.textColor}`}>{banner.tag}</span>
                    </motion.div>
                    
                    <motion.h1
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: index === currentSlide ? 0 : 30, opacity: index === currentSlide ? 1 : 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className={`text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-4 ${banner.textColor}`}
                    >
                      {banner.title}
                    </motion.h1>
                    
                    <motion.p
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: index === currentSlide ? 0 : 30, opacity: index === currentSlide ? 1 : 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className={`text-lg md:text-xl font-medium mb-8 ${banner.subtextColor}`}
                    >
                      {banner.subtitle}
                    </motion.p>
                    
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: index === currentSlide ? 1 : 0.9, opacity: index === currentSlide ? 1 : 0 }}
                      transition={{ delay: 0.9, duration: 0.4 }}
                    >
                      <Link to={banner.link || "/products"} className={`${banner.btnClass} px-8 py-4 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-3 text-sm tracking-wide uppercase`}>
                        Explore Live <ArrowRight size={18} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Minimalist Carousel Controls */}
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white p-4 rounded-full transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white p-4 rounded-full transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
            <ChevronRight size={24} />
          </button>

          {/* Animated Progress Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="relative overflow-hidden h-1.5 rounded-full transition-all duration-300 w-12 bg-white/30"
              >
                 {index === currentSlide && (
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 6, ease: "linear" }}
                      className="absolute left-0 top-0 bottom-0 bg-white"
                    />
                 )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30 mb-12">
         <AIRecommendations context="home" />
      </div>

      {/* Features Strip */}
      <div className="max-w-7xl mx-auto px-4 relative z-30 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Free Shipping</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">On all orders over ₹500</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Secure Payment</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">100% secure payment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Best Quality</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Certified products</p>
            </div>
          </div>
        </div>
      </div>


      {/* Top Deals Section */}
      <div className="max-w-[1400px] mx-auto px-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Deals</h2>
              <div className="flex items-center gap-2 text-white bg-[#2874f0] px-2 py-1 rounded-sm text-[10px] font-bold uppercase">
                <Timer size={12} />
                <span>Ends in 10h 25m</span>
              </div>
            </div>
            <Link to="/products" className="bg-[#2874f0] text-white px-5 py-1.5 rounded-sm font-bold text-sm shadow-sm hover:bg-blue-600 transition-all">
              VIEW ALL
            </Link>
          </div>

          <div className="p-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 min-w-max pb-2">
              {products.slice(0, 10).map((product) => (
                <div key={product.id} className="w-[200px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Electronics Section */}
      <div className="max-w-[1400px] mx-auto px-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white">Best of Electronics</h2>
             <Link to="/products?category=Electronics" className="bg-[#2874f0] text-white px-5 py-1.5 rounded-sm font-bold text-sm shadow-sm">
                VIEW ALL
             </Link>
          </div>
          <div className="p-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 min-w-max pb-2">
              {products.filter(p => p.category === 'Electronics' || p.category === 'Mobiles').slice(0, 10).map((product) => (
                <div key={product.id} className="w-[200px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fashion Section */}
      <div className="max-w-[1400px] mx-auto px-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Fashion</h2>
             <Link to="/products?category=Fashion" className="bg-[#2874f0] text-white px-5 py-1.5 rounded-sm font-bold text-sm shadow-sm">
                VIEW ALL
             </Link>
          </div>
          <div className="p-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 min-w-max pb-2">
              {products.filter(p => p.category === 'Fashion').slice(0, 10).map((product) => (
                <div key={product.id} className="w-[200px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
