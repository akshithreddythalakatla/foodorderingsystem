import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, LogIn, Shield, Bike, ChefHat, User, CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.role === 'RESTAURANT_ADMIN') {
        navigate('/restaurant/dashboard');
      } else if (res.role === 'DELIVERY_PERSONNEL') {
        navigate('/delivery/dashboard');
      } else {
        navigate(redirectUrl);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await quickLogin(role);
      if (role === 'RESTAURANT_ADMIN') {
        navigate('/restaurant/dashboard');
      } else if (role === 'DELIVERY_PERSONNEL') {
        navigate('/delivery/dashboard');
      } else {
        navigate(redirectUrl);
      }
    } catch (err) {
      setError(err.message || 'Failed quick login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        {/* Brand header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white mx-auto shadow-md mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-500 mt-1">Sign in to your account or use 1-click demo access below</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Demo Login Panel */}
        <div className="pt-6 border-t border-gray-100">
          <div className="text-center mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 bg-white px-2">
              ⚡ 1-Click Demo Accounts
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('CUSTOMER')}
              className="w-full py-2 px-3 rounded-xl border border-gray-200 hover:border-brand-500 hover:bg-brand-50/50 flex items-center justify-between text-xs font-bold text-gray-700 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" />
                <div>
                  <div>Customer Account</div>
                  <div className="text-[10px] text-gray-400 font-normal">Rahul Sharma (customer@foodie.com)</div>
                </div>
              </div>
              <span className="text-[10px] bg-orange-100 text-brand-700 px-2 py-0.5 rounded font-bold">Try</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('RESTAURANT_ADMIN')}
              className="w-full py-2 px-3 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50/50 flex items-center justify-between text-xs font-bold text-gray-700 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-purple-600" />
                <div>
                  <div>Restaurant Admin</div>
                  <div className="text-[10px] text-gray-400 font-normal">Chef Antonio (admin@foodie.com)</div>
                </div>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">Try</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('DELIVERY_PERSONNEL')}
              className="w-full py-2 px-3 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between text-xs font-bold text-gray-700 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-emerald-600" />
                <div>
                  <div>Delivery Personnel</div>
                  <div className="text-[10px] text-gray-400 font-normal">Vikram Singh (delivery@foodie.com)</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Try</span>
            </button>
          </div>
        </div>

        {/* Register link */}
        <div className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
