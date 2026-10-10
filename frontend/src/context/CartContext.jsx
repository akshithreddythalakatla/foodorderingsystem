import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(() => {
    const saved = localStorage.getItem('cart_restaurant');
    return saved ? JSON.parse(saved) : null;
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
    if (items.length === 0) {
      setRestaurant(null);
      localStorage.removeItem('cart_restaurant');
    } else if (restaurant) {
      localStorage.setItem('cart_restaurant', JSON.stringify(restaurant));
    }
  }, [items, restaurant]);

  const addItem = (currentRestaurant, foodItem) => {
    if (restaurant && restaurant.id !== currentRestaurant.id && items.length > 0) {
      const confirmReset = window.confirm(
        `Your cart already contains items from "${restaurant.name}". Would you like to clear your cart and add items from "${currentRestaurant.name}" instead?`
      );
      if (!confirmReset) return false;
      setItems([{ ...foodItem, quantity: 1 }]);
      setRestaurant(currentRestaurant);
      setIsCartOpen(true);
      return true;
    }

    setRestaurant(currentRestaurant);
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === foodItem.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === foodItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...foodItem, quantity: 1 }];
    });
    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (itemId, delta) => {
    setItems((prevItems) => {
      return prevItems
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
    localStorage.removeItem('cart_items');
    localStorage.removeItem('cart_restaurant');
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = restaurant?.deliveryFee || 40;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const totalAmount = subtotal > 0 ? Math.round((subtotal + deliveryFee + tax) * 100) / 100 : 0;
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        restaurant,
        items,
        isCartOpen,
        setIsCartOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        deliveryFee,
        tax,
        totalAmount,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
