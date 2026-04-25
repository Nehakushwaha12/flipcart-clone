import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

interface AIRecommendationsProps {
  context: 'home' | 'cart' | 'product';
  currentCategory?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ context, currentCategory }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { items } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // AI Logic Simulation: Determine what category to fetch based on context
        let searchCategory = currentCategory || '';
        
        if (!searchCategory && items.length > 0) {
          // Find the most common category in the cart
          const categories = items.map(i => i.category);
          searchCategory = categories.sort((a,b) =>
            categories.filter(v => v===a).length - categories.filter(v => v===b).length
          ).pop() || '';
        }

        // Fetch from backend
        let url = `http://localhost:5000/api/products?`;
        if (searchCategory) {
           url += `category=${encodeURIComponent(searchCategory)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        // Simulate AI "picking" the best matches (highest rated + discount)
        const sorted = data.sort((a: any, b: any) => (b.rating * b.discount) - (a.rating * a.discount));
        setRecommendations(sorted.slice(0, 4));
      } catch (err) {
        console.error("AI Recommendation Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [items, currentCategory]);

  if (loading || recommendations.length === 0) return null;

  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-purple-500 animate-pulse" size={24} />
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
          Smart AI Recommendations
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
