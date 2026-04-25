import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-bold mb-4">FlipCart Premium</h3>
          <p className="text-gray-400 leading-relaxed">
            Your one-stop destination for premium products at unbeatable prices. Experience shopping like never before with our curated collection.
          </p>
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-blue-500" />
              <span>123 Market Street, Tech City</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-blue-500" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-blue-500" />
              <span>support@flipcart.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Contact Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Flipkart Stories</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Corporate Information</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-6">Customer Service</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Payments</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Shipping</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Cancellation & Returns</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Report Infringement</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-6">Stay Updated</h3>
          <p className="text-gray-400 mb-4">Subscribe to our newsletter for latest updates and offers.</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-full border border-gray-700"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </form>

          <div className="mt-8">
            <h4 className="text-white font-medium mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 hover:text-white transition-all"><Twitter size={18} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all"><Youtube size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 border-t border-gray-800 pt-8 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 items-center">
            <span className="font-bold text-xl text-white">FlipCart</span>
            <span className="text-xs px-2 py-0.5 bg-blue-900 text-blue-300 rounded-full">Premium</span>
          </div>
          <div className="text-gray-500 text-xs">
            © {currentYear} FlipCart.com. All rights reserved.
          </div>
          <div className="flex gap-4 opacity-60">
            <CreditCard size={24} />
            <CreditCard size={24} />
            <CreditCard size={24} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
