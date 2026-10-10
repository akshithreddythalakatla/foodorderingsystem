import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantApi, foodItemApi } from '../api/restaurantApi';
import { useCart } from '../context/CartContext';
import FoodItemCard from '../components/FoodItemCard';
import { Star, Clock, Bike, MapPin, Phone, ArrowLeft, ShoppingBag, Filter } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);

  const { items, totalCount, totalAmount, setIsCartOpen } = useCart();

  useEffect(() => {
    loadRestaurantAndMenu();
  }, [id]);

  const loadRestaurantAndMenu = async () => {
    setLoading(true);
    try {
      const restData = await restaurantApi.getById(id);
      setRestaurant(restData);
      const itemsData = await foodItemApi.getByRestaurant(id);
      setMenuItems(itemsData);
    } catch (err) {
      console.error('Failed to load menu', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-64 bg-gray-200 rounded-3xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 4, 5].map((n) => (
            <div key={n} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Restaurant Not Found</h2>
        <Link to="/" className="text-sm font-semibold text-brand-600 hover:underline">
          Return to All Restaurants
        </Link>
      </div>
    );
  }

  // Extract unique categories
  const categories = ['All', ...new Set(menuItems.map((item) => item.category).filter(Boolean))];

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Top Banner */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover blur-xs"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white mb-6 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Restaurants
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-500 text-white">
                  {restaurant.cuisineType}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${restaurant.isOpen ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {restaurant.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
                {restaurant.name}
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-normal leading-relaxed mb-4">
                {restaurant.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 font-medium">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-400" />
                  <span>{restaurant.address}</span>
                </div>
                {restaurant.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-brand-400" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick stats box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-6 border border-white/10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-base font-extrabold text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300" />
                  {restaurant.rating.toFixed(1)}
                </div>
                <div className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">Rating</div>
              </div>

              <div className="w-px h-8 bg-white/20" />

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-base font-extrabold text-white">
                  <Clock className="w-4 h-4 text-brand-400" />
                  {restaurant.deliveryTimeMinutes} min
                </div>
                <div className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">Delivery</div>
              </div>

              <div className="w-px h-8 bg-white/20" />

              <div className="text-center">
                <div className="text-base font-extrabold text-white">
                  ₹{restaurant.deliveryFee}
                </div>
                <div className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">Fee</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Veg Only Toggle */}
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs font-bold text-gray-700">Pure Veg Only</span>
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative" />
          </label>
        </div>

        {/* Menu Items List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-sm font-semibold text-gray-600">No dishes match the selected category or vegetarian filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <FoodItemCard key={item.id} item={item} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Indicator (Bottom Bar) */}
      {totalCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-brand-600 to-amber-500 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between hover:from-brand-700 hover:to-amber-600 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                {totalCount}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-orange-100">Your Basket</div>
                <div className="text-sm font-extrabold">₹{totalAmount.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider pr-1">
              <span>View Cart</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
