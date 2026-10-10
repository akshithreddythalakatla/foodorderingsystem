import React, { useState, useEffect } from 'react';
import { restaurantApi } from '../api/restaurantApi';
import RestaurantCard from '../components/RestaurantCard';
import { Search, Flame, Sparkles, Clock, ShieldCheck, UtensilsCrossed } from 'lucide-react';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const cuisines = ['All', 'North Indian', 'Italian', 'American', 'Pan-Asian', 'Desserts'];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async (query = '') => {
    setLoading(true);
    try {
      const data = await restaurantApi.getAll(query);
      setRestaurants(data);
    } catch (err) {
      console.error('Failed to load restaurants', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(searchTerm);
  };

  const filteredRestaurants = restaurants.filter((r) => {
    if (selectedCuisine === 'All') return true;
    return r.cuisineType?.toLowerCase().includes(selectedCuisine.toLowerCase());
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-orange-500 to-amber-500 text-white py-16 sm:py-24">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            Fastest Delivery in City
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 drop-shadow-sm max-w-3xl mx-auto leading-tight">
            Craving Something Delicious? <br className="hidden sm:inline" />
            <span className="text-amber-200">We Deliver in 30 Mins.</span>
          </h1>

          <p className="text-orange-100 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
            Explore curated gourmet kitchens, woodfired pizzerias, authentic biryanis, and sweet bakeries right to your doorstep.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center bg-white rounded-2xl p-2 shadow-2xl text-gray-800">
            <div className="pl-3 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for restaurants, cuisines, or dishes..."
              className="w-full px-3 py-2 text-sm focus:outline-none bg-transparent placeholder-gray-400 font-medium"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* Highlights */}
          <div className="mt-12 grid grid-cols-3 max-w-lg mx-auto gap-4 text-center">
            <div className="p-2">
              <div className="text-2xl font-black text-amber-200">30+</div>
              <div className="text-[11px] text-orange-100 font-medium">Gourmet Dishes</div>
            </div>
            <div className="p-2 border-x border-white/20">
              <div className="text-2xl font-black text-amber-200">25 min</div>
              <div className="text-[11px] text-orange-100 font-medium">Average ETA</div>
            </div>
            <div className="p-2">
              <div className="text-2xl font-black text-amber-200">4.8 ★</div>
              <div className="text-[11px] text-orange-100 font-medium">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cuisine Filter Pills */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-brand-600" />
              Explore Cuisines
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredRestaurants.length} restaurants
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCuisine === c
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-500 hover:text-brand-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
            <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No restaurants found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">Try adjusting your search query or cuisine filter.</p>
            <button
              onClick={() => { setSelectedCuisine('All'); setSearchTerm(''); fetchRestaurants(''); }}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
