import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/orders?email=${user.email}`);
        if (response.ok) {
           const data = await response.json();
           setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-[#fffbeb] py-12 flex justify-center items-center"><p className="font-black uppercase tracking-widest text-black/40">Loading orders...</p></div>;
  }

  if (!user) {
    return (
        <div className="min-h-screen bg-[#fffbeb] py-12 flex flex-col justify-center items-center p-6">
             <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-md w-full border border-amber-50">
                <p className="text-black/60 mb-8 font-bold uppercase tracking-widest text-sm">Please login to view your orders.</p>
                <Link to="/login" className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all">Login Now</Link>
             </div>
        </div>
    );
  }

  return (
    <div className="bg-[#fffbeb] min-h-screen py-12 transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-3xl font-black mb-10 text-black uppercase tracking-tighter">My Orders History</h1>
        <div className="space-y-8">
          {orders.map((order) => (
             <div key={order._id} className="bg-white p-8 shadow-xl shadow-amber-200/20 rounded-[2.5rem] hover:scale-[1.01] transition-all cursor-pointer border border-amber-50 group">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Order Items */}
                    <div className="flex-1 space-y-6">
                        {order.items.map((item: any, idx: number) => (
                             <div key={idx} className="flex gap-6 items-center">
                                 <div className="w-20 h-20 bg-amber-50 rounded-2xl p-3 shrink-0 flex items-center justify-center shadow-inner group-hover:rotate-3 transition-transform duration-500">
                                     <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain"/>
                                 </div>
                                 <div className="flex-1">
                                     <h3 className="font-black text-base text-black leading-tight tracking-tighter group-hover:text-amber-600 transition-colors">{item.title}</h3>
                                     <p className="text-[10px] font-black text-black/40 mt-1 uppercase tracking-widest">Quantity: {item.quantity || 1}</p>
                                 </div>
                             </div>
                        ))}
                    </div>

                    {/* Order Meta */}
                    <div className="lg:w-1/3 flex flex-col justify-between p-8 bg-amber-50/50 rounded-[2rem] border border-amber-50">
                          <div>
                            <p className="font-black text-3xl text-black tracking-tighter">₹{order.totalPrice?.toLocaleString()}</p>
                            
                            <p className="text-[10px] text-black/50 mt-4 font-black uppercase tracking-[0.2em]">
                                Ordered On: {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>

                            <div className="flex items-center gap-3 mt-4">
                                <div className={`w-3 h-3 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}></div>
                                <span className="text-sm font-black text-black uppercase tracking-widest">
                                    {order.status === 'Delivered' ? 'Delivered On' : 'Arriving by'} {new Date(order.expectedDelivery || order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <p className="text-[10px] text-black/40 mt-2 font-black uppercase tracking-[0.2em]">
                                {order.status === 'Delivered' ? 'Package safely arrived' : `Current Status: ${order.status}`}
                            </p>
                            
                            {/* Tracking Progress Bar */}
                            <div className="mt-8">
                                <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-inner border border-amber-100">
                                    <div className={`h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000 ${order.status === 'Delivered' ? 'w-full' : 'w-1/3'}`}></div>
                                </div>
                                <div className="flex justify-between text-[9px] text-black/30 mt-3 uppercase font-black tracking-widest">
                                    <span>Placed</span>
                                    <span>Shipped</span>
                                    <span>Arrived</span>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
             </div>
          ))}
          
          {orders.length === 0 && (
              <div className="bg-white p-20 text-center shadow-xl shadow-amber-200/20 rounded-[3rem] border border-amber-50">
                  <p className="text-black/40 font-black uppercase tracking-[0.3em] text-lg">No order history found.</p>
                  <Link to="/" className="mt-8 inline-block bg-black text-white px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">Start Shopping</Link>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
