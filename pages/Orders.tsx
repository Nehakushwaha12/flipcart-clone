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
    return <div className="min-h-screen bg-gray-100 py-6 flex justify-center items-center"><p>Loading orders...</p></div>;
  }

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center items-center">
             <p className="text-gray-600 mb-4">Please login to view your orders.</p>
             <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded font-medium">Login</Link>
        </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-[1000px] mx-auto px-4">
        <h1 className="text-lg font-medium mb-4 text-gray-800">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
             <div key={order._id} className="bg-white p-4 shadow-sm rounded-sm hover:shadow-md transition cursor-pointer border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Order Items */}
                    <div className="flex-1">
                        {order.items.map((item: any, idx: number) => (
                             <div key={idx} className="flex gap-4 mb-4 last:mb-0">
                                 <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                                     <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain"/>
                                 </div>
                                 <div className="flex-1">
                                     <h3 className="font-medium text-sm text-gray-800 hover:text-blue-600 truncate max-w-md">{item.title}</h3>
                                     <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity || 1}</p>
                                 </div>
                             </div>
                        ))}
                    </div>

                    {/* Order Meta */}
                    <div className="md:w-1/3 flex flex-col justify-between pl-0 md:pl-4 border-l-0 md:border-l border-gray-100">
                         <div>
                            <p className="font-bold text-sm text-gray-900">₹{order.totalPrice?.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium text-gray-800">{order.status} on {new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-4">Your item has been delivered</p>
                         </div>
                    </div>
                </div>
             </div>
          ))}
          
          {orders.length === 0 && (
              <div className="bg-white p-8 text-center shadow-sm">
                  <p className="text-gray-500">No orders found.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
