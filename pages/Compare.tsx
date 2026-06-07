import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromCompare, clearCompare } from '../redux/compareSlice';
import { X, Scale, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Compare: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.compare);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Scale size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No products to compare</h2>
        <p className="text-gray-600 mb-8">Add products from the listing page to compare them side-by-side.</p>
        <Link to="/products" className="bg-pink-600 text-white px-8 py-3 rounded-sm font-bold shadow-md hover:bg-pink-700 transition-all">
          BROWSE PRODUCTS
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Product Comparison ({items.length}/4)</h1>
        <button 
          onClick={() => dispatch(clearCompare())}
          className="text-pink-600 font-bold hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-100 bg-gray-50 w-1/5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Features</th>
              {items.map(item => (
                <th key={item.id} className="p-4 border-b border-gray-100 w-1/5 min-w-[200px] relative">
                  <button 
                    onClick={() => dispatch(removeFromCompare(item.id))}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                  <img src={item.image} alt={item.title} className="h-32 mx-auto object-contain mb-4" />
                  <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.title}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-gray-100 font-bold text-gray-600 bg-gray-50 text-sm">Price</td>
              {items.map(item => (
                <td key={item.id} className="p-4 border-b border-gray-100 text-center font-bold text-lg text-gray-900">
                  ₹{item.price.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-100 font-bold text-gray-600 bg-gray-50 text-sm">Rating</td>
              {items.map(item => (
                <td key={item.id} className="p-4 border-b border-gray-100 text-center">
                  <div className="inline-flex items-center bg-[#388e3c] text-white px-2 py-0.5 rounded-[3px] text-xs gap-1 font-bold">
                    {item.rating} <Star size={12} fill="currentColor" />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{item.reviewCount.toLocaleString()} Reviews</p>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-100 font-bold text-gray-600 bg-gray-50 text-sm">Brand</td>
              {items.map(item => (
                <td key={item.id} className="p-4 border-b border-gray-100 text-center text-sm font-medium text-gray-700">
                  {item.brand}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-100 font-bold text-gray-600 bg-gray-50 text-sm">Category</td>
              {items.map(item => (
                <td key={item.id} className="p-4 border-b border-gray-100 text-center text-sm text-gray-600">
                  {item.category}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-100 font-bold text-gray-600 bg-gray-50 text-sm">Discount</td>
              {items.map(item => (
                <td key={item.id} className="p-4 border-b border-gray-100 text-center text-sm font-bold text-[#388e3c]">
                  {item.discount}% OFF
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-100 font-bold text-gray-600 bg-gray-50 text-sm">Action</td>
              {items.map(item => (
                <td key={item.id} className="p-4 border-b border-gray-100 text-center">
                  <Link to={`/product/${item.id}`} className="inline-block bg-pink-600 text-white px-4 py-2 rounded-sm font-bold text-xs shadow-sm hover:bg-pink-700 transition-all">
                    VIEW DETAILS
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
