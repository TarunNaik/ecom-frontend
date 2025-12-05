"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { replaceCurrency } from "../../../utils/currency";
import Header from "@/components/Header";
import WelcomeBanner from "@/components/WelcomeBanner";
import DashboardCard from "@/components/DashboardCard";

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
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');

    if (!authToken || !storedUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role.toLowerCase() !== 'vendor') {
      router.push('/login');
      return;
    }

    setUser(userData);
    fetchStats();
  }, [router]);

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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
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
            title="My Products"
            description="Add, edit, or remove products"
            link="/vendor/products"
            icon="📦"
          />
          <DashboardCard
            title="Orders"
            description="View and manage customer orders"
            link="/vendor/orders"
            icon="🛒"
          />
          <DashboardCard
            title="Inventory"
            description="Track stock levels"
            link="/vendor/inventory"
            icon="📊"
          />
          <DashboardCard
            title="Analytics"
            description="View sales and performance"
            link="/vendor/analytics"
            icon="📈"
          />
          <DashboardCard
            title="Reviews"
            description="Manage product reviews"
            link="/vendor/reviews"
            icon="⭐"
          />
          <DashboardCard
            title="Store Settings"
            description="Configure your store"
            link="/vendor/settings"
            icon="⚙️"
          />
        </div>
      </main>
    </div>
  );
}
