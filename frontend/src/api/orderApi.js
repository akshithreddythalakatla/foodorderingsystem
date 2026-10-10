import axiosClient from './axiosClient';

export const orderApi = {
  create: (data) => axiosClient.post('/orders', data),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  track: (orderNumber) => axiosClient.get(`/orders/track/${orderNumber}`),
  getMyOrders: () => axiosClient.get('/orders/my-orders'),
  getRestaurantOrders: (restaurantId) => axiosClient.get(`/orders/restaurant/${restaurantId}`),
  getAvailableDeliveries: () => axiosClient.get('/orders/available-deliveries'),
  getMyDeliveries: () => axiosClient.get('/orders/my-deliveries'),
  updateStatus: (id, status, deliveryPersonnelId) => 
    axiosClient.patch(`/orders/${id}/status`, { status, deliveryPersonnelId }),
  assignDelivery: (id) => axiosClient.patch(`/orders/${id}/assign-delivery`),
};
