import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

// ---------- helpers ----------
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
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
      errs.email = 'Email must start with a letter.';
    } else if (!isValidEmail(email.trim())) {
      errs.email = 'Invalid email format. E.g., john123@gmail.com.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (!isLogin && !isValidPassword(password)) {
      errs.password = 'Password must be at least 8 chars with letters & numbers.';
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
      return;
    }

    if (!validate()) return;

    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const finalEmail = email.trim();

    if (!isLogin) {
      if (storedUsers[finalEmail]) {
        setErrors({ email: 'Account already exists for this email.' });
        return;
      }
      storedUsers[finalEmail] = { password, name: name.trim() };
      localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));

      const user = { id: Date.now().toString(), name: name.trim(), email: finalEmail };
      dispatch(login(user));
    } else {
      const userRecord = storedUsers[finalEmail];
      if (!userRecord) {
        setErrors({ email: 'No account found. Please register first.' });
        return;
      }
      if (userRecord.password !== password) {
        setErrors({ password: 'Incorrect password.' });
        return;
      }

      const user = { id: Date.now().toString(), name: userRecord.name || finalEmail.split('@')[0], email: finalEmail };
      dispatch(login(user));
    }

    const params   = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    navigate(redirect === 'checkout' ? '/checkout' : '/');
  };

  const inputClass = (field: string) =>
    `w-full bg-amber-50/30 border rounded-2xl px-6 py-4 text-black font-black tracking-tight placeholder-black/20 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm shadow-inner ${
      errors[field] ? 'border-red-400' : 'border-amber-100'
    }`;

  return (
    <div className="bg-[#fffbeb] min-h-screen flex items-center justify-center p-6 transition-colors duration-500 text-black">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-amber-200/40 flex max-w-[1000px] w-full min-h-[650px] overflow-hidden border border-amber-50 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50/30 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        
        {/* ===== Left Panel ===== */}
        <div className="hidden md:flex bg-black text-white w-2/5 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-6 leading-tight tracking-tighter uppercase">
              {isForgotPassword ? 'Reset Access' : (isLogin ? 'Welcome Back' : 'Join the Elite')}
            </h2>
            <p className="text-sm font-black text-white/60 leading-relaxed uppercase tracking-widest">
              {isForgotPassword 
                ? 'Regain access to your exclusive ApnaStore collection.'
                : (isLogin
                ? 'Sign in to access your curated selection of elite products.'
                : 'Experience a new level of premium shopping.')}
            </p>
          </div>
          <div className="relative z-10 flex justify-center group">
            <img
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
              alt="Login Graphic"
              className="w-full max-w-[220px] drop-shadow-[0_0_30px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>

        {/* ===== Right Panel ===== */}
        <div className="w-full md:w-3/5 p-10 lg:p-16 flex flex-col justify-between relative z-10">
          <div className="mb-8">
            <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.4em] mb-10">ApnaStore</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    className={inputClass('name')}
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors(p => ({...p, name: ''})); }}
                  />
                  {errors.name && <p className="text-red-500 text-[10px] font-black mt-2 ml-4 uppercase tracking-widest">⚠ {errors.name}</p>}
                </div>
              )}

              <div>
                <input
                  type="text"
                  placeholder="EMAIL ADDRESS"
                  className={inputClass('email')}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})); }}
                  autoComplete="username"
                />
                {errors.email && <p className="text-red-500 text-[10px] font-black mt-2 ml-4 uppercase tracking-widest">⚠ {errors.email}</p>}
              </div>

              {!isForgotPassword && (
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isLogin ? 'PASSWORD' : 'CREATE PASSWORD'}
                      className={inputClass('password')}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-600 text-[10px] font-black focus:outline-none uppercase tracking-widest"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-[10px] font-black mt-2 ml-4 uppercase tracking-widest">⚠ {errors.password}</p>}
                </div>
              )}

              {!isLogin && (
                <div>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="CONFIRM PASSWORD"
                      className={inputClass('confirmPassword')}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({...p, confirmPassword: ''})); }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-600 text-[10px] font-black focus:outline-none uppercase tracking-widest"
                    >
                      {showConfirm ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-[10px] font-black mt-2 ml-4 uppercase tracking-widest">⚠ {errors.confirmPassword}</p>}
                </div>
              )}

              <p className="text-[10px] text-black/30 font-black uppercase tracking-widest leading-relaxed px-2">
                By continuing, you agree to our{' '}
                <span className="text-amber-600 cursor-pointer hover:underline">Terms</span> &{' '}
                <span className="text-amber-600 cursor-pointer hover:underline">Privacy Policy</span>.
              </p>

              <button
                type="submit"
                className="bg-black text-white py-5 font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-sm mt-4 shadow-amber-500/10"
              >
                {isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>

              {isLogin && !isForgotPassword && (
                <p 
                  className="text-center text-amber-600 text-[10px] font-black cursor-pointer hover:underline uppercase tracking-widest"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password?
                </p>
              )}

              {isForgotPassword && (
                <p 
                  className="text-center text-amber-600 text-[10px] font-black cursor-pointer hover:underline uppercase tracking-widest"
                  onClick={() => { setIsForgotPassword(false); setErrors({}); }}
                >
                  Back to Security Portal
                </p>
              )}
            </form>
          </div>

          <div className="text-center border-t border-amber-50 pt-8">
            {isLogin ? (
              <p className="text-black/40 font-black uppercase tracking-widest text-[10px]">
                New to the Elite? {' '}
                <span className="text-amber-600 cursor-pointer hover:underline" onClick={() => switchTab(false)}>
                  Create Membership
                </span>
              </p>
            ) : (
              <p className="text-black/40 font-black uppercase tracking-widest text-[10px]">
                Already a Member? {' '}
                <span className="text-amber-600 cursor-pointer hover:underline" onClick={() => switchTab(true)}>
                  Access Portal
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;