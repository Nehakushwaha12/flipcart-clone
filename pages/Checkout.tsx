import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Wallet, Banknote, Smartphone, ChevronRight, Loader2, ShieldCheck, MapPin } from 'lucide-react';

const STATES_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"],
  "Arunachal Pradesh": ["Itanagar"],
  "Assam": ["Guwahati"],
  "Bihar": ["Patna", "Muzaffarpur", "Gaya", "Darbhanga", "Bhagalpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Durg", "Bilaspur", "Korba", "Jagdalpur"],
  "Goa": ["Panaji", "Margao"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Haryana": [], 
  "Himachal Pradesh": ["Shimla"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Rewa", "Satna", "Ujjain", "Sagar"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kolhapur"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Puri"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Mohali"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"],
  "Telangana": ["Hyderabad", "Warangal"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Noida", "Ghaziabad", "Meerut", "Gorakhpur", "Aligarh", "Bareilly"],
  "Uttarakhand": ["Dehradun", "Haridwar"],
  "West Bengal": ["Kolkata", "Siliguri", "Durgapur", "Asansol", "Howrah"],
  "Delhi": ["Delhi"],
  "Jammu and Kashmir": ["Jammu", "Srinagar"]
};

const STATES = Object.keys(STATES_CITIES).sort();
const ALL_CITIES = Object.values(STATES_CITIES).flat().sort();

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
    locality: '',
    address: '',
    state: '',
    city: ''
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Function to auto-fill State and City from Pincode
  const handlePincodeChange = async (val: string) => {
    setAddress({ ...address, pincode: val });
    if (val.length === 6 && /^\d+$/.test(val)) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          const fetchedState = postOffice.State;
          const fetchedCity = postOffice.District;
          
          setAddress(prev => ({
            ...prev,
            state: fetchedState || prev.state,
            city: fetchedCity || prev.city
          }));
        }
      } catch (err) {
        console.error('Failed to fetch pincode details');
      }
    }
  };

  // Function to Auto Detect Location
  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();
        
        if (data && data.address) {
          const pincode = data.address.postcode || '';
          const state = data.address.state || '';
          const city = data.address.city || data.address.state_district || data.address.county || '';
          
          setAddress(prev => ({
            ...prev,
            pincode: pincode || prev.pincode,
            state: state || prev.state,
            city: city || prev.city,
            locality: data.address.suburb || data.address.neighbourhood || prev.locality
          }));
        }
      } catch (err) {
        alert('Failed to detect location. Please enter manually.');
      } finally {
        setIsDetecting(false);
      }
    }, () => {
      alert('Location permission denied. Please enter manually.');
      setIsDetecting(false);
    });
  };

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
          <div className="min-h-screen bg-[#fffbeb] flex items-center justify-center p-6">
              <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-amber-200/50 text-center max-w-md w-full border border-amber-50">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle size={64} className="text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-black mb-4 text-black uppercase tracking-tighter">Order Placed!</h2>
                  <p className="text-black/60 mb-10 font-bold uppercase tracking-widest text-xs">Thank you {user?.name}, your order has been confirmed.</p>
                  <button onClick={() => navigate('/')} className="bg-black text-white px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all">Continue Shopping</button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#fffbeb] py-12 transition-colors duration-500">
       <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-10">
           <div className="flex-1 space-y-6">
               
               {/* STEP 1: LOGIN SECTION */}
               <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-amber-100/30 flex items-center justify-between border border-amber-50">
                    <div className="flex items-center">
                        <span className="bg-amber-100 text-amber-700 w-8 h-8 flex items-center justify-center rounded-full text-xs mr-6 font-black">1</span>
                        <div>
                            <span className="font-black text-black/40 uppercase text-[10px] tracking-widest">Login</span>
                            <div className="font-black text-black flex items-center gap-2 text-lg tracking-tighter">
                                {user?.name} 
                                <span className="text-black/30 font-bold text-sm tracking-normal">{user?.email}</span>
                            </div>
                        </div>
                    </div>
               </div>

               {/* STEP 2: DELIVERY ADDRESS */}
               <div className="bg-white rounded-[2rem] shadow-xl shadow-amber-100/30 overflow-hidden border border-amber-50">
                   <div className={`p-8 flex items-center justify-between ${activeStep === 2 ? 'bg-black text-white' : 'bg-white'}`}>
                       <div className="flex items-center">
                            <span className={`${activeStep === 2 ? 'bg-amber-500 text-black' : 'bg-amber-100 text-amber-700'} w-8 h-8 flex items-center justify-center rounded-full text-xs mr-6 font-black`}>2</span>
                            <span className={`font-black uppercase text-sm tracking-widest ${activeStep === 2 ? 'text-white' : 'text-black/40'}`}>Delivery Address</span>
                       </div>
                       {activeStep > 2 && (
                           <button onClick={() => setActiveStep(2)} className="text-amber-600 font-black text-xs uppercase tracking-widest bg-amber-50 px-6 py-2 rounded-xl border border-amber-100">Change</button>
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
                                       <div className="relative">
                                         <input type="text" placeholder="Pincode (Auto Fills State/City)" maxLength={6} required className="border border-gray-300 p-2 rounded text-sm w-full outline-blue-500 pr-24" value={address.pincode} onChange={e => handlePincodeChange(e.target.value)} />
                                         <button 
                                            type="button" 
                                            onClick={handleAutoDetect}
                                            disabled={isDetecting}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                         >
                                            {isDetecting ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />}
                                            {isDetecting ? 'Detecting' : 'Detect'}
                                         </button>
                                       </div>
                                       <input type="text" placeholder="Locality" required className="border border-gray-300 p-2 rounded text-sm w-full outline-blue-500" value={address.locality} onChange={e => setAddress({...address, locality: e.target.value})} />
                                   </div>
                                   <textarea placeholder="Address (Area and Street)" required className="border border-gray-300 p-2 rounded text-sm w-full outline-blue-500" rows={3} value={address.address} onChange={e => setAddress({...address, address: e.target.value})} />
                                   <div className="grid grid-cols-2 gap-4">
                                       <select 
                                         required 
                                         className={`border border-gray-300 p-2 rounded text-sm w-full outline-blue-500 bg-white ${!address.state ? 'text-gray-500' : 'text-black'}`}
                                         value={address.state} 
                                         onChange={e => {
                                           const newState = e.target.value;
                                           setAddress({...address, state: newState});
                                         }}
                                       >
                                         <option value="" disabled>State</option>
                                         {STATES.filter(s => s !== address.state).map(s => <option key={s} value={s}>{s}</option>)}
                                         {address.state && <option value={address.state} className="hidden">{address.state}</option>}
                                       </select>

                                       <select 
                                         required 
                                         className={`border border-gray-300 p-2 rounded text-sm w-full outline-blue-500 bg-white ${!address.city ? 'text-gray-500' : 'text-black'}`}
                                         value={address.city} 
                                         onChange={e => setAddress({...address, city: e.target.value})}
                                       >
                                         <option value="" disabled>City/District/Town</option>
                                         {ALL_CITIES.filter(c => c !== address.city).map(c => <option key={c} value={c}>{c}</option>)}
                                         {address.city && <option value={address.city} className="hidden">{address.city}</option>}
                                       </select>
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
               <div className="bg-white rounded-[2rem] shadow-xl shadow-amber-100/30 overflow-hidden border border-amber-50">
                   <div className={`p-8 flex items-center justify-between ${activeStep === 3 ? 'bg-black text-white' : 'bg-white'}`}>
                       <div className="flex items-center">
                            <span className={`${activeStep === 3 ? 'bg-amber-500 text-black' : 'bg-amber-100 text-amber-700'} w-8 h-8 flex items-center justify-center rounded-full text-xs mr-6 font-black`}>3</span>
                            <span className={`font-black uppercase text-sm tracking-widest ${activeStep === 3 ? 'text-white' : 'text-black/40'}`}>Order Summary</span>
                       </div>
                       {activeStep > 3 && (
                           <button onClick={() => setActiveStep(3)} className="text-amber-600 font-black text-xs uppercase tracking-widest bg-amber-50 px-6 py-2 rounded-xl border border-amber-100">Change</button>
                       )}
                   </div>

                   {activeStep === 3 && (
                       <div className="p-10 pl-24 flex flex-col gap-8 bg-white">
                           {items.map(item => (
                               <div key={item.id} className="flex gap-8 items-center group">
                                   <div className="w-24 h-24 bg-amber-50 rounded-2xl p-3 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                                       <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                                   </div>
                                   <div className="flex-1">
                                       <p className="text-lg font-black text-black leading-tight tracking-tighter">{item.title}</p>
                                       <p className="text-xs font-black text-black/40 mt-2 uppercase tracking-widest">Qty: {item.quantity}</p>
                                       <p className="font-black text-xl mt-3 text-amber-600 tracking-tighter">₹{item.price.toLocaleString()}</p>
                                   </div>
                               </div>
                           ))}
                           <div className="border-t border-amber-50 mt-4 pt-8 flex justify-end">
                               <button 
                                 onClick={() => setActiveStep(4)}
                                 className="bg-amber-500 text-white px-12 py-5 text-sm font-black uppercase rounded-2xl shadow-xl hover:bg-amber-600 transition-all tracking-widest">
                                   Confirm Order Items
                               </button>
                           </div>
                       </div>
                   )}
                   {activeStep > 3 && (
                       <div className="px-8 pb-8 pl-24 flex">
                           <p className="text-sm font-black text-black uppercase tracking-widest">{items.length} Item(s)</p>
                       </div>
                   )}
               </div>

               
               {/* STEP 4: PAYMENT OPTIONS */}
               <div className="bg-white rounded-[2rem] shadow-xl shadow-amber-100/30 overflow-hidden border border-amber-50">
                    <div className={`p-8 flex items-center ${activeStep === 4 ? 'bg-black text-white' : 'bg-white'}`}>
                        <span className={`${activeStep === 4 ? 'bg-amber-500 text-black' : 'bg-amber-100 text-amber-700'} w-8 h-8 flex items-center justify-center rounded-full text-xs mr-6 font-black`}>4</span>
                        <span className={`font-black uppercase text-sm tracking-widest ${activeStep === 4 ? 'text-white' : 'text-black/40'}`}>Payment Options</span>
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
           <div className="lg:w-1/3">
               <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-amber-200/40 sticky top-28 border border-amber-50 overflow-hidden">
                   <h3 className="text-black/40 font-black text-xs uppercase tracking-[0.3em] border-b border-amber-50 pb-6 mb-8">Price Summary</h3>
                   <div className="space-y-6">
                        <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                            <span className="text-black/60">Price ({items.length} items)</span>
                            <span className="text-black">₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                            <span className="text-black/60">Delivery</span>
                            <span className="text-emerald-500">FREE</span>
                        </div>
                        <div className="border-t-2 border-dashed border-amber-100 my-4"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-black text-black uppercase tracking-tighter">Payable</span>
                            <span className="text-3xl font-black text-black tracking-tighter">₹{totalPrice.toLocaleString()}</span>
                        </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default Checkout;