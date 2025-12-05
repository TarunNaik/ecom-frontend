"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import WelcomeBanner from "@/components/WelcomeBanner";
import DashboardCard from "@/components/DashboardCard";

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
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');

    if (!authToken || !storedUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role.toLowerCase() !== 'buyer') {
      // If the role is not 'buyer', redirect to the appropriate dashboard or login
      // For now, we'll just redirect to login to prevent access.
      router.push('/login');
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-lg font-medium text-gray-700">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner user={user} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Browse Products"
            description="Explore our wide range of products"
            link="/browse-products"
            icon="🛍️"
          />
          <DashboardCard
            title="My Orders"
            description="Track your orders and purchases"
            link="/orders"
            icon="📦"
          />
          <DashboardCard
            title="Shopping Cart"
            description="Review items in your cart"
            link="/cart"
            icon="🛒"
          />
          <DashboardCard
            title="Wishlist"
            description="Save your favorite items for later"
            link="/wishlist"
            icon="❤️"
          />
          <DashboardCard
            title="Profile Settings"
            description="Manage your account details"
            link="/profile"
            icon="⚙️"
          />
          <DashboardCard
            title="Support"
            description="Get help with your purchases"
            link="/support"
            icon="💬"
          />
        </div>
      </main>
    </div>
  );
}
