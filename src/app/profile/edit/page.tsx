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

export default function EditProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Separate states for image handling
  const [imageUrl, setImageUrl] = useState(''); // For the <img> preview
  const [imageFile, setImageFile] = useState<File | null>(null); // For the uploaded file
  const [imageUrlInput, setImageUrlInput] = useState(''); // For the text input field

  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [paymentMethods, setPaymentMethods] = useState('');

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

        // Initialize form fields with user data
        setName(userData.name || '');
        setEmail(userData.email || '');
        setImageUrl(userData.imageUrl || '');
        setImageUrlInput(userData.imageUrl || '');

        if (userData.buyerProfile) {
          setShippingAddress(userData.buyerProfile.shippingAddress || '');
          setBillingAddress(userData.buyerProfile.billingAddress || '');
          setPaymentMethods(userData.buyerProfile.paymentMethods || '');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrlInput(file.name); // Show the filename in the input

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('User data not loaded yet.');
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        router.push('/login');
        return;
      }

      const formData = new FormData();
      let hasChanges = false;

      // Append changed fields to FormData
      if (name !== user.name) {
        formData.append('name', name);
        hasChanges = true;
      }

      if (imageFile) {
        formData.append('imageUrl', imageFile);
        hasChanges = true;
      } else if (imageUrlInput !== (user.imageUrl || '')) {
        formData.append('imageUrl', imageUrlInput);
        hasChanges = true;
      }

      if (user.role === 'BUYER' && user.buyerProfile) {
        const buyerProfilePayload: { [key: string]: any } = {};
        if (shippingAddress !== user.buyerProfile.shippingAddress) {
          buyerProfilePayload.shippingAddress = shippingAddress;
        }
        if (billingAddress !== user.buyerProfile.billingAddress) {
          buyerProfilePayload.billingAddress = billingAddress;
        }
        if (paymentMethods !== user.buyerProfile.paymentMethods) {
          buyerProfilePayload.paymentMethods = paymentMethods;
        }

        if (Object.keys(buyerProfilePayload).length > 0) {
          formData.append('buyerProfile', JSON.stringify(buyerProfilePayload));
          hasChanges = true;
        }
      }

      if (!hasChanges) {
        setSuccess('No changes to update.');
        setTimeout(() => setSuccess(''), 3000);
        return;
      }

      const response = await fetch('http://localhost:8080/api/auth/profile/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Content-Type is set automatically by the browser for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to update profile';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      setSuccess('Profile updated successfully!');

      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-semibold">Loading...</div>
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/profile" className="text-sm text-indigo-600 hover:text-indigo-800">
            ← Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Edit Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">{success}</div>}

            <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl text-gray-500">?</span>
                    )}
                </div>
                <div className="flex-grow space-y-2">
                    <div>
                        <label htmlFor="imageUrlInput" className="block text-sm font-medium text-gray-600">Image URL</label>
                        <input
                            type="text"
                            id="imageUrlInput"
                            value={imageUrlInput}
                            onChange={e => {
                              const newUrl = e.target.value;
                              setImageUrlInput(newUrl);
                              setImageUrl(newUrl);
                              setImageFile(null);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="https://example.com/image.png"
                        />
                    </div>
                    <div>
                        <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-600">Or Upload from Device</label>
                        <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                </div>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700">General Information</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {user.role === 'BUYER' && user.buyerProfile && (
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-700">Buyer Details</h2>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-600">Shipping Address</label>
                    <textarea
                      id="shippingAddress"
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-600">Billing Address</label>
                    <textarea
                      id="billingAddress"
                      value={billingAddress}
                      onChange={e => setBillingAddress(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="paymentMethods" className="block text-sm font-medium text-gray-600">Payment Methods</label>
                    <input
                      type="text"
                      id="paymentMethods"
                      value={paymentMethods}
                      onChange={e => setPaymentMethods(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., Visa ending in 1234"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Link href="/profile" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 mr-2">
                Cancel
              </Link>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
