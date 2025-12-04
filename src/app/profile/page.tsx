'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define the structure of the user profile data
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  imageUrl?: string;
  buyerProfile?: {
    id: number;
    shippingAddress: string;
    billingAddress: string;
    paymentMethods: string;
  };
  sellerProfile?: {
    id: number;
    businessName: string;
    businessAddress: string;
    contactNumber: string;
  };
}

export default function ProfilePage() {
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

        const response = await fetch('/api/v1/auth/profile', {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
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
    return null; // Should be handled by the loading/error states
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <Link href="/dashboard/buyer" className="text-sm text-indigo-600 hover:text-indigo-800">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-gray-600">{typeof user.name === 'string' && user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || 'User'}</h2>
                <p className="text-sm text-gray-500">{user.email || 'No email provided'}</p>
                <span className="inline-block mt-1 bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Buyer Profile Details */}
            {user.role === 'BUYER' && user.buyerProfile && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Buyer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">Shipping Address</p>
                    <p className="text-gray-800">{user.buyerProfile.shippingAddress || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Billing Address</p>
                    <p className="text-gray-800">{user.buyerProfile.billingAddress || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Payment Methods</p>
                    <p className="text-gray-800">{user.buyerProfile.paymentMethods || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between items-center">
              <Link
                href="/profile/edit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
