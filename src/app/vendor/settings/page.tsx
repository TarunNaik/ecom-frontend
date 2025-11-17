"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StoreSettings {
  storeName: string;
  storeDescription: string;
}

export default function VendorSettings() {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "",
    storeDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      fetchStoreSettings();
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchStoreSettings = () => {
    setLoading(true);
    // Simulate fetching from a backend
    setTimeout(() => {
      const savedSettings = localStorage.getItem("storeSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        // Default settings if none are saved
        setSettings({
          storeName: "My Awesome Store",
          storeDescription: "The best place to buy amazing things.",
        });
      }
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate saving to a backend
    setTimeout(() => {
      localStorage.setItem("storeSettings", JSON.stringify(settings));
      setIsSaving(false);
      alert("Store settings updated successfully!");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading Store Settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/vendor" className="text-indigo-600 hover:text-indigo-700">
              ← Back to Dashboard
            </Link>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <input
                id="storeName"
                name="storeName"
                type="text"
                required
                value={settings.storeName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter your store name"
              />
            </div>

            <div>
              <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Store Description
              </label>
              <textarea
                id="storeDescription"
                name="storeDescription"
                required
                value={settings.storeDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Describe your store"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
