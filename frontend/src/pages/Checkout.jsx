import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { MapPin, Phone, CreditCard, Banknote, QrCode, ShieldCheck, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';

const Checkout = () => {
  const { restaurant, items, subtotal, deliveryFee, tax, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || 'Flat 402, Green Meadows Apt, Indiranagar, Bengaluru');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">No items to checkout</h2>
        <p className="text-xs text-gray-500 mb-6">Browse delicious dishes from our restaurants and add them to your cart.</p>
        <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs">
          Explore Restaurants
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      setError('Please provide complete delivery address and phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        restaurantId: restaurant.id,
        deliveryAddress: address,
        deliveryPhone: phone,
        customerNotes: notes,
        paymentMethod: paymentMethod,
        items: items.map((i) => ({
          foodItemId: i.id,
          quantity: i.quantity,
        })),
      };

      const createdOrder = await orderApi.create(orderPayload);
      clearCart();
      navigate(`/order-tracking/${createdOrder.orderNumber}`);
    } catch (err) {
      console.error('Order creation failed', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to={`/restaurant/${restaurant?.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </Link>

      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">
        Checkout & Confirm Order
      </h1>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" />
              1. Delivery Address & Contact
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Delivery Street Address
                </label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="House number, flat, building, street, landmark, city"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Recipient Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+91 9876543210"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Special Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ring bell twice, leave with security guard, extra spicy"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-600" />
              2. Select Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* UPI */}
              <label
                className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <QrCode className="w-5 h-5 text-brand-600" />
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="accent-brand-600"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Instant UPI</div>
                  <div className="text-[10px] text-gray-500">GPay, PhonePe, Paytm</div>
                </div>
              </label>

              {/* Card */}
              <label
                className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'CARD'
                    ? 'border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="accent-brand-600"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Card Payment</div>
                  <div className="text-[10px] text-gray-500">Credit / Debit Card</div>
                </div>
              </label>

              {/* COD */}
              <label
                className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-brand-600"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Cash on Delivery</div>
                  <div className="text-[10px] text-gray-500">Pay upon delivery</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24 space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Order Summary</h3>
              <p className="text-xs text-gray-500 font-medium">Ordering from {restaurant?.name}</p>
            </div>

            {/* Items list */}
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold text-gray-700">{item.quantity}x</span>
                    <span className="text-gray-800 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 whitespace-nowrap">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Bill breakdown */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-gray-900">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Taxes (5%)</span>
                <span className="font-semibold text-gray-900">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 text-base font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-brand-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="p-3 rounded-xl bg-gray-50 text-[11px] text-gray-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Safe & Contactless Delivery with live GPS status</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing Order...' : `Pay & Place Order • ₹${totalAmount.toFixed(2)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
