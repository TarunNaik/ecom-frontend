"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  imageUrl?: string;
}

export default function BuyerDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:8080/api/auth/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push('/login');
          }
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        const localUser = localStorage.getItem('user');
        if(localUser) {
            setUser(JSON.parse(localUser));
        } else {
            router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <Link href="/login" className="text-indigo-600 hover:underline mt-2 inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Welcome, {user.name || 'User'}!
            </h2>
            <p className="text-gray-600">Email: {user.email || 'N/A'}</p>
            <p className="text-gray-600">Role: {user.role.toUpperCase()}</p>
          </div>
          <div className="ml-4">
            <Image
              src={user.imageUrl || `https://i.pravatar.cc/150?u=${user.email}`}
              alt="User Avatar"
              className="w-30 h-25 rounded-full"
              width={64}
              height={64}
            />
          </div>
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
