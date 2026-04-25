import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut, Heart, Sun, Moon, Mic, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { categories } from '../../services/mockData';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [suggestions, setSuggestions] = useState<any[]>([]);

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
      setSearchTerm('');
      setSuggestions([]);
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
            // Read image into an img element
            const file = e.target.files[0];
            const imgUrl = URL.createObjectURL(file);
            const imgElement = document.createElement('img');
            imgElement.src = imgUrl;

            await new Promise((resolve) => {
                imgElement.onload = resolve;
            });

            // Load the MobileNet model (from window if loaded via CDN)
            const mobilenet = (window as any).mobilenet;
            if (!mobilenet) {
                throw new Error("AI Model not loaded");
            }
            
            const model = await mobilenet.load();
            const predictions = await model.classify(imgElement);
            
            console.log("AI Image Predictions:", predictions);
            
            if (predictions && predictions.length > 0) {
                // Get the best prediction, often returns something like "water bottle", "coffee mug"
                let bestMatch = predictions[0].className.split(',')[0]; 
                
                // Map common ML labels to our e-commerce categories if needed
                if (bestMatch.toLowerCase().includes('bottle') || bestMatch.toLowerCase().includes('flask') || bestMatch.toLowerCase().includes('cup') || bestMatch.toLowerCase().includes('mug')) bestMatch = "bottle";
                if (bestMatch.toLowerCase().includes('pot') || bestMatch.toLowerCase().includes('vase')) bestMatch = "flower pot";
                if (bestMatch.toLowerCase().includes('phone') || bestMatch.toLowerCase().includes('cellular')) bestMatch = "mobile";
                if (bestMatch.toLowerCase().includes('laptop') || bestMatch.toLowerCase().includes('computer')) bestMatch = "laptop";
                if (bestMatch.toLowerCase().includes('shoe') || bestMatch.toLowerCase().includes('sneaker')) bestMatch = "shoes";
                if (bestMatch.toLowerCase().includes('shirt') || bestMatch.toLowerCase().includes('t-shirt') || bestMatch.toLowerCase().includes('jersey')) bestMatch = "shirt";
                if (bestMatch.toLowerCase().includes('pant') || bestMatch.toLowerCase().includes('jean') || bestMatch.toLowerCase().includes('trouser')) bestMatch = "jeans";

                setSearchTerm(bestMatch);
                navigate(`/products?search=${encodeURIComponent(bestMatch)}`);
            } else {
                alert("Could not identify the product in the image.");
            }
        } catch (error) {
            console.error("Image search failed:", error);
            alert("AI Image classification failed. Please try again.");
        } finally {
            setIsAnalyzingImage(false);
        }
      }
    };
    fileInput.click();
  };

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    
    // Fetch suggestions from our local database
    fetch(`http://localhost:5000/api/products?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSuggestions(data.slice(0, 6));
        }
      })
      .catch(err => console.error("Error fetching suggestions:", err));
  }, [searchTerm]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-[#2874f0] shadow-md ${scrolled ? 'py-1' : 'py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex flex-col items-end group">
          <span className="font-bold text-xl text-white tracking-tight italic">ApnaStore</span>
          <span className="text-[10px] text-yellow-300 font-medium -mt-1 flex items-center gap-0.5">Explore <span className='text-yellow-400 font-bold'>Plus</span> <img src='https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/header/img/plusImage-065a418c..png' className='h-3 inline' alt='' /></span>
        </Link>

        {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="w-full relative group">
            <input
              type="text"
              placeholder={isListening ? "Listening..." : isAnalyzingImage ? "Analyzing Image..." : "Search for products, brands and more"}
              className="w-full py-2.5 px-5 pl-12 pr-20 text-gray-700 bg-white border-none rounded-sm focus:ring-2 focus:ring-yellow-400 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
              <Search className="text-blue-500" size={20} />
            </button>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button type="button" onClick={startVoiceSearch} className={`hover:scale-110 transition-transform ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-blue-500'}`}>
                <Mic size={18} />
              </button>
              <button type="button" onClick={handleImageSearch} className={`hover:scale-110 transition-transform ${isAnalyzingImage ? 'text-blue-500 animate-pulse' : 'text-gray-400 hover:text-blue-500'}`}>
                <Camera size={18} />
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                {suggestions.map((s) => (
                  <button key={s.id} onClick={() => { navigate(`/product/${s.id}`); setSearchTerm(''); setSuggestions([]); }} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50">
                    <img src={s.image} alt={s.title} className="w-10 h-10 object-cover rounded-md" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">{s.title}</div>
                      <div className="text-xs text-gray-500">{s.brand} • {s.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          <button onClick={toggleTheme} className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {isAuthenticated ? (
            <div className="group relative">
              <button className="flex items-center gap-2 font-medium text-white hover:text-yellow-300 transition-colors py-2">
                <User size={18} />
                <span className="max-w-[100px] truncate text-sm">{user?.name}</span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
                <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-50 bg-gray-50">
                    <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                  </div>
                  <Link to="/orders" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">My Orders</Link>
                  <Link to="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">My Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-50">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-[#2874f0] px-8 py-1.5 rounded-sm font-bold hover:bg-gray-50 transition-all shadow-sm text-sm">
              Login
            </Link>
          )}

          <Link to="/products" className="text-white font-bold text-sm hover:text-yellow-300 transition-colors">
            Explore
          </Link>

          <Link to="/cart" className="relative group p-2 flex items-center gap-1">
            <ShoppingCart className="text-white" size={22} />
            <span className="text-white font-bold text-sm">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 left-3 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-2 pl-10 pr-4 bg-gray-50 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
                  <Search className="text-gray-400" size={18} />
                </button>
                {suggestions.length > 0 && (
                  <div className="mt-2 bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                    {suggestions.map((s) => (
                      <button key={s.id} onClick={() => { navigate(`/product/${s.id}`); setIsMobileMenuOpen(false); setSearchTerm(''); setSuggestions([]); }} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50">
                        <img src={s.image} alt={s.title} className="w-10 h-10 object-cover rounded-md" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{s.title}</div>
                          <div className="text-xs text-gray-500">{s.brand}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link to="/orders" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    <ShoppingBagIcon size={20} /> My Orders
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={20} /> My Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" className="py-2.5 text-center rounded-lg bg-blue-600 text-white font-medium shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/login" className="py-2.5 text-center rounded-lg border border-blue-600 text-blue-600 font-medium bg-blue-50" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                </div>
              )}

              <div className="h-px bg-gray-100 my-2"></div>
              <Link to="/products" className="font-medium text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>All Categories</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    <div className="h-[56px]"></div> {/* Spacer for fixed nav */}
    
    {/* Flipkart Category Strip */}
    <div className="bg-white border-b border-gray-200 shadow-sm mt-0 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            to={`/products?category=${cat.name}`} 
            className="flex flex-col items-center gap-1 group min-w-[80px]"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden transition-transform group-hover:scale-105">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:text-blue-600 whitespace-nowrap">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
};

const ShoppingBagIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export default Navbar;
