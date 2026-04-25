import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

// ---------- helpers ----------
const isValidEmail = (email: string): boolean => {
  // Must start with at least one letter, followed by optional alphanumeric/dots/underscores/hyphens,
  // then @, then a domain like gmail.com / yahoo.in etc.
  const emailRegex = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  // At least 8 chars, at least one letter, at least one number
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
};

// ---------- component ----------
const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  // ---- reset on tab switch ----
  const switchTab = (toLogin: boolean) => {
    setIsLogin(toLogin);
    setIsForgotPassword(false);
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setErrors({}); setShowPassword(false); setShowConfirm(false);
  };

  // ---- field-level validation ----
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!isLogin && !name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (/^[0-9]/.test(email.trim())) {
      errs.email = 'Email must start with a letter. It cannot start with a number.';
    } else if (!isValidEmail(email.trim())) {
      errs.email =
        'Invalid email format. E.g., john123@gmail.com.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (!isLogin && !isValidPassword(password)) {
      errs.password =
        'Password must be at least 8 characters and include both letters and numbers.';
    } else if (isLogin && password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!isLogin && password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---- submit ----
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      const errs: Record<string, string> = {};
      if (!email.trim()) {
        errs.email = 'Email address is required.';
      } else if (!isValidEmail(email.trim())) {
        errs.email = 'Invalid email format.';
      }
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      alert(`Password reset link sent to ${email}`);
      setIsForgotPassword(false);
      setPassword('');
      return;
    }

    if (!validate()) return;

    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const finalEmail = email.trim();

    if (!isLogin) {
      // Registration Flow
      if (storedUsers[finalEmail]) {
        setErrors({ email: 'Account already exists for this email.' });
        return;
      }
      storedUsers[finalEmail] = { password, name: name.trim() };
      localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));

      const user = {
        id:    Date.now().toString(),
        name:  name.trim(),
        email: finalEmail,
      };
      dispatch(login(user));
    } else {
      // Login Flow
      const userRecord = storedUsers[finalEmail];
      if (!userRecord) {
        setErrors({ email: 'No account found. Please create an account.' });
        return;
      }
      if (userRecord.password !== password) {
        setErrors({ password: 'Incorrect password. Click "Forgot Password?" to reset it.' });
        return;
      }

      const user = {
        id:    Date.now().toString(),
        name:  userRecord.name || finalEmail.split('@')[0],
        email: finalEmail,
      };
      dispatch(login(user));
    }

    const params   = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    navigate(redirect === 'checkout' ? '/checkout' : '/');
  };

  // ---- shared input classes ----
  const inputClass = (field: string) =>
    `w-full border rounded-sm px-4 py-3 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all text-sm ${
      errors[field]
        ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    }`;

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-md flex max-w-4xl w-full min-h-[520px] overflow-hidden">

        {/* ===== Left Blue Panel ===== */}
        <div className="hidden md:flex bg-[#2874f0] text-white w-2/5 p-8 flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4 leading-snug">
              {isForgotPassword ? 'Forgot Password' : (isLogin ? 'Login' : 'Looks like you\'re new here!')}
            </h2>
            <p className="text-base text-blue-100 leading-relaxed">
              {isForgotPassword 
                ? 'Enter your email address to reset your password'
                : (isLogin
                ? 'Get access to your Orders, Wishlist and Recommendations'
                : 'Sign up with your email to get started on Flipkart')}
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
              alt="Login Graphic"
              className="w-full max-w-[200px]"
            />
          </div>
        </div>

        {/* ===== Right Form Panel ===== */}
        <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-between">

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            {/* Name field — only on signup */}
            {!isLogin && (
              <div>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Full Name"
                  className={inputClass('name')}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(p => ({...p, name: ''})); }}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">⚠ {errors.name}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <input
                id="login-email"
                type="text"
                placeholder="Enter Email  (e.g. john123@gmail.com)"
                className={inputClass('email')}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})); }}
                autoComplete="username"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">⚠ {errors.email}</p>
              )}
            </div>

            {/* Password */}
            {!isForgotPassword && (
            <div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLogin ? 'Enter Password' : 'Create Password (min 8 chars, letters + numbers)'}
                  className={inputClass('password')}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-xs font-semibold focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">⚠ {errors.password}</p>
              )}
            </div>
            )}

            {/* Confirm Password — only on signup */}
            {!isLogin && (
              <div>
                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className={inputClass('confirmPassword')}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({...p, confirmPassword: ''})); }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-xs font-semibold focus:outline-none"
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">⚠ {errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Terms */}
            <p className="text-xs text-gray-400 leading-relaxed">
              By continuing, you agree to Flipkart's{' '}
              <span className="text-blue-600 cursor-pointer">Terms of Use</span> and{' '}
              <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
            </p>

            {/* Submit */}
            <button
              id="auth-submit-btn"
              type="submit"
              className="bg-[#fb641b] text-white py-3 font-bold rounded-sm shadow hover:bg-[#e55a14] active:scale-95 transition-all"
            >
              {isForgotPassword ? 'Reset Password' : (isLogin ? 'Login' : 'Create Account')}
            </button>

            {/* Forgot password — login only */}
            {isLogin && !isForgotPassword && (
              <p 
                className="text-center text-blue-600 text-sm font-medium cursor-pointer hover:underline"
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password?
              </p>
            )}

            {/* Back to Login — from forgot password flow */}
            {isForgotPassword && (
              <p 
                className="text-center text-blue-600 text-sm font-medium cursor-pointer hover:underline"
                onClick={() => { setIsForgotPassword(false); setErrors({}); }}
              >
                Back to Login
              </p>
            )}
          </form>

          {/* Switch tab */}
          <div className="mt-6 text-center border-t border-gray-100 pt-5">
            {isLogin ? (
              <p
                id="switch-to-signup"
                className="text-blue-600 font-semibold cursor-pointer hover:underline text-sm"
                onClick={() => switchTab(false)}
              >
                New to Flipkart? Create an account
              </p>
            ) : (
              <p
                id="switch-to-login"
                className="text-blue-600 font-semibold cursor-pointer hover:underline text-sm"
                onClick={() => switchTab(true)}
              >
                Existing User? Log in
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;