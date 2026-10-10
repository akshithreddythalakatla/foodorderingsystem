import axiosClient from './axiosClient';

export const restaurantApi = {
  getAll: (query) => axiosClient.get(query ? `/restaurants?query=${encodeURIComponent(query)}` : '/restaurants'),
  getById: (id) => axiosClient.get(`/restaurants/${id}`),
  getMyRestaurant: () => axiosClient.get('/restaurants/my-restaurant'),
  create: (data) => axiosClient.post('/restaurants', data),
  update: (id, data) => axiosClient.put(`/restaurants/${id}`, data),
};

export const foodItemApi = {
  getByRestaurant: (restaurantId) => axiosClient.get(`/food-items/restaurant/${restaurantId}`),
  getById: (id) => axiosClient.get(`/food-items/${id}`),
  create: (restaurantId, data) => axiosClient.post(`/food-items/restaurant/${restaurantId}`, data),
  update: (id, data) => axiosClient.put(`/food-items/${id}`, data),
  toggleAvailability: (id) => axiosClient.patch(`/food-items/${id}/availability`),
  delete: (id) => axiosClient.delete(`/food-items/${id}`),
};
