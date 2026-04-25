import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Wallet, Banknote, Smartphone, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';

const Checkout: React.FC = () => {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Step 1: Login
  // Step 2: Address
  // Step 3: Order Summary
  // Step 4: Payment
  const [activeStep, setActiveStep] = useState(2);

  // Payment flow states
  const [paymentMethod, setPaymentMethod] = useState<string|null>(null);
  const [selectedApp, setSelectedApp] = useState<string|null>(null);
  const [selectedBank, setSelectedBank] = useState<string|null>(null);
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pinError, setPinError] = useState('');

  const [address, setAddress] = useState({
    name: user?.name || 'Ayushi Srivastava',
    phone: '9999999999',
    pincode: '560001',
    locality: 'Tech Plaza, Internet City',
    address: '123, Tech Plaza',
    city: 'Web State',
    state: 'Karnataka'
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  if (items.length === 0 && !orderPlaced) {
      navigate('/');
      return null;
  }

  const handlePlaceOrder = async () => {
    if (!user) return;
    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: {
                    name: user.name,
                    email: user.email
                },
                items,
                totalPrice
            })
        });

        if (response.ok) {
            dispatch(clearCart());
            setOrderPlaced(true);
        } else {
            alert('Failed to place order. Please try again.');
        }
    } catch (error) {
        console.error('Failed to place order:', error);
        alert('Failed to place order. Please try again.');
    }
  };

  if (orderPlaced) {
      return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
              <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                  <div className="flex justify-center mb-4">
                      <CheckCircle size={64} className="text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                  <p className="text-gray-500 mb-6">Thank you {user?.name}, your order has been confirmed.</p>
                  <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded font-medium">Continue Shopping</button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
       <div className="max-w-[1000px] mx-auto px-4 flex flex-col md:flex-row gap-6">
           <div className="flex-1 space-y-4">
               
               {/* STEP 1: LOGIN SECTION */}
               <div className="bg-white p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 text-xs mr-4 rounded-sm font-bold">1</span>
                        <div>
                            <span className="font-medium text-gray-500 uppercase text-sm">Login</span>
                            <div className="font-bold text-black flex items-center gap-2">
                                {user?.name} 
                                <span className="text-gray-500 font-normal">{user?.email}</span>
                            </div>
                        </div>
                    </div>
               </div>

               {/* STEP 2: DELIVERY ADDRESS */}
               <div className="bg-white shadow-sm">
                   <div className={`p-4 flex items-center justify-between ${activeStep === 2 ? 'bg-blue-600 text-white' : ''}`}>
                       <div className="flex items-center">
                            <span className={`${activeStep === 2 ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'} px-2 py-0.5 text-xs mr-4 rounded-sm font-bold`}>2</span>
                            <span className={`font-medium uppercase text-sm ${activeStep === 2 ? 'text-white' : 'text-gray-500'}`}>Delivery Address</span>
                       </div>
                       {activeStep > 2 && (
                           <button onClick={() => setActiveStep(2)} className="text-blue-600 font-medium text-sm border border-gray-200 px-4 py-1 rounded-sm">CHANGE</button>
                       )}
                   </div>
                   
                   {activeStep === 2 && (
                       <div className="p-4 pl-12 bg-white text-gray-800">
                           {isEditingAddress ? (
                               <form className="space-y-4 max-w-lg mt-2" onSubmit={(e) => { e.preventDefault(); setIsEditingAddress(false); setActiveStep(3); }}>
                                   <div className="grid grid-cols-2 gap-4">
                                       <input type="text" placeholder="Name" required className="border border-gray-300 p-2 rounded text-sm w-full outline-blue-500" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
                                       <input type="text" placeholder="10-digit mobile number" required className="border border-gray-300 p-2 rounded text-sm w-full outline-blue-500" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                       <input type="text" placeholder="Pincode" required className="border border-gray-300 p-2 rounded text-sm w-full outline-blue-500" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                                       <input type="text" placeholder="Locality" required className="border border-gray-300 p-2 rounded text-sm w-full outline-blue-500" value={address.locality} onChange={e => setAddress({...address, locality: e.target.value})} />
                                   </div>
                                   <textarea placeholder="Address (Area and Street)" required className="border border-gray-300 p-2 rounded text-sm w-full outline-blue-500" rows={3} value={address.address} onChange={e => setAddress({...address, address: e.target.value})} />
                                   <div className="grid grid-cols-2 gap-4">
                                       <input type="text" placeholder="City/District/Town" required className="border border-gray-300 p-2 rounded text-sm w-full outline-blue-500" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                                       <input type="text" placeholder="State" required className="border border-gray-300 p-2 rounded text-sm w-full outline-blue-500" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                                   </div>
                                   <div className="flex items-center gap-4 mt-4">
                                       <button type="submit" className="bg-[#fb641b] text-white px-8 py-3 text-sm font-bold uppercase rounded-sm shadow hover:shadow-md transition">Save and Deliver Here</button>
                                       <button type="button" onClick={() => setIsEditingAddress(false)} className="text-blue-600 font-medium px-4 text-sm uppercase">Cancel</button>
                                   </div>
                               </form>
                           ) : (
                               <div className="flex justify-between items-start">
                                   <div>
                                       <p className="font-bold mb-1">{address.name} <span className="ml-4 bg-gray-200 text-gray-600 text-xs px-2 rounded">HOME</span></p>
                                       <p className="text-sm text-gray-700">{address.address}, {address.locality}, {address.city}, {address.state} - <span className="font-bold">{address.pincode}</span></p>
                                       <p className="text-sm text-gray-700 font-bold mt-2">{address.phone}</p>
                                       <button 
                                         onClick={() => setActiveStep(3)}
                                         className="bg-[#fb641b] text-white px-8 py-3 text-sm font-bold uppercase mt-6 rounded-sm shadow hover:shadow-md transition">
                                           Deliver Here
                                       </button>
                                   </div>
                                   <button onClick={() => setIsEditingAddress(true)} className="text-blue-600 font-medium text-sm border border-gray-200 px-4 py-1 rounded-sm uppercase">Edit</button>
                               </div>
                           )}
                       </div>
                   )}
                   {activeStep > 2 && (
                       <div className="px-4 pb-4 pl-12 flex">
                           <p className="text-sm text-gray-800 font-bold">{address.name} <span className="font-normal pl-2">{address.address}, {address.city}... - {address.pincode}</span></p>
                       </div>
                   )}
               </div>

               {/* STEP 3: ORDER SUMMARY */}
               <div className="bg-white shadow-sm">
                   <div className={`p-4 flex items-center justify-between ${activeStep === 3 ? 'bg-blue-600 text-white' : ''}`}>
                       <div className="flex items-center">
                            <span className={`${activeStep === 3 ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'} px-2 py-0.5 text-xs mr-4 rounded-sm font-bold`}>3</span>
                            <span className={`font-medium uppercase text-sm ${activeStep === 3 ? 'text-white' : 'text-gray-500'}`}>Order Summary</span>
                       </div>
                       {activeStep > 3 && (
                           <button onClick={() => setActiveStep(3)} className="text-blue-600 font-medium text-sm border border-gray-200 px-4 py-1 rounded-sm">CHANGE</button>
                       )}
                   </div>

                   {activeStep === 3 && (
                       <div className="p-4 pl-12 flex flex-col gap-4 bg-white">
                           {items.map(item => (
                               <div key={item.id} className="flex gap-4">
                                   <img src={item.image} alt={item.title} className="w-20 h-20 object-contain" />
                                   <div>
                                       <p className="text-base font-medium text-gray-800">{item.title}</p>
                                       <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                       <p className="font-bold text-lg mt-2">₹{item.price.toLocaleString()}</p>
                                   </div>
                               </div>
                           ))}
                           <div className="border-t border-gray-200 mt-2 pt-4">
                               <button 
                                 onClick={() => setActiveStep(4)}
                                 className="bg-[#fb641b] text-white px-10 py-3 text-base font-bold uppercase rounded-sm shadow hover:shadow-md transition pull-right">
                                   Continue
                               </button>
                           </div>
                       </div>
                   )}
                   {activeStep > 3 && (
                       <div className="px-4 pb-4 pl-12 flex">
                           <p className="text-sm font-bold">{items.length} Item(s)</p>
                       </div>
                   )}
               </div>
               
               {/* STEP 4: PAYMENT OPTIONS */}
               <div className="bg-white shadow-sm">
                    <div className={`p-4 flex items-center ${activeStep === 4 ? 'bg-blue-600 text-white' : ''}`}>
                        <span className={`${activeStep === 4 ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'} px-2 py-0.5 text-xs mr-4 rounded-sm font-bold`}>4</span>
                        <span className={`font-medium uppercase text-sm ${activeStep === 4 ? 'text-white' : 'text-gray-500'}`}>Payment Options</span>
                   </div>

                   {activeStep === 4 && (
                       <div className="p-4 pl-12 space-y-3 bg-white">

                         {/* Payment Method Selection */}
                         {['UPI', 'Wallets', 'Credit / Debit / ATM Card', 'Cash on Delivery'].map(method => (
                           <label key={method} onClick={() => { setPaymentMethod(method); setSelectedApp(null); setSelectedBank(null); setPin(''); setPinError(''); }}
                             className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-all ${
                               paymentMethod === method ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                             }`}>
                             <input type="radio" name="payment" checked={paymentMethod === method} readOnly className="w-4 h-4 text-blue-600" />
                             <div className="flex items-center gap-2">
                               {method === 'UPI' && <Smartphone size={18} className="text-purple-600" />}
                               {method === 'Wallets' && <Wallet size={18} className="text-orange-500" />}
                               {method === 'Credit / Debit / ATM Card' && <CreditCard size={18} className="text-blue-600" />}
                               {method === 'Cash on Delivery' && <Banknote size={18} className="text-green-600" />}
                               <span className="text-sm font-medium">{method}</span>
                             </div>
                           </label>
                         ))}

                         {/* UPI App Selection */}
                         {paymentMethod === 'UPI' && !selectedApp && (
                           <div className="ml-8 mt-2 p-4 bg-purple-50 rounded-lg border border-purple-200 animate-in">
                             <p className="text-sm font-bold text-purple-800 mb-3">Choose UPI App</p>
                             <div className="grid grid-cols-2 gap-3">
                               {['Google Pay', 'Paytm', 'PhonePe', 'BHIM UPI'].map(app => (
                                 <button key={app} onClick={() => setSelectedApp(app)}
                                   className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all text-sm font-medium">
                                   <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                     {app[0]}
                                   </span>
                                   {app}
                                 </button>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Wallets Selection */}
                         {paymentMethod === 'Wallets' && !selectedApp && (
                           <div className="ml-8 mt-2 p-4 bg-orange-50 rounded-lg border border-orange-200">
                             <p className="text-sm font-bold text-orange-800 mb-3">Choose Wallet</p>
                             <div className="grid grid-cols-2 gap-3">
                               {['Paytm Wallet', 'Mobikwik', 'Freecharge', 'JioMoney'].map(w => (
                                 <button key={w} onClick={() => { setSelectedApp(w); setSelectedBank('wallet'); }}
                                   className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all text-sm font-medium">
                                   <span className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                                     {w[0]}
                                   </span>
                                   {w}
                                 </button>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Card Details */}
                         {paymentMethod === 'Credit / Debit / ATM Card' && !selectedBank && (
                           <div className="ml-8 mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                             <p className="text-sm font-bold text-blue-800 mb-3">Select Your Bank</p>
                             <div className="space-y-2">
                               {['State Bank of India', 'Punjab National Bank', 'Axis Bank', 'Indian Bank', 'HDFC Bank', 'ICICI Bank'].map(bank => (
                                 <button key={bank} onClick={() => { setSelectedApp('Card'); setSelectedBank(bank); }}
                                   className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow transition-all text-sm">
                                   <span className="font-medium">{bank}</span>
                                   <ChevronRight size={16} className="text-gray-400" />
                                 </button>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Bank Selection for UPI */}
                         {paymentMethod === 'UPI' && selectedApp && !selectedBank && (
                           <div className="ml-8 mt-2 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                             <p className="text-sm font-bold text-indigo-800 mb-1">Paying via {selectedApp}</p>
                             <p className="text-xs text-indigo-600 mb-3">Select your bank account</p>
                             <div className="space-y-2">
                               {['State Bank of India', 'Punjab National Bank', 'Axis Bank', 'Indian Bank', 'HDFC Bank', 'ICICI Bank'].map(bank => (
                                 <button key={bank} onClick={() => setSelectedBank(bank)}
                                   className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow transition-all text-sm">
                                   <span className="font-medium">{bank}</span>
                                   <ChevronRight size={16} className="text-gray-400" />
                                 </button>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* PIN Entry (for UPI & Card) */}
                         {selectedBank && selectedBank !== 'wallet' && !isProcessing && (
                           <div className="ml-8 mt-2 p-5 bg-gray-900 rounded-xl border border-gray-700 text-white">
                             <div className="flex items-center gap-2 mb-4">
                               <ShieldCheck size={20} className="text-green-400" />
                               <p className="text-sm font-bold">Secure Payment — {selectedBank}</p>
                             </div>
                             <p className="text-xs text-gray-400 mb-3">Enter your {paymentMethod === 'UPI' ? 'UPI' : 'ATM'} PIN to authorize ₹{totalPrice.toLocaleString()}</p>
                             <div className="flex gap-2 mb-3">
                               {[0,1,2,3].map(i => (
                                 <div key={i} className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${
                                   pin.length > i ? 'border-green-400 bg-green-900/30' : 'border-gray-600 bg-gray-800'
                                 }`}>
                                   {pin.length > i ? '●' : ''}
                                 </div>
                               ))}
                             </div>
                             <input type="password" maxLength={4} value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g,'')); setPinError(''); }}
                               placeholder="Enter 4-digit PIN" className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-center text-lg tracking-[0.5em] text-white placeholder:text-gray-500 placeholder:tracking-normal outline-none focus:border-blue-500" />
                             {pinError && <p className="text-red-400 text-xs mt-2">{pinError}</p>}
                             <button onClick={() => {
                               if (pin.length !== 4) { setPinError('Please enter a valid 4-digit PIN'); return; }
                               setIsProcessing(true);
                               setTimeout(() => { handlePlaceOrder(); }, 2500);
                             }} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors">
                               Pay ₹{totalPrice.toLocaleString()}
                             </button>
                           </div>
                         )}

                         {/* Wallet direct pay */}
                         {selectedBank === 'wallet' && !isProcessing && (
                           <div className="ml-8 mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
                             <p className="text-sm font-bold text-green-800 mb-2">Pay ₹{totalPrice.toLocaleString()} via {selectedApp}</p>
                             <button onClick={() => { setIsProcessing(true); setTimeout(() => handlePlaceOrder(), 2500); }}
                               className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-sm uppercase transition-colors">
                               Confirm & Pay
                             </button>
                           </div>
                         )}

                         {/* Cash on Delivery */}
                         {paymentMethod === 'Cash on Delivery' && (
                           <div className="ml-8 mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
                             <p className="text-sm text-green-700 mb-3">Pay ₹{totalPrice.toLocaleString()} when your order is delivered.</p>
                             <button onClick={() => { setIsProcessing(true); setTimeout(() => handlePlaceOrder(), 1500); }}
                               className="w-full bg-[#fb641b] hover:bg-orange-600 text-white py-3 rounded-lg font-bold text-sm uppercase transition-colors">
                               Place Order
                             </button>
                           </div>
                         )}

                         {/* Processing Animation */}
                         {isProcessing && (
                           <div className="ml-8 mt-2 p-8 bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center">
                             <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                             <p className="text-sm font-bold text-gray-800">Processing Payment...</p>
                             <p className="text-xs text-gray-500 mt-1">Please do not press back or refresh</p>
                           </div>
                         )}
                       </div>
                   )}
               </div>
           </div>

           {/* Sidebar Price Summary */}
           <div className="md:w-1/3">
               <div className="bg-white p-4 shadow-sm sticky top-4">
                   <h3 className="text-gray-500 font-bold text-base uppercase border-b pb-4 mb-4">Price Details</h3>
                   <div className="space-y-4">
                        <div className="flex justify-between">
                            <span>Price ({items.length} items)</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Charges</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="border-t border-dashed my-2"></div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total Payable</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default Checkout;