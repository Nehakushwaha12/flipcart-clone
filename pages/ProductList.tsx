import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../services/mockData';
import ProductCard from '../components/common/ProductCard';
import { Filter, Check } from 'lucide-react';

const ProductList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [localSellerOnly, setLocalSellerOnly] = useState(false);
  const [ecoFriendlyOnly, setEcoFriendlyOnly] = useState(false);
  const [budgetFriendlyOnly, setBudgetFriendlyOnly] = useState(false);

  const [liveProducts, setLiveProducts] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiSource, setApiSource] = useState<'flipkart' | 'dummyjson' | 'local' | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setApiSource(null);

    let url = `http://localhost:5000/api/products?`;
    const params = new URLSearchParams();
    if (searchParam) params.append('q', searchParam);
    if (categoryParam) params.append('category', categoryParam);

    fetch(url + params.toString())
      .then(r => { if (!r.ok) throw new Error('Backend error'); return r.json(); })
      .then(data => {
        console.log("Fetched products:", data);
        setLiveProducts(Array.isArray(data) ? data : []);
        setApiSource('local');
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLiveProducts(null); // Fallback to mockData
        setApiSource(null);
        setIsLoading(false);
      });
  }, [searchParam, categoryParam]);

  // ── Filter & Sort Logic ──────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = liveProducts !== null ? liveProducts : products;

    // Category filter (only for mock data)
    if (categoryParam && liveProducts === null) {
      result = result.filter(p => p.category === categoryParam);
    }

    // Local search: match ANY word from the query (fuzzy word-by-word)
    if (searchParam && liveProducts === null) {
      const words = searchParam.toLowerCase().trim().split(/\s+/).filter(w => w.length > 2);
      if (words.length > 0) {
        result = result.filter(p => {
          const haystack = `${p.title} ${p.category} ${p.brand}`.toLowerCase();
          return words.some(word => haystack.includes(word));
        });
      }
    }

    // Price, rating, local seller, eco & budget filter
    result = result.filter(p => {
      const price = p.price || 0;
      const rating = p.rating || 0;
      const meetsLocal = localSellerOnly ? p.sellerType === 'Local Business' : true;
      const meetsEco = ecoFriendlyOnly ? p.isEcoFriendly === true : true;
      const meetsBudget = budgetFriendlyOnly ? p.isBudgetFriendly === true : true;
      return price >= priceRange[0] && price <= priceRange[1] && rating >= minRating && meetsLocal && meetsEco && meetsBudget;
    });

    if (sortBy === 'lowToHigh') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === 'highToLow') result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [categoryParam, searchParam, priceRange, minRating, sortBy, liveProducts, localSellerOnly, ecoFriendlyOnly, budgetFriendlyOnly]);

  const sourceLabel = () => {
    if (isLoading) return <span className="text-blue-600 font-bold ml-2 animate-pulse">🔍 Searching products...</span>;
    if (apiSource === 'local') return <span className="text-green-600 text-xs font-semibold ml-2 bg-green-50 px-2 py-0.5 rounded-full">📦 Local Database — {filteredProducts.length} items</span>;
    return <span className="text-gray-500 text-sm font-normal ml-2">({filteredProducts.length} items)</span>;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-4 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-2 md:px-4 flex gap-4">

        {/* Sidebar Filters */}
        <div className="hidden md:block w-64 bg-white dark:bg-gray-800 p-4 shadow-sm h-fit sticky top-20 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
            <Filter size={16} />
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 text-xs uppercase text-gray-600">Price</h3>
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>₹0</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Categories (only when no search param) */}
          {!searchParam && (
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-xs uppercase text-gray-600">Categories</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                {categories.map(c => (
                  <li key={c.name} className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = `/products?category=${c.name}`}>
                    <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${categoryParam === c.name ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
                      {categoryParam === c.name && <Check size={10} className="text-white" />}
                    </div>
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {searchParam && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">📦 Database Results</p>
              <p className="text-xs text-blue-500 mt-1">Use Price & Rating filters to narrow results.</p>
            </div>
          )}

          {/* Local Seller Filter */}
          <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
            <h3 className="font-medium mb-2 text-xs uppercase text-emerald-700 dark:text-emerald-400">Shop Local</h3>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocalSellerOnly(!localSellerOnly)}>
              <input
                type="checkbox"
                checked={localSellerOnly}
                onChange={() => setLocalSellerOnly(!localSellerOnly)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Local Businesses Only 🏪</span>
            </div>
          </div>

          {/* Eco-Friendly Filter */}
          <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <h3 className="font-medium mb-2 text-xs uppercase text-green-700 dark:text-green-400">Sustainability</h3>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setEcoFriendlyOnly(!ecoFriendlyOnly)}>
              <input
                type="checkbox"
                checked={ecoFriendlyOnly}
                onChange={() => setEcoFriendlyOnly(!ecoFriendlyOnly)}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">Eco-Friendly Products 🌱</span>
            </div>
          </div>

          {/* Budget Friendly Filter */}
          <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
            <h3 className="font-medium mb-2 text-xs uppercase text-amber-700 dark:text-amber-400">Affordability</h3>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setBudgetFriendlyOnly(!budgetFriendlyOnly)}>
              <input
                type="checkbox"
                checked={budgetFriendlyOnly}
                onChange={() => setBudgetFriendlyOnly(!budgetFriendlyOnly)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Budget Friendly (Under ₹500) 💰</span>
            </div>
          </div>

          {/* Customer Ratings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 text-xs uppercase text-gray-600 dark:text-gray-400">Customer Ratings</h3>
            {[4, 3, 2].map((rating) => (
              <div key={rating} className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setMinRating(minRating === rating ? 0 : rating)}>
                <input
                  type="checkbox"
                  checked={minRating === rating}
                  onChange={() => setMinRating(minRating === rating ? 0 : rating)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{rating}★ & above</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 p-3 mb-4 shadow-sm flex flex-col sm:flex-row justify-between items-center border border-gray-100 dark:border-gray-700">
            <span className="font-medium text-gray-900 dark:text-white mb-2 sm:mb-0">
              {categoryParam ? categoryParam : searchParam ? `Search Results for "${searchParam}"` : 'All Products'}
              {sourceLabel()}
            </span>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Sort By</span>
              <button
                className={`pb-0.5 border-b-2 ${sortBy === 'relevance' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-800 dark:text-gray-400'}`}
                onClick={() => setSortBy('relevance')}
              >
                Relevance
              </button>
              <button
                className={`pb-0.5 border-b-2 ${sortBy === 'lowToHigh' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-800 dark:text-gray-400'}`}
                onClick={() => setSortBy('lowToHigh')}
              >
                Price -- Low to High
              </button>
              <button
                className={`pb-0.5 border-b-2 ${sortBy === 'highToLow' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-800 dark:text-gray-400'}`}
                onClick={() => setSortBy('highToLow')}
              >
                Price -- High to Low
              </button>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : !isLoading ? (
            <div className="bg-white p-12 text-center shadow-sm">
              <img src="https://picsum.photos/seed/empty/200/200" alt="No results" className="mx-auto mb-4 grayscale opacity-50" />
              <h3 className="text-xl font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-2">Try a shorter keyword, like just "top" or "girls top".</p>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default ProductList;