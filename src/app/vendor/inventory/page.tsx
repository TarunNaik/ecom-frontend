"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function VendorInventory() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = "/login";
    }
  }, []);

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
        <div className="mb-6 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <Link
              href="/dashboard/vendor"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              &larr; Back to Dashboard
            </Link>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mt-1">
              Inventory
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">Inventory page is under construction.</p>
        </div>
      </main>
    </div>
  );
}