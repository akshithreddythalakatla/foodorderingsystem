import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Utensils, Bike, ChefHat, LogIn, LogOut, User, Clock } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-amber-600 bg-clip-text text-transparent">
              QuickBite
            </span>
            <span className="text-[10px] block font-semibold text-gray-400 uppercase tracking-wider">
              Food Delivery
            </span>
          </div>
        </Link>

        {/* Navigation links based on role */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors">
            Restaurants
          </Link>

          {isAuthenticated && user?.role === 'CUSTOMER' && (
            <Link to="/my-orders" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors">
              <Clock className="w-4 h-4 text-gray-400" />
              My Orders
            </Link>
          )}

          {isAuthenticated && user?.role === 'RESTAURANT_ADMIN' && (
            <>
              <Link to="/restaurant/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
                <ChefHat className="w-4 h-4" />
                Restaurant Portal
              </Link>
              <Link to="/restaurant/menu" className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors">
                Menu Management
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'DELIVERY_PERSONNEL' && (
            <Link to="/delivery/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors">
              <Bike className="w-4 h-4" />
              Delivery Partner Portal
            </Link>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Cart button (only relevant for customers or guests) */}
          {(!isAuthenticated || user?.role === 'CUSTOMER') && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors flex items-center justify-center"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-gray-800">{user.name}</div>
                <div className="text-[10px] font-semibold text-brand-600 uppercase tracking-wider">
                  {user.role === 'RESTAURANT_ADMIN' ? 'Restaurant Manager' : user.role === 'DELIVERY_PERSONNEL' ? 'Delivery Partner' : 'Customer'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm shadow-brand-500/20 transition-all hover:shadow-md"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
