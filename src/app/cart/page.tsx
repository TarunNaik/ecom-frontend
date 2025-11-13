"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
      fetchCart();
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    setError("");

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Please login to view your cart");
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:8080/api/buyer/cart", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      console.log("Cart response status:", response.status);
      console.log("Cart response headers:", response.headers);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error("Failed to fetch cart");
      }

      // Get response as text first to check if it's valid
      const responseText = await response.text();
      console.log("Cart response text:", responseText);

      // Try to parse as JSON
      let data;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.error("Invalid JSON received:", responseText);
          throw new Error("Invalid response from server");
        }
      } else {
        // Empty response means empty cart
        data = [];
      }

      // Ensure data is an array
      const cartData = Array.isArray(data) ? data : [];
      console.log("Parsed cart data:", cartData);
      
      // Log first item to see exact structure
      if (cartData.length > 0) {
        console.log("First cart item keys:", Object.keys(cartData[0]));
        console.log("First cart item:", JSON.stringify(cartData[0], null, 2));
      }
      
      // Map the data to handle different property name formats
      const mappedCartItems = cartData.map((item: any) => {
        console.log("Mapping item:", item);
        
        const mapped = {
          id: item.id || item.Id || item.ID,
          productId: item.productId || item.ProductId || item.ProductID || item.product_id,
          productName: item.productName || item.ProductName || item.name || item.Name || item.product?.name || item.product?.Name || 'Unknown Product',
          productImage: item.productImage || item.ProductImage || item.imageUrl || item.ImageUrl || item.image_url || item.product?.imageUrl,
          price: item.price || item.Price || item.product?.price || item.product?.Price || 0,
          quantity: item.quantity || item.Quantity || item.count || item.Count || 0,
          stock: item.stock || item.Stock || item.product?.stock || item.product?.Stock || 0,
        };
        
        console.log("Mapped to:", mapped);
        return mapped;
      });
      
      console.log("Mapped cart items:", mappedCartItems);
      
      setCartItems(mappedCartItems);
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Please check if backend is running.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to load cart");
      }
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Please login to update cart");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/buyer/cart/update/${productId}/${newQuantity}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      setSuccess("Cart updated successfully");
      fetchCart();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quantity");
      setTimeout(() => setError(""), 3000);
    }
  };

  const removeItem = async (productId: number) => {
    if (!confirm("Are you sure you want to remove this item from cart?")) {
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Please login to remove items");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/buyer/cart/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      setSuccess("Item removed from cart");
      fetchCart();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item");
      setTimeout(() => setError(""), 3000);
    }
  };

  const clearCart = async () => {
    if (!confirm("Are you sure you want to clear your entire cart?")) {
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Please login to clear cart");
        return;
      }

      const response = await fetch("http://localhost:8080/api/buyer/cart/clear", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      setSuccess("Cart cleared successfully");
      fetchCart();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cart");
      setTimeout(() => setError(""), 3000);
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    // Navigate to checkout page (to be implemented)
    window.location.href = "/checkout";
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const calculateItemCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
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
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <Link
              href="/products"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
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
            <div className="text-gray-600">Loading cart...</div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link
              href="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Cart Items ({calculateItemCount()})
                  </h2>
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => {
                    console.log("Rendering cart item:", item, "productId:", item.productId);
                    
                    return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-3xl">📦</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.productName || 'Unknown Product'}
                        </h3>
                        <p className="text-lg font-bold text-indigo-600">
                          ${(item.price || 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(item.stock || 0) > 0 ? `${item.stock} available` : 'Out of stock'}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const prodId = item.productId || item.id;
                            if (prodId) {
                              updateQuantity(item.id, prodId, (item.quantity || 1) - 1);
                            }
                          }}
                          disabled={(item.quantity || 1) <= 1}
                          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity || 0}</span>
                        <button
                          onClick={() => {
                            const prodId = item.productId || item.id;
                            if (prodId) {
                              updateQuantity(item.id, prodId, (item.quantity || 0) + 1);
                            }
                          }}
                          disabled={(item.quantity || 0) >= (item.stock || 0)}
                          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right w-24">
                        <p className="font-semibold text-gray-900">
                          ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          const idToRemove = item.productId || item.id;
                          console.log("Removing item with productId:", idToRemove, "Full item:", item);
                          if (idToRemove) {
                            removeItem(idToRemove);
                          } else {
                            alert("Cannot remove item - missing product ID");
                          }
                        }}
                        className="text-red-600 hover:text-red-700 p-2"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({calculateItemCount()} items)</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-3"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="block text-center text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
