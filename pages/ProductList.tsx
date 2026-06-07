import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../services/mockData';
import ProductCard from '../components/common/ProductCard';
import { Filter, Check, Star, IndianRupee, Tag, ShieldCheck, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const [liveProducts, setLiveProducts] = useState<any[] | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setLiveProducts(null);

    const params = new URLSearchParams();
    if (searchParam) params.append('q', searchParam);
    if (categoryParam) params.append('category', categoryParam);
    // Map frontend sortBy values to backend sort param values
    if (sortBy === 'lowToHigh') params.append('sort', 'price-low');
    else if (sortBy === 'highToLow') params.append('sort', 'price-high');
    else if (sortBy === 'rating') params.append('sort', 'rating');

    fetch(`http://localhost:5000/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setLiveProducts(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => {
        setLiveProducts([]);
        setIsLoading(false);
      });
  }, [searchParam, categoryParam, sortBy]);

  const filteredProducts = useMemo(() => {
    let result = liveProducts !== null ? liveProducts : products;

    if (categoryParam && liveProducts === null) {
      result = result.filter(p => p.category === categoryParam);
    }

    result = result.filter(p => {
      const price = p.price || 0;
      const rating = p.rating || 0;
      const meetsStock = inStockOnly ? (p.stock > 0) : true;
      return price >= priceRange[0] && price <= priceRange[1] && rating >= minRating && meetsStock;
    });

    if (sortBy === 'lowToHigh') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'highToLow') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [categoryParam, priceRange, minRating, liveProducts, inStockOnly, sortBy]);

  return (
    <div className="bg-[#fffdf0] dark:bg-gray-950 min-h-screen py-10 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-10">

        {/* Sidebar Filters */}
        <aside className="w-full md:w-80 shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-amber-100/40 border border-amber-50 dark:border-gray-800 sticky top-28 overflow-hidden">
            <div className="p-8 border-b border-amber-50 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-black text-black uppercase tracking-tighter">Filters</h2>
              <Filter size={24} className="text-amber-300" />
            </div>

            <div className="p-8 space-y-10">
              {/* Price Filter */}
              <div>
                <h3 className="text-xs font-black text-black uppercase tracking-widest mb-6 flex items-center gap-3">
                  <IndianRupee size={18} /> Price Range
                </h3>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-amber-50 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs font-black text-black mt-4 uppercase tracking-wider">
                  <span>₹0</span>
                  <span className="text-black bg-amber-50 px-4 py-1.5 rounded-full shadow-inner">Up to ₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-black text-black uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Tag size={18} /> Categories
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                  {categories.map(c => (
                    <button
                      key={c.name}
                      onClick={() => window.location.href = `/#/products?category=${c.name}`}
                      className={`flex items-center justify-between w-full p-4 rounded-2xl text-sm transition-all ${categoryParam === c.name ? 'bg-amber-500 text-white font-black shadow-lg shadow-amber-200' : 'hover:bg-amber-50 text-black font-bold'}`}
                    >
                      {c.name}
                      {categoryParam === c.name && <Check size={18} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="text-xs font-black text-black uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Star size={18} /> Ratings
                </h3>
                <div className="space-y-3">
                  {[4, 3, 2].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`flex items-center gap-4 w-full p-4 rounded-2xl text-sm transition-all ${minRating === rating ? 'bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100 font-black' : 'text-black font-bold hover:bg-amber-50'}`}
                    >
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${minRating === rating ? 'bg-emerald-500 border-emerald-500' : 'border-amber-100'}`}>
                        {minRating === rating && <Check size={12} className="text-white" />}
                      </div>
                      {rating}★ & above
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="pt-8 border-t border-amber-50 dark:border-gray-800">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={inStockOnly}
                      onChange={() => setInStockOnly(!inStockOnly)}
                    />
                    <div className={`w-14 h-7 rounded-full transition-colors ${inStockOnly ? 'bg-amber-500' : 'bg-amber-100'}`}></div>
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${inStockOnly ? 'translate-x-7' : ''} shadow-md`}></div>
                  </div>
                  <span className="text-sm font-black text-black uppercase tracking-widest">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {/* Top Sort Bar */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-amber-100/30 border border-amber-50 dark:border-gray-800 p-8 mb-10 flex flex-col xl:flex-row justify-between items-center gap-8">
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-black uppercase tracking-tighter leading-none">
                {searchParam ? `Results for "${searchParam}"` : categoryParam || 'All Collections'}
              </h1>
              <p className="text-xs font-black text-black mt-3 flex items-center gap-3 uppercase tracking-widest">
                <Box size={16} /> {filteredProducts.length} Premium Items
              </p>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1 xl:pb-0 w-full xl:w-auto">
              <span className="text-xs font-black text-black uppercase tracking-widest mr-3 shrink-0">Sort By:</span>
              {[
                { id: 'relevance', label: 'Relevance' },
                { id: 'lowToHigh', label: 'Price: Low' },
                { id: 'highToLow', label: 'Price: High' },
                { id: 'rating', label: 'Top Rated' }
              ].map(sort => (
                <button
                  key={sort.id}
                  onClick={() => setSortBy(sort.id)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${sortBy === sort.id ? 'bg-amber-500 text-white shadow-xl shadow-amber-200' : 'bg-amber-50 text-black hover:bg-amber-100'}`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="relative min-h-[500px]">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[3rem] h-[30rem] animate-pulse shadow-sm"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-[4rem] p-24 text-center shadow-2xl shadow-amber-100/50 border-4 border-dashed border-amber-50 dark:border-gray-800">
                <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <Filter size={56} className="text-amber-200" />
                </div>
                <h3 className="text-4xl font-black text-black mb-5 tracking-tighter">No matching products</h3>
                <p className="text-xl text-black/60 mb-12 max-w-sm mx-auto font-medium">We couldn't find anything matching your filters. Try clearing them to see all products.</p>
                <button
                  onClick={() => {
                    setPriceRange([0, 200000]);
                    setMinRating(0);
                    setInStockOnly(false);
                  }}
                  className="bg-amber-500 text-white px-14 py-5 rounded-[1.5rem] font-black shadow-2xl shadow-amber-200 hover:bg-amber-600 transition-all uppercase tracking-widest text-base active:scale-95"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default ProductList;