import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { restaurantApi } from '../../api/restaurantApi';
import { orderApi } from '../../api/orderApi';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { ChefHat, ShoppingBag, DollarSign, Clock, RefreshCw, CheckCircle2, Flame, PackageCheck, XCircle, Store } from 'lucide-react';

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadOrdersOnly, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const rest = await restaurantApi.getMyRestaurant();
      setRestaurant(rest);
      const ordersData = await orderApi.getRestaurantOrders(rest.id);
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load restaurant dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrdersOnly = async () => {
    if (!restaurant) return;
    try {
      const ordersData = await orderApi.getRestaurantOrders(restaurant.id);
      setOrders(ordersData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionLoading(orderId);
    try {
      await orderApi.updateStatus(orderId, newStatus);
      await loadOrdersOnly();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleRestaurantStatus = async () => {
    if (!restaurant) return;
    try {
      const updated = await restaurantApi.update(restaurant.id, {
        ...restaurant,
        isOpen: !restaurant.isOpen,
      });
      setRestaurant(updated);
    } catch (err) {
      alert('Failed to update restaurant status');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
        <p className="text-xs font-semibold text-gray-500">Loading Restaurant Portal...</p>
      </div>
    );
  }

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrders = orders.filter((o) => !['DELIVERED', 'CANCELLED'].includes(o.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
              Restaurant Manager Portal
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${restaurant?.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {restaurant?.isOpen ? 'Kitchen Open' : 'Orders Paused'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {restaurant?.name || 'Restaurant Dashboard'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">{restaurant?.address} • {restaurant?.cuisineType}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleRestaurantStatus}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              restaurant?.isOpen
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {restaurant?.isOpen ? 'Pause Incoming Orders' : 'Open Restaurant'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Orders</div>
            <div className="text-3xl font-black text-purple-600 mt-1">{activeOrders.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</div>
            <div className="text-3xl font-black text-gray-900 mt-1">{orders.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sales</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">₹{totalRevenue.toFixed(2)}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Incoming Orders Manager */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Live Kitchen Orders</h2>
            <p className="text-xs text-gray-500">Real-time status updates dispatch directly to customers and couriers</p>
          </div>
          <button
            onClick={loadOrdersOnly}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <ChefHat className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-sm font-bold text-gray-700">No orders placed yet</h3>
            <p className="text-xs text-gray-400 mt-1">When customers place orders, they will appear here instantly.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                {/* Order Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <span className="text-xs font-bold text-gray-700">
                      Customer: {order.customer?.name}
                    </span>
                    {order.customer?.phone && (
                      <span className="text-xs text-gray-400">({order.customer?.phone})</span>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700 space-y-1">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          <strong className="text-gray-900">{item.quantity}x</strong> {item.itemName}
                        </span>
                        <span className="font-mono font-semibold">₹{item.subtotal}</span>
                      </div>
                    ))}
                    {order.customerNotes && (
                      <div className="pt-2 text-amber-700 font-medium border-t border-gray-200">
                        Note: "{order.customerNotes}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                    <span>Deliver to: {order.deliveryAddress}</span>
                    <span>•</span>
                    <span className="font-extrabold text-gray-900">Total: ₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                  {order.status === 'PLACED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                      disabled={actionLoading === order.id}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Accept Order
                    </button>
                  )}

                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      disabled={actionLoading === order.id}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      Start Cooking
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                      disabled={actionLoading === order.id}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      Ready for Pickup
                    </button>
                  )}

                  {order.status === 'READY_FOR_PICKUP' && (
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                      Waiting for Courier
                    </span>
                  )}

                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      Courier on the Road
                    </span>
                  )}

                  {order.status === 'DELIVERED' && (
                    <span className="text-xs font-bold text-green-800 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                      Completed
                    </span>
                  )}

                  {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                      disabled={actionLoading === order.id}
                      className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
