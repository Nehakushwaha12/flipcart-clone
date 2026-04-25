import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { getProductById } from '../services/mockData';
import { ShoppingCart, Zap, Star, Tag, ChevronRight, Loader2 } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);

      // Try mock data first
      let found: any = getProductById(Number(id));

      // Try localStorage cache
      if (!found && id) {
        const liveProducts = JSON.parse(localStorage.getItem('liveProducts') || '{}');
        found = liveProducts[id] || null;
      }

      // Fetch from backend API
      if (!found && id) {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${encodeURIComponent(id)}`);
          if (res.ok) {
            found = await res.json();
          }
        } catch (err) {
          console.error('Failed to fetch product from backend:', err);
        }
      }

      // Normalize fields
      if (found) {
        found = {
          images: [],
          description: found.title,
          reviewCount: found.reviewCount || found.reviews || 0,
          originalPrice: found.originalPrice || Math.round((found.price || 0) * 1.2),
          discount: found.discount || 10,
          isAssured: found.isAssured || false,
          ...found,
        };
      }

      setProduct(found);
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (product?.image) setActiveImage(product.image);
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Product not found</h2>
        <p className="text-gray-500 mb-4">Try searching for the product again.</p>
        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">Go Back</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleBuyNow = () => {
    dispatch(addToCart(product));
    navigate('/cart');
  };

  return (
    <div className="bg-gray-100 min-h-screen py-4">
      <div className="max-w-[1400px] mx-auto bg-white shadow-sm flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left: Images & Actions */}
        <div className="md:w-5/12 p-4 flex flex-col relative">
          <div className="flex-1 flex gap-2 mb-4 h-[450px]">
            {/* Thumbnails */}
            <div className="w-16 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
               <div 
                  className={`border p-1 cursor-pointer ${activeImage === product.image ? 'border-blue-600' : 'border-gray-200'}`}
                  onMouseEnter={() => setActiveImage(product.image)}
                >
                  <img src={product.image} className="w-full object-contain" alt="" />
                </div>
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`border p-1 cursor-pointer ${activeImage === img ? 'border-blue-600' : 'border-gray-200'}`}
                  onMouseEnter={() => setActiveImage(img)}
                >
                  <img src={img} className="w-full object-contain" alt="" />
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center p-4 border border-gray-100 relative">
               <div className="absolute top-4 right-4 text-gray-400">
                    <div className="p-2 rounded-full border border-gray-200 hover:shadow shadow-sm cursor-pointer">
                        <svg className="w-6 h-6 fill-current text-gray-400 hover:text-red-500" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </div>
               </div>
              <img src={activeImage || product.image} alt={product.title} className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110 cursor-zoom-in" />
            </div>
          </div>
          
          <div className="flex gap-4 mt-auto sticky bottom-0 bg-white md:static z-20">
            <button 
              onClick={handleAddToCart}
              className="flex-1 py-4 bg-[#ff9f00] text-white font-bold text-lg uppercase shadow-sm hover:shadow-md transition flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} fill="currentColor" /> Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 py-4 bg-[#fb641b] text-white font-bold text-lg uppercase shadow-sm hover:shadow-md transition flex items-center justify-center gap-2"
            >
              <Zap size={20} fill="currentColor" /> Buy Now
            </button>
          </div>
        </div>

        {/* Right: Info */}
        <div className="md:w-7/12 p-6 md:pl-0">
          <div className="text-gray-500 text-xs font-medium flex items-center gap-1 mb-2">
            Home <ChevronRight size={12}/> {product.category} <ChevronRight size={12}/> {product.brand}
          </div>

          <h1 className="text-xl text-gray-800 mb-2">{product.title}</h1>
          
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-green-600 text-white text-sm px-2 py-0.5 rounded-sm flex items-center gap-1 font-bold">
                {product.rating} <Star size={12} fill="white" />
             </div>
             <span className="text-gray-500 font-medium text-sm">{product.reviewCount.toLocaleString()} Ratings & reviews</span>
             {product.isAssured && <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="h-5 ml-2" alt="Assured" />}
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              <span className="text-gray-500 line-through text-lg">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-green-600 font-bold text-lg">{product.discount}% off</span>
            </div>
          </div>

          <div className="mb-6">
             <h3 className="font-medium text-sm text-gray-800 mb-2">Available Offers</h3>
             <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                    <Tag size={16} className="text-green-600 mt-0.5 shrink-0"/>
                    <span>Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</span>
                </li>
                <li className="flex items-start gap-2">
                    <Tag size={16} className="text-green-600 mt-0.5 shrink-0"/>
                    <span>Bank Offer 10% Off on Bank of Baroda Mastercard debit card first time transaction, Terms and Condition apply</span>
                </li>
                <li className="flex items-start gap-2">
                    <Tag size={16} className="text-green-600 mt-0.5 shrink-0"/>
                    <span>Special Price Get extra 15% off (price inclusive of discount)</span>
                </li>
             </ul>
          </div>

          <div className="border text-gray-600 p-4 mb-6 text-sm">
             <div className="flex mb-4">
                 <span className="w-24 text-gray-500 font-medium">Description</span>
                 <p className="flex-1">{product.description}</p>
             </div>
              <div className="flex mb-4">
                 <span className="w-24 text-gray-500 font-medium">Brand</span>
                 <p className="flex-1">{product.brand}</p>
             </div>
             <div className="flex">
                 <span className="w-24 text-gray-500 font-medium">Warranty</span>
                 <p className="flex-1">1 Year Manufacturer Warranty</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;