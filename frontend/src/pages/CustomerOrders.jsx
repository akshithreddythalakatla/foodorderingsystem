import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { Clock, ArrowRight, ShoppingBag, Store, Calendar } from 'lucide-react';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load past orders', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Your Orders</h1>
          <p className="text-xs text-gray-500 mt-1">Review past orders and track ongoing deliveries</p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all"
        >
          Order Food
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">No orders yet</h3>
          <p className="text-xs text-gray-500 mb-6">Looks like you haven't placed any orders so far.</p>
          <Link to="/" className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md">
            Start Ordering
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-black text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md">
                    {order.orderNumber}
                  </span>
                  <OrderStatusBadge status={order.status} />
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-brand-600" />
                  <span className="text-base font-bold text-gray-900">{order.restaurant?.name}</span>
                </div>

                <div className="text-xs text-gray-500 line-clamp-1">
                  {order.items?.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 gap-3">
                <div className="text-right">
                  <div className="text-base font-black text-gray-900">₹{order.totalAmount?.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{order.items?.length || 0} items • {order.paymentMethod}</div>
                </div>

                <Link
                  to={`/order-tracking/${order.orderNumber}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-brand-600 text-xs font-bold transition-colors"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
