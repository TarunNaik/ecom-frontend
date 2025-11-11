"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BuyerDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {user.name || user.Name || user.email?.split('@')[0] || 'User'}!
          </h2>
          <p className="text-gray-600">Email: {user.email || user.Email || 'N/A'}</p>
          <p className="text-gray-600">Role: {(user.role || user.Role || '').toUpperCase()}</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Browse Products */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Browse Products</h3>
              <span className="text-3xl">🛍️</span>
            </div>
            <p className="text-gray-600 mb-4">Explore our wide range of products</p>
            <Link
              href="/products"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Products →
            </Link>
          </div>

          {/* My Orders */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Orders</h3>
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-gray-600 mb-4">Track your orders and purchases</p>
            <Link
              href="/orders"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Orders →
            </Link>
          </div>

          {/* Shopping Cart */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Shopping Cart</h3>
              <span className="text-3xl">🛒</span>
            </div>
            <p className="text-gray-600 mb-4">Review items in your cart</p>
            <Link
              href="/cart"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Cart →
            </Link>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Wishlist</h3>
              <span className="text-3xl">❤️</span>
            </div>
            <p className="text-gray-600 mb-4">Save items for later</p>
            <Link
              href="/wishlist"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Wishlist →
            </Link>
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Profile Settings</h3>
              <span className="text-3xl">⚙️</span>
            </div>
            <p className="text-gray-600 mb-4">Manage your account settings</p>
            <Link
              href="/profile"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Edit Profile →
            </Link>
          </div>

          {/* Customer Support */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Support</h3>
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-gray-600 mb-4">Get help with your purchases</p>
            <Link
              href="/support"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
