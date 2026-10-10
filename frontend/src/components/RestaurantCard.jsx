import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Bike, MapPin } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Rating pill */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow flex items-center gap-1 text-xs font-bold text-gray-800">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{restaurant.rating.toFixed(1)}</span>
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow ${restaurant.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            {restaurant.isOpen ? 'Open Now' : 'Closed'}
          </span>
          <span className="text-white text-xs font-medium drop-shadow flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {restaurant.deliveryTimeMinutes} mins
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-xs font-semibold text-brand-600 mb-2">
            {restaurant.cuisineType}
          </p>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {restaurant.description}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Bike className="w-3.5 h-3.5 text-gray-400" />
            <span>₹{restaurant.deliveryFee} delivery</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[140px]">{restaurant.address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
