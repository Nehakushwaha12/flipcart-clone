import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromCart, updateQuantity } from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ShoppingCart } from 'lucide-react';

const Cart: React.FC = () => {
  const { items, totalPrice, totalQuantity } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffbeb] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-amber-200/50 text-center max-w-md w-full border border-amber-50">
            <div className="w-48 h-48 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
               <ShoppingCart size={80} className="text-amber-500" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-black uppercase tracking-tighter">Your cart is empty!</h2>
            <p className="text-black/60 mb-10 font-bold uppercase tracking-widest text-xs">Add items to it now to start your makeover.</p>
            <Link to="/" className="bg-black text-white px-12 py-5 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all inline-block uppercase tracking-widest text-sm">Shop Now</Link>
        </div>
      </div>
    );
  }

  const discountAmount = items.reduce((acc, item) => acc + (item.originalPrice - item.price) * item.quantity, 0);
  const originalTotalPrice = items.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);

  const studentDiscount = user?.isStudent ? Math.floor(totalPrice * 0.10) : 0;
  const finalTotalPrice = totalPrice - studentDiscount;

  return (
    <div className="bg-[#fffbeb] dark:bg-gray-950 min-h-screen py-12 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-10">
        
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-amber-200/30 mb-8 border border-amber-50 dark:border-gray-800 overflow-hidden">
            <div className="p-8 border-b border-amber-50 dark:border-gray-800 bg-gradient-to-r from-amber-50 to-white dark:from-gray-900 dark:to-gray-800">
                 <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">My Cart ({totalQuantity})</h2>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="p-10 border-b border-amber-50 dark:border-gray-800 flex flex-col sm:flex-row gap-10 hover:bg-amber-50/30 transition-colors group">
                <div className="w-32 h-32 shrink-0 bg-[#fffdf5] rounded-[2rem] p-4 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                  <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-black text-black dark:text-gray-100 mb-2 hover:text-amber-600 transition-colors cursor-pointer leading-tight">{item.title}</h3>
                  <div className="text-xs font-black text-black/50 mb-4 uppercase tracking-widest flex items-center gap-2">
                    Seller: {item.sellerType === 'Local Business' ? 'Local Business 🏪' : 'Apna Store'} 
                    <span className="bg-amber-500 text-white px-2 py-0.5 rounded-lg text-[10px]">ASSURED</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-2xl font-black text-black dark:text-white">₹{item.price.toLocaleString()}</span>
                    <span className="text-black/30 dark:text-gray-400 line-through text-sm font-bold">₹{item.originalPrice.toLocaleString()}</span>
                    <span className="text-amber-500 text-sm font-black uppercase tracking-tighter">{item.discount}% Off</span>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4 bg-amber-50 dark:bg-gray-800 p-2 rounded-2xl border border-amber-100 dark:border-gray-700">
                          <button 
                              className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white flex items-center justify-center disabled:opacity-50 shadow-md hover:bg-amber-500 hover:text-white transition-all font-black"
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Number(item.quantity) - 1 }))}
                              disabled={Number(item.quantity) <= 1}
                          >
                              -
                          </button>
                          <span className="w-8 text-center font-black text-black dark:text-white">{item.quantity}</span>
                          <button 
                               className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white flex items-center justify-center shadow-md hover:bg-amber-500 hover:text-white transition-all font-black disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                               onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Number(item.quantity) + 1 }))}
                               disabled={Number(item.quantity) >= item.stock}
                          >
                              +
                          </button>
                      </div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${item.stock < 10 ? 'text-red-500 animate-pulse' : 'text-emerald-600'}`}>
                        {item.stock < 10 ? `Only ${item.stock} units left!` : `${item.stock} items in stock`}
                      </p>
                    </div>
                    <button 
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-xs font-black text-black/40 hover:text-red-500 uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                    >
                        Remove Item
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-8 bg-gradient-to-b from-transparent to-amber-50/30 dark:to-gray-800/30 flex justify-end">
                <button 
                    onClick={handleCheckout}
                    className="bg-black text-white py-5 px-16 text-lg font-black uppercase tracking-widest rounded-[1.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    Checkout Now
                </button>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className="lg:w-1/3">
           <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-amber-200/40 sticky top-28 border border-amber-50 dark:border-gray-800 overflow-hidden">
               <div className="p-8 border-b border-amber-50 dark:border-gray-700 bg-amber-50/50 dark:bg-gray-800/50">
                   <h3 className="text-black font-black text-sm uppercase tracking-[0.3em]">Price Summary</h3>
               </div>
               <div className="p-8 flex flex-col gap-6">
                   <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                       <span className="text-black/60 dark:text-gray-400">Total Price ({totalQuantity} items)</span>
                       <span className="text-black dark:text-gray-200">₹{originalTotalPrice.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                       <span className="text-black/60">Discount</span>
                       <span className="text-emerald-500">- ₹{discountAmount.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                       <span className="text-black/60 dark:text-gray-400">Delivery</span>
                       <span className="text-emerald-500">FREE</span>
                   </div>
                   {user?.isStudent && (
                     <div className="flex justify-between items-center bg-amber-500/10 dark:bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
                         <span className="text-amber-600 dark:text-amber-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">🎓 Student Reward</span>
                         <span className="text-amber-600 font-black">- ₹{studentDiscount.toLocaleString()}</span>
                     </div>
                   )}
                   <div className="border-t-2 border-dashed border-amber-100 my-4 dark:border-gray-700"></div>
                   <div className="flex justify-between items-center">
                       <span className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Total Amount</span>
                       <span className="text-3xl font-black text-black dark:text-white tracking-tighter">₹{finalTotalPrice.toLocaleString()}</span>
                   </div>
                   <div className="border-t-2 border-dashed border-amber-100 my-4 dark:border-gray-700"></div>
                   <p className="text-emerald-500 font-black text-xs uppercase tracking-widest text-center animate-pulse">
                       You save ₹{(discountAmount + studentDiscount).toLocaleString()} on this order!
                   </p>
               </div>
               <div className="p-8 bg-amber-50 dark:bg-gray-800/50 text-[10px] text-black/50 font-bold uppercase tracking-widest flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                       <ShieldCheck size={24} className="text-amber-500" />
                    </div>
                    <p className="leading-relaxed">Safe and Secure Payments. 100% Authentic products from ApnaStore.</p>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;