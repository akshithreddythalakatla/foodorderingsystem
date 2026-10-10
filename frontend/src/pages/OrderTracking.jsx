import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { CheckCircle2, Clock, Bike, ChefHat, MapPin, Phone, ArrowLeft, RefreshCw, ShoppingBag, ShieldCheck, Play } from 'lucide-react';

const OrderTracking = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusSteps = [
    { key: 'PLACED', title: 'Order Placed', desc: 'Received by system', icon: Clock },
    { key: 'CONFIRMED', title: 'Confirmed', desc: 'Accepted by restaurant', icon: CheckCircle2 },
    { key: 'PREPARING', title: 'Preparing Food', desc: 'Kitchen is cooking', icon: ChefHat },
    { key: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', desc: 'Delivery partner on the way', icon: Bike },
    { key: 'DELIVERED', title: 'Delivered', desc: 'Enjoy your meal!', icon: CheckCircle2 },
  ];

  const fetchOrder = async () => {
    try {
      const data = await orderApi.track(orderNumber);
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError('Unable to locate order: ' + orderNumber);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 4 seconds for real-time tracking
    const interval = setInterval(fetchOrder, 4000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  // Demo status advancement helper
  const advanceDemoStatus = async () => {
    if (!order) return;
    const flow = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = flow.indexOf(order.status);
    if (currentIndex < flow.length - 1) {
      const nextStatus = flow[currentIndex + 1];
      setUpdatingStatus(true);
      try {
        const updated = await orderApi.updateStatus(order.id, nextStatus, order.deliveryPersonnel?.id || 3);
        setOrder(updated);
      } catch (err) {
        console.error(err);
      } finally {
        setUpdatingStatus(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-600">Connecting to live delivery tracking...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">{error || 'Please check your order number and try again.'}</p>
        <Link to="/" className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Go to Home
        </Link>
      </div>
    );
  }

  const getStepIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'READY_FOR_PICKUP': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-600 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Live Order Tracking
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Order Reference: <span className="font-mono font-bold text-gray-800">{order.orderNumber}</span>
          </p>
        </div>

        {/* Demo Fast-Forward Button for Evaluators */}
        {order.status !== 'DELIVERED' && (
          <button
            onClick={advanceDemoStatus}
            disabled={updatingStatus}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all shadow-xs"
            title="Advance the order status forward for quick demonstration"
          >
            <Play className="w-3.5 h-3.5 fill-purple-700" />
            {updatingStatus ? 'Updating...' : 'Advance Status (Demo Step)'}
          </button>
        )}
      </div>

      {/* Real-time Status Card & Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md mb-8">
        {/* ETA & Status headline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-100 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              {order.status === 'DELIVERED' ? 'Order Completed' : 'Estimated Arrival'}
            </div>
            <div className="text-2xl sm:text-4xl font-black text-gray-900">
              {order.status === 'DELIVERED' ? 'Delivered with Success!' : `${order.estimatedDeliveryTime || '25-30 mins'}`}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>Live Sync Active</span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="relative mb-6">
          <div className="hidden sm:block absolute top-6 inset-x-12 h-1 bg-gray-200 -z-0">
            <div
              className="h-full bg-brand-600 transition-all duration-700"
              style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
            {statusSteps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.key} className="flex sm:flex-col items-center gap-4 sm:gap-2 text-left sm:text-center">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-100 scale-110'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className={`text-xs font-bold ${isCurrent ? 'text-brand-600' : isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </div>
                    <div className="text-[10px] text-gray-500 leading-tight">
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Partner & Locations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Partner Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bike className="w-4 h-4 text-brand-600" />
              Delivery Partner Assigned
            </h3>

            <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/60 border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center font-extrabold text-base shadow">
                  VS
                </div>
                <div>
                  <div className="text-sm font-extrabold text-gray-900">
                    {order.deliveryPersonnel?.name || 'Vikram Singh (Express Delivery)'}
                  </div>
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-0.5">
                    <span>Electric Scooter</span>
                    <span>•</span>
                    <span className="text-amber-600 font-bold">★ 4.9 (420+ trips)</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${order.deliveryPersonnel?.phone || '+919988776655'}`}
                className="p-3 rounded-xl bg-white shadow-xs border border-orange-200 text-brand-600 hover:bg-brand-600 hover:text-white transition-colors"
                title="Call Delivery Partner"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Delivery Verification OTP</span>
              <span className="font-mono font-black text-sm text-gray-900 bg-gray-100 px-3 py-1 rounded-md tracking-widest">
                {String(order.id * 137).slice(-4).padStart(4, '7')}
              </span>
            </div>
          </div>

          {/* Restaurant and Delivery Address */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pick Up From</div>
              <div className="text-xs font-bold text-gray-800">{order.restaurant?.name}</div>
              <div className="text-xs text-gray-500">{order.restaurant?.address}</div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deliver To</div>
              <div className="text-xs font-bold text-gray-800">{order.customer?.name}</div>
              <div className="text-xs text-gray-500">{order.deliveryAddress}</div>
              {order.deliveryPhone && (
                <div className="text-xs text-gray-500 mt-0.5">Phone: {order.deliveryPhone}</div>
              )}
              {order.customerNotes && (
                <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-200">
                  Note: "{order.customerNotes}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ordered Items and Receipt */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              Itemized Bill
            </h3>

            <div className="divide-y divide-gray-100 text-xs">
              {order.items?.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800 mr-2">{item.quantity}x</span>
                    <span className="text-gray-700">{item.itemName}</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & GST (5%)</span>
                <span>₹{order.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
                <span>Total Paid</span>
                <span className="text-brand-600">₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Paid via {order.paymentMethod}</span>
              <span className="text-emerald-600 font-bold uppercase">{order.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
