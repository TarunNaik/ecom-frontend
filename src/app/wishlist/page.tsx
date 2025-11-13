"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productDescription?: string;
  productImage?: string;
  price: number;
  stock: number;
  category?: string;
  addedAt: string;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
      fetchWishlist();
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError("");

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Please login to view your wishlist");
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:8080/api/buyer/wishlist", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error("Failed to fetch wishlist");
      }

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : [];
      const wishlistData = Array.isArray(data) ? data : [];
      
      console.log("Parsed wishlist data:", wishlistData);
      
      // Log first item to see exact structure
      if (wishlistData.length > 0) {
        console.log("First wishlist item keys:", Object.keys(wishlistData[0]));
        console.log("First wishlist item:", JSON.stringify(wishlistData[0], null, 2));
      }
      
      // Map the data to handle different property name formats
      const mappedWishlistItems = wishlistData.map((item: any) => {
        console.log("Mapping wishlist item:", item);
        
        const mapped = {
          id: item.id || item.Id || item.ID,
          productId: item.productId || item.ProductId || item.ProductID || item.product_id,
          productName: item.productName || item.ProductName || item.name || item.Name || item.product?.name || item.product?.Name || 'Unknown Product',
          productDescription: item.productDescription || item.ProductDescription || item.description || item.Description || item.product?.description,
          productImage: item.productImage || item.ProductImage || item.imageUrl || item.ImageUrl || item.image_url || item.product?.imageUrl,
          price: item.price || item.Price || item.product?.price || item.product?.Price || 0,
          stock: item.stock || item.Stock || item.product?.stock || item.product?.Stock || 0,
          category: item.category || item.Category || item.product?.category,
          addedAt: item.addedAt || item.AddedAt || item.createdAt || item.CreatedAt || new Date().toISOString(),
        };
        
        console.log("Mapped wishlist to:", mapped);
        return mapped;
      });
      
      console.log("Mapped wishlist items:", mappedWishlistItems);
      
      setWishlistItems(mappedWishlistItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wishlist");
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number) => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Please login to add items to cart");
        return;
      }

      const quantity = 1;
      const response = await fetch(`http://localhost:8080/api/buyer/cart/add/${productId}/${quantity}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      setSuccess("Product added to cart!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
      setTimeout(() => setError(""), 3000);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!confirm("Remove this item from your wishlist?")) {
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Please login to remove items");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/buyer/wishlist/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      setSuccess("Item removed from wishlist");
      fetchWishlist();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item");
      setTimeout(() => setError(""), 3000);
    }
  };

  const clearWishlist = async () => {
    if (!confirm("Are you sure you want to clear your entire wishlist?")) {
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Please login to clear wishlist");
        return;
      }

      const response = await fetch("http://localhost:8080/api/buyer/wishlist/clear", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear wishlist");
      }

      setSuccess("Wishlist cleared successfully");
      fetchWishlist();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear wishlist");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (!currentUser) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/dashboard/buyer"
                className="text-indigo-600 hover:text-indigo-700 text-sm mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <Link
              href="/products"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-600">Loading wishlist...</div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save your favorite items for later!</p>
            <Link
              href="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div>
            {/* Header with Clear Button */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
                </h2>
                {wishlistItems.length > 0 && (
                  <button
                    onClick={clearWishlist}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Wishlist
                  </button>
                )}
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Product Image */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📦</span>
                    )}
                    
                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                      title="Remove from wishlist"
                    >
                      <span className="text-red-500 text-xl">❤️</span>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                      {item.productName || 'Unknown Product'}
                    </h3>
                    
                    {item.productDescription && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.productDescription}
                      </p>
                    )}
                    
                    {item.category && (
                      <div className="mb-3">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-indigo-600">
                        ${(item.price || 0).toFixed(2)}
                      </span>
                      <span className={`text-sm ${(item.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(item.stock || 0) > 0 ? `${item.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>

                    <div className="space-y-2">
                      <button
                        onClick={() => addToCart(item.productId)}
                        disabled={(item.stock || 0) === 0}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          (item.stock || 0) > 0
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {(item.stock || 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      
                      <button
                        onClick={() => removeFromWishlist(item.productId)}
                        className="w-full py-2 rounded-lg font-medium text-red-600 border border-red-600 hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
