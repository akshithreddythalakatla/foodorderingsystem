import React, { useState, useEffect } from 'react';
import { restaurantApi, foodItemApi } from '../../api/restaurantApi';
import { Plus, Trash2, Check, X, Utensils, Image, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';

const MenuManagement = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Mains',
    price: '',
    description: '',
    imageUrl: '',
    isVeg: true,
    isAvailable: true,
  });

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const rest = await restaurantApi.getMyRestaurant();
      setRestaurant(rest);
      const menuData = await foodItemApi.getByRestaurant(rest.id);
      setItems(menuData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (itemId) => {
    try {
      const updated = await foodItemApi.toggleAvailability(itemId);
      setItems(items.map((i) => (i.id === itemId ? updated : i)));
    } catch (err) {
      alert('Failed to toggle availability');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await foodItemApi.delete(itemId);
      setItems(items.filter((i) => i.id !== itemId));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const created = await foodItemApi.create(restaurant.id, {
        ...newItem,
        price: parseFloat(newItem.price),
        imageUrl: newItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
      });
      setItems([...items, created]);
      setShowAddModal(false);
      setNewItem({
        name: '',
        category: 'Mains',
        price: '',
        description: '',
        imageUrl: '',
        isVeg: true,
        isAvailable: true,
      });
    } catch (err) {
      alert('Failed to add food item: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Menu Management</h1>
          <p className="text-xs text-gray-500 mt-1">Add, update prices, toggle availability, and manage dishes for {restaurant?.name}</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Food Item
        </button>
      </div>

      {/* Menu Items Table / Grid */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 bg-white rounded-2xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No dishes on the menu yet</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">Click "Add Food Item" to add your first culinary masterpiece.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between transition-all ${
                !item.isAvailable ? 'opacity-60 bg-gray-50/50' : ''
              }`}
            >
              <div>
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold">
                    <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                    <span className="text-gray-700">{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                  </div>

                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                    ₹{item.price}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {item.isAvailable ? 'Available' : 'Sold Out'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    item.isAvailable
                      ? 'border-gray-200 text-gray-600 hover:bg-gray-100'
                      : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {item.isAvailable ? 'Mark as Sold Out' : 'Mark as In Stock'}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                  title="Delete dish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900">Add New Food Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paneer Butter Masala"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-brand-500 outline-none"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Breads">Breads</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="299.00"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Mouth-watering ingredients and flavor profile..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-brand-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isVeg}
                    onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                    className="accent-emerald-600 rounded"
                  />
                  <span className="text-xs font-bold text-gray-700">Vegetarian</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save Food Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
