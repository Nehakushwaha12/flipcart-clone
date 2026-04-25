import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import ChatBot from './components/common/ChatBot';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './redux/store';
import { ThemeProvider } from './components/common/ThemeProvider';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AppContent: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 relative">
        <Navbar />
        <main className="flex-grow pt-20">
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Force login page first if not authenticated */}
              <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
              <Route path="/checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login?redirect=checkout" />} />
              <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
              <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
              {/* Fallback route - show 404 page for unknown URLs */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
