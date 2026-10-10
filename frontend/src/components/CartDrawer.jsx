import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const CartDrawer = () => {
  const {
    restaurant,
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    totalAmount,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">Your Cart</h3>
                {restaurant && (
                  <p className="text-xs text-gray-500 font-medium">from {restaurant.name}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body items */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4 text-brand-500">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">Your cart is empty</h4>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Explore top restaurants nearby and add some delicious treats to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-md hover:bg-brand-700 transition-colors"
                >
                  Browse Menus
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded border flex items-center justify-center p-0.5 ${item.isVeg ? 'border-emerald-600' : 'border-rose-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </div>
                      <h5 className="text-sm font-bold text-gray-800 truncate">{item.name}</h5>
                    </div>
                    <div className="text-xs text-gray-500 font-semibold mt-1">₹{item.price} each</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-2 py-1 gap-2 text-xs font-bold">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-gray-500 hover:text-brand-600 p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="min-w-[14px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-gray-500 hover:text-brand-600 p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-sm font-extrabold text-gray-900 min-w-[50px] text-right">
                      ₹{item.price * item.quantity}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-rose-500 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer calculation */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-800">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Restaurant Charges (5%)</span>
                  <span className="font-semibold text-gray-800">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-extrabold text-gray-900">
                  <span>To Pay</span>
                  <span className="text-brand-600">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-500 text-xs font-semibold"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
