import React, { useState, useEffect } from 'react';
import { orderApi } from '../../api/orderApi';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { Bike, Package, MapPin, Phone, CheckCircle2, Clock, DollarSign, RefreshCw, Navigation } from 'lucide-react';

const DeliveryDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [available, mine] = await Promise.all([
        orderApi.getAvailableDeliveries(),
        orderApi.getMyDeliveries(),
      ]);
      setAvailableOrders(available.filter((o) => !mine.some((m) => m.id === o.id)));
      setMyOrders(mine);
    } catch (err) {
      console.error('Failed to load deliveries', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    setActionLoading(orderId);
    try {
      await orderApi.assignDelivery(orderId);
      await loadData();
    } catch (err) {
      alert('Failed to accept delivery: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionLoading(orderId);
    try {
      await orderApi.updateStatus(orderId, newStatus);
      await loadData();
    } catch (err) {
      alert('Failed to update delivery status: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
        <p className="text-xs font-semibold text-gray-500">Loading Courier Dispatch Portal...</p>
      </div>
    );
  }

  const activeDeliveries = myOrders.filter((o) => o.status !== 'DELIVERED');
  const completedDeliveries = myOrders.filter((o) => o.status === 'DELIVERED');
  const totalEarnings = completedDeliveries.length * 40;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
            <Bike className="w-3 h-3" />
            Courier Partner Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Delivery Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">Accept nearby pickup tasks and update delivery progress in real time</p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Orders
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Pickups</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">{activeDeliveries.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Bike className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivered Today</div>
            <div className="text-3xl font-black text-gray-900 mt-1">{completedDeliveries.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Payout</div>
            <div className="text-3xl font-black text-amber-600 mt-1">₹{totalEarnings}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 1. Active Assigned Deliveries */}
      <div className="mb-12">
        <h2 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-600" />
          My Active Deliveries ({activeDeliveries.length})
        </h2>

        {activeDeliveries.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center text-gray-400">
            <p className="text-xs font-medium">No active deliveries assigned to you right now. Pick an order from the available pool below!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeDeliveries.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded">
                    {order.orderNumber}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="font-bold text-gray-400 uppercase text-[10px]">Pickup From</div>
                    <div className="font-bold text-gray-900 mt-0.5">{order.restaurant?.name}</div>
                    <div className="text-gray-500">{order.restaurant?.address}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="font-bold text-gray-400 uppercase text-[10px]">Deliver To</div>
                    <div className="font-bold text-gray-900 mt-0.5">{order.customer?.name}</div>
                    <div className="text-gray-500">{order.deliveryAddress}</div>
                    {order.deliveryPhone && (
                      <div className="text-brand-600 font-bold mt-1">📞 {order.deliveryPhone}</div>
                    )}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="pt-2 flex items-center gap-2">
                  {order.status !== 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                      disabled={actionLoading === order.id}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
                    >
                      Pick Up & Start Trip
                    </button>
                  )}

                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                      disabled={actionLoading === order.id}
                      className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Delivered (Handover)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Available Orders Pool */}
      <div>
        <h2 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-brand-600" />
          Available Orders to Pick Up ({availableOrders.length})
        </h2>

        {availableOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center text-gray-400">
            <p className="text-xs font-medium">All restaurant orders are currently assigned or in kitchen preparation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="font-bold text-gray-900">{order.restaurant?.name}</div>
                    <div className="text-gray-500 text-[11px] line-clamp-1">{order.restaurant?.address}</div>
                    <div className="text-[11px] text-gray-400 mt-2">
                      Drop: {order.deliveryAddress}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs font-black text-gray-900">
                    ₹40 <span className="text-[10px] text-gray-400 font-normal">payout</span>
                  </div>

                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    disabled={actionLoading === order.id}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Accept Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
