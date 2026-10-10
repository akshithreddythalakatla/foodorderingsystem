import React from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Minus } from 'lucide-react';

const FoodItemCard = ({ item, restaurant }) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className={`p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4 ${!item.isAvailable ? 'opacity-60 grayscale-[40%]' : ''}`}>
      {/* Item Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {/* Veg / Non-veg indicator */}
            <div className={`w-4 h-4 rounded border flex items-center justify-center p-0.5 ${item.isVeg ? 'border-emerald-600' : 'border-rose-600'}`}>
              <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            </div>
            {item.category && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {item.category}
              </span>
            )}
          </div>

          <h4 className="text-base font-bold text-gray-900 mb-1">{item.name}</h4>
          <div className="text-sm font-extrabold text-gray-900 mb-2">₹{item.price}</div>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {!item.isAvailable && (
          <div className="text-xs font-semibold text-rose-500 mt-2">Currently Unavailable</div>
        )}
      </div>

      {/* Image & Add/Quantity Button */}
      <div className="relative w-28 h-28 flex-shrink-0 flex flex-col items-center">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}
          alt={item.name}
          className="w-28 h-24 rounded-xl object-cover shadow-inner bg-gray-100"
          loading="lazy"
        />

        {item.isAvailable && (
          <div className="absolute -bottom-2">
            {quantity > 0 ? (
              <div className="flex items-center bg-white border-2 border-brand-500 rounded-lg shadow-md px-2 py-1 gap-2 text-xs font-bold text-brand-600">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="hover:text-brand-800 transition-colors p-0.5"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="min-w-[14px] text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="hover:text-brand-800 transition-colors p-0.5"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addItem(restaurant, item)}
                className="flex items-center gap-1 bg-white hover:bg-brand-50 text-brand-600 border-2 border-brand-500 hover:border-brand-600 font-bold px-4 py-1 rounded-lg text-xs shadow-md transition-all uppercase tracking-wider"
              >
                ADD
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItemCard;
