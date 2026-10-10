import React from 'react';
import { Utensils, Heart, ShieldCheck, Database, Server, Laptop } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Logo & About */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-gray-900">QuickBite</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Full-Stack Food Ordering & Delivery Management System built for seamless restaurant browsing, cart management, and real-time order tracking.
            </p>
          </div>

          {/* Architecture Tech Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-brand-600" /> Backend Stack
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>Java 21 LTS</li>
              <li>Spring Boot 3.3.4 (REST API)</li>
              <li>Spring Security & JWT Auth</li>
              <li>Spring Data JPA & Hibernate</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-600" /> Frontend & DB
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>React 18 + Vite</li>
              <li>Tailwind CSS</li>
              <li>Lucide Icons & React Router</li>
              <li>MySQL 8.0 Database</li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Role Access
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li><span className="font-semibold text-gray-800">Customer:</span> Browse, Cart, Checkout, Track</li>
              <li><span className="font-semibold text-gray-800">Restaurant Admin:</span> Menu & Orders</li>
              <li><span className="font-semibold text-gray-800">Delivery Partner:</span> Live status dispatch</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 QuickBite Online Food Ordering System. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with pair-programming and expert full-stack architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
