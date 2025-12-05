"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { replaceCurrency } from "../../utils/currency";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress?: string;
  paymentMethod?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
      fetchOrders();
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Please login to view your orders");
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:8080/api/buyer/orders", {
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
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter orders by status
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "ALL") return true;
    return order.status.toUpperCase() === statusFilter;
  });

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
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            </div>
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

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
            >
              <option value="ALL">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-600">Loading orders...</div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-600 mb-4">
              {statusFilter === "ALL" ? "No orders found" : `No ${statusFilter.toLowerCase()} orders found`}
            </div>
            <Link
              href="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID: #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-lg font-bold text-gray-900">
                          {replaceCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
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
                          <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {replaceCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-600">{replaceCurrency(item.price)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional Info */}
                  {(order.shippingAddress || order.paymentMethod) && (
                    <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.shippingAddress && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Shipping Address</p>
                          <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                        </div>
                      )}
                      {order.paymentMethod && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Payment Method</p>
                          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
