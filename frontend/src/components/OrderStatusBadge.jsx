import React from 'react';
import { Clock, CheckCircle2, Flame, PackageCheck, Bike, PartyPopper, XCircle } from 'lucide-react';

const OrderStatusBadge = ({ status }) => {
  const config = {
    PLACED: {
      label: 'Order Placed',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Clock,
    },
    CONFIRMED: {
      label: 'Confirmed',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: CheckCircle2,
    },
    PREPARING: {
      label: 'Cooking in Kitchen',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Flame,
    },
    READY_FOR_PICKUP: {
      label: 'Ready for Pickup',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: PackageCheck,
    },
    OUT_FOR_DELIVERY: {
      label: 'Out for Delivery',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Bike,
    },
    DELIVERED: {
      label: 'Delivered',
      bg: 'bg-green-100 text-green-800 border-green-300',
      icon: PartyPopper,
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: XCircle,
    },
  };

  const item = config[status] || config.PLACED;
  const Icon = item.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${item.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {item.label}
    </span>
  );
};

export default OrderStatusBadge;
