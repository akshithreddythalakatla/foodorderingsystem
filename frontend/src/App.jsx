import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import CustomerOrders from './pages/CustomerOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import MenuManagement from './pages/restaurant/MenuManagement';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-brand-500 selection:text-white">
            <Navbar />
            <CartDrawer />

            <main className="flex-1">
              <Routes>
                {/* Public & Customer Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/order-tracking/:orderNumber" element={<OrderTracking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Protected Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <CustomerOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Restaurant Admin Routes */}
                <Route
                  path="/restaurant/dashboard"
                  element={
                    <ProtectedRoute requiredRole="RESTAURANT_ADMIN">
                      <RestaurantDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/restaurant/menu"
                  element={
                    <ProtectedRoute requiredRole="RESTAURANT_ADMIN">
                      <MenuManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Delivery Personnel Routes */}
                <Route
                  path="/delivery/dashboard"
                  element={
                    <ProtectedRoute requiredRole="DELIVERY_PERSONNEL">
                      <DeliveryDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
