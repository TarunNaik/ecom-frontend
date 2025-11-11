"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Total Users</p>
            <p className="text-3xl font-bold text-indigo-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Total Vendors</p>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold text-yellow-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">$0</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">User Management</h3>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-gray-600 mb-4">Manage all users and permissions</p>
            <Link
              href="/admin/users"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage Users →
            </Link>
          </div>

          {/* Vendor Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Vendor Management</h3>
              <span className="text-3xl">🏪</span>
            </div>
            <p className="text-gray-600 mb-4">Approve and manage vendors</p>
            <Link
              href="/admin/vendors"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage Vendors →
            </Link>
          </div>

          {/* Product Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Product Management</h3>
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-gray-600 mb-4">Oversee all products</p>
            <Link
              href="/admin/products"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage Products →
            </Link>
          </div>

          {/* Order Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Order Management</h3>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-gray-600 mb-4">Monitor all orders</p>
            <Link
              href="/admin/orders"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Orders →
            </Link>
          </div>

          {/* Analytics & Reports */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Analytics</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-gray-600 mb-4">View platform analytics</p>
            <Link
              href="/admin/analytics"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Reports →
            </Link>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Categories</h3>
              <span className="text-3xl">🏷️</span>
            </div>
            <p className="text-gray-600 mb-4">Manage product categories</p>
            <Link
              href="/admin/categories"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage Categories →
            </Link>
          </div>

          {/* Disputes */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Disputes</h3>
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-gray-600 mb-4">Handle customer disputes</p>
            <Link
              href="/admin/disputes"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Disputes →
            </Link>
          </div>

          {/* Platform Settings */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Platform Settings</h3>
              <span className="text-3xl">⚙️</span>
            </div>
            <p className="text-gray-600 mb-4">Configure platform settings</p>
            <Link
              href="/admin/settings"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage Settings →
            </Link>
          </div>

          {/* System Logs */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">System Logs</h3>
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-gray-600 mb-4">View system activity logs</p>
            <Link
              href="/admin/logs"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Logs →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
