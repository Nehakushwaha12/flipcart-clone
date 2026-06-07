import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut, Heart, Sun, Moon, Mic, Camera, Scale, ShieldCheck, Loader2, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);
  const compareItems = useSelector((state: RootState) => state.compare.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      navigate(`/products?search=${encodeURIComponent(transcript)}`);
    };
    recognition.onerror = (event: any) => console.error("Speech recognition error", event.error);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleImageSearch = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e: any) => {
      if (e.target.files && e.target.files[0]) {
        setIsAnalyzingImage(true);
        try {
            const file = e.target.files[0];
            const imgUrl = URL.createObjectURL(file);
            const imgElement = document.createElement('img');
            imgElement.src = imgUrl;

            await new Promise((resolve) => {
                imgElement.onload = resolve;
            });

            const mobilenet = (window as any).mobilenet;
            if (!mobilenet) throw new Error("AI Model not loaded");
            
            const model = await mobilenet.load();
            const predictions = await model.classify(imgElement);
            
            if (predictions && predictions.length > 0) {
                let bestMatch = predictions[0].className.split(',')[0]; 
                
                // Map common labels
                const mapping: Record<string, string> = {
                  'bottle': 'bottle', 'phone': 'mobile', 'laptop': 'laptop', 
                  'shoe': 'shoes', 'shirt': 'shirt', 'pant': 'jeans', 'mug': 'mug'
                };
                
                for (const [key, val] of Object.entries(mapping)) {
                  if (bestMatch.toLowerCase().includes(key)) {
                    bestMatch = val;
                    break;
                  }
                }

                setSearchTerm(bestMatch);
                navigate(`/products?search=${encodeURIComponent(bestMatch)}`);
            }
        } catch (error) {
            console.error("Image search failed:", error);
            alert("Image analysis failed. Please try again.");
        } finally {
            setIsAnalyzingImage(false);
        }
      }
    };
    fileInput.click();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-amber-50/95 dark:bg-gray-950/95 backdrop-blur-lg shadow-2xl py-4 border-b border-amber-100' : 'bg-[#fffbeb] dark:bg-gray-950 py-5 border-b-2 border-amber-200 dark:border-amber-900/40'}`}>
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between gap-10">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-4 group shrink-0">
          <div className="bg-amber-500 p-2.5 rounded-2xl shadow-lg shadow-amber-200 group-hover:rotate-12 transition-transform">
             <ShieldCheck className="text-white" size={32} />
          </div>
          <span className={`font-black text-4xl tracking-tighter transition-colors ${scrolled ? 'text-amber-600 dark:text-white' : 'text-amber-600'}`}>
            APNA<span className={scrolled ? 'text-gray-900 dark:text-amber-400' : 'text-amber-800'}>STORE</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl">
          <form onSubmit={handleSearch} className="w-full relative group">
            <input
              type="text"
              placeholder={isListening ? "Listening..." : isAnalyzingImage ? "Analyzing Image..." : "Search for fashion, home, tech..."}
              className={`w-full py-4 px-16 rounded-[1.5rem] text-base font-bold transition-all border-2 ${scrolled ? 'bg-white dark:bg-gray-800 border-amber-100 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400' : 'bg-white border-amber-200 text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-amber-300/30 focus:border-amber-500 shadow-xl shadow-amber-100/20'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className={`absolute left-6 top-1/2 -translate-y-1/2 ${scrolled ? 'text-amber-500' : 'text-amber-400'}`} size={24} />
            
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-5">
               <button 
                type="button" 
                onClick={startVoiceSearch}
                className={`transition-all hover:scale-125 ${isListening ? 'text-red-500 scale-150 animate-pulse' : 'text-amber-400 hover:text-amber-600'}`}
               >
                  <Mic size={24} />
               </button>
               <button 
                type="button" 
                onClick={handleImageSearch}
                className={`transition-all hover:scale-125 ${isAnalyzingImage ? 'text-amber-500 animate-spin' : 'text-amber-400 hover:text-amber-600'}`}
               >
                  {isAnalyzingImage ? <Loader2 size={24} /> : <Camera size={24} />}
               </button>
            </div>
          </form>
        </div>

        {/* Nav Actions */}
        <div className="hidden lg:flex items-center gap-10">
          
          {/* User Profile */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className={`flex items-center gap-4 font-black text-base transition-colors ${scrolled ? 'text-gray-900 dark:text-gray-100 hover:text-amber-600' : 'text-amber-800 hover:text-amber-900'}`}>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                   <User size={24} />
                </div>
                <span className="max-w-[120px] truncate">{user?.name}</span>
              </button>
              <div className="absolute right-0 top-full pt-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-[0_20px_50px_rgba(251,191,36,0.3)] border-2 border-amber-50 dark:border-amber-900/20 overflow-hidden py-4">
                  <Link to="/profile" className="block px-8 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-600 font-black transition-colors">My Profile</Link>
                  <Link to="/orders" className="block px-8 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-600 font-black transition-colors">Orders</Link>
                  <div className="mx-6 my-2 border-t border-amber-50 dark:border-gray-700"></div>
                  <button onClick={handleLogout} className="w-full text-left px-8 py-4 text-base text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-4 font-black transition-colors">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="font-black text-base px-10 py-4 rounded-2xl transition-all bg-amber-500 text-white hover:bg-amber-600 shadow-xl shadow-amber-200/50 hover:-translate-y-0.5 active:scale-95">
              Login
            </Link>
          )}

          {/* Icons */}
          <div className={`flex items-center gap-8 border-l-2 pl-10 ${scrolled ? 'border-amber-100 dark:border-gray-800' : 'border-amber-200'}`}>
            <Link to="/wishlist" className={`relative transition-all hover:scale-110 ${scrolled ? 'text-gray-800 dark:text-gray-200 hover:text-red-500' : 'text-amber-800 hover:text-red-600'}`}>
               <Heart size={28} />
               {wishlistItems.length > 0 && <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-black h-6 w-6 flex items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900 shadow-lg">{wishlistItems.length}</span>}
            </Link>

            <Link to="/orders" className={`relative transition-all hover:scale-110 ${scrolled ? 'text-gray-800 dark:text-gray-200 hover:text-amber-600' : 'text-amber-800 hover:text-amber-900'}`}>
               <Package size={28} />
            </Link>

            <Link to="/compare" className={`relative transition-all hover:scale-110 ${scrolled ? 'text-gray-800 dark:text-gray-200 hover:text-amber-600' : 'text-amber-800 hover:text-amber-900'}`}>
               <Scale size={28} />
               {compareItems.length > 0 && <span className="absolute -top-3 -right-3 bg-amber-500 text-white text-xs font-black h-6 w-6 flex items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900 shadow-lg">{compareItems.length}</span>}
            </Link>
            
            <Link to="/cart" className={`relative transition-all hover:scale-110 ${scrolled ? 'text-gray-800 dark:text-gray-200 hover:text-amber-600' : 'text-amber-800 hover:text-amber-900'}`}>
               <ShoppingCart size={28} />
               {cartCount > 0 && <span className="absolute -top-3 -right-3 bg-rose-600 text-white text-xs font-black h-6 w-6 flex items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900 shadow-lg">{cartCount}</span>}
            </Link>

            <button onClick={toggleTheme} className={`transition-all hover:scale-110 ${scrolled ? 'text-gray-800 dark:text-gray-200 hover:text-amber-600' : 'text-amber-800 hover:text-amber-900'}`}>
               {theme === 'light' ? <Moon size={28} /> : <Sun size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`lg:hidden p-3 rounded-2xl transition-all ${scrolled ? 'text-amber-600 hover:bg-amber-50' : 'text-amber-600 hover:bg-white/50'}`}>
           {isMobileMenuOpen ? <X size={40} /> : <Menu size={40} />}
        </button>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-gray-900 z-[70] shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-black text-xl text-pink-600">APNASTORE</span>
                <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
              </div>

              <div className="space-y-6">
                 {isAuthenticated ? (
                   <div className="flex items-center gap-4 p-4 bg-pink-50 dark:bg-gray-800 rounded-2xl">
                      <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center font-black text-xl">
                        {user?.name?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-pink-500">Premium Member</p>
                      </div>
                   </div>
                 ) : (
                   <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-pink-500 text-white py-3 rounded-2xl font-bold shadow-lg shadow-pink-100">Login / Signup</Link>
                 )}

                 <nav className="space-y-4">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 font-bold text-gray-700 dark:text-gray-300 p-2 hover:text-pink-600 transition-colors">Home</Link>
                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 font-bold text-gray-700 dark:text-gray-300 p-2 hover:text-pink-600 transition-colors">All Products</Link>
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 font-bold text-gray-700 dark:text-gray-300 p-2 hover:text-pink-600 transition-colors">Wishlist ({wishlistItems.length})</Link>
                    <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 font-bold text-gray-700 dark:text-gray-300 p-2 hover:text-pink-600 transition-colors">My Orders</Link>
                    <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 font-bold text-gray-700 dark:text-gray-300 p-2 hover:text-pink-600 transition-colors">Cart ({cartCount})</Link>
                 </nav>

                 {isAuthenticated && (
                   <button onClick={handleLogout} className="w-full flex items-center gap-4 font-bold text-red-600 p-2 border-t border-pink-50 dark:border-gray-800 mt-4 pt-4">
                      <LogOut size={20} /> Logout
                   </button>
                 )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
