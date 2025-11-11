"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

export default function VendorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      fetchStats();
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error("No auth token found");
        setLoading(false);
        return;
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      // Fetch products count
      const productsResponse = await fetch("http://localhost:8080/api/products/list", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers,
      });

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const products = Array.isArray(productsData) ? productsData : 
                        (productsData.products || productsData.data || []);
        
        console.log("Fetched products for stats:", products.length);
        setStats(prev => ({
          ...prev,
          totalProducts: products.length,
        }));
      }

      // TODO: Fetch other stats when backend endpoints are ready:
      // - GET /api/vendor/orders/count
      // - GET /api/vendor/orders/pending-count
      // - GET /api/vendor/revenue

    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
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
            <p className="text-gray-600 text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold text-indigo-600">
              {loading ? "..." : stats.totalProducts}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-green-600">
              {loading ? "..." : stats.totalOrders}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Pending Orders</p>
            <p className="text-3xl font-bold text-yellow-600">
              {loading ? "..." : stats.pendingOrders}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">
              {loading ? "..." : `$${stats.totalRevenue.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Products */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Products</h3>
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-gray-600 mb-4">Add, edit, or remove products</p>
            <Link
              href="/vendor/products"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage Products →
            </Link>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Orders</h3>
              <span className="text-3xl">🛒</span>
            </div>
            <p className="text-gray-600 mb-4">View and manage customer orders</p>
            <Link
              href="/vendor/orders"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Orders →
            </Link>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Inventory</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-gray-600 mb-4">Track stock levels</p>
            <Link
              href="/vendor/inventory"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage Inventory →
            </Link>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Analytics</h3>
              <span className="text-3xl">📈</span>
            </div>
            <p className="text-gray-600 mb-4">View sales and performance</p>
            <Link
              href="/vendor/analytics"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Analytics →
            </Link>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <span className="text-3xl">⭐</span>
            </div>
            <p className="text-gray-600 mb-4">Manage product reviews</p>
            <Link
              href="/vendor/reviews"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Reviews →
            </Link>
          </div>

          {/* Store Settings */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Store Settings</h3>
              <span className="text-3xl">⚙️</span>
            </div>
            <p className="text-gray-600 mb-4">Configure your store</p>
            <Link
              href="/vendor/settings"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Edit Settings →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
