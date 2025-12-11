"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { replaceCurrency } from "../../utils/currency";
import Header from "@/components/Header";
import { useCart } from "@/app/context/CartContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  imageUrls?: string[];
  vendorName?: string;
}

export default function BrowseProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Fetch products without authentication
      const response = await fetch("/api/v1/product/list-all", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextImage = (productId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevImage = (productId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const getProductImages = (product: Product): string[] => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls;
    }
    if (product.imageUrl) {
      return [product.imageUrl];
    }
    return [];
  };

  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
    alert(`${product.name} has been added to your cart.`);
  };

  const categories = ["ALL", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "ALL" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <Link
              href="/dashboard/buyer"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              &larr; Back to Dashboard
            </Link>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mt-1">
              Browse Products
            </h2>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center"><div className="text-gray-600">Loading products...</div></div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center"><div className="text-gray-600">No products found</div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const images = getProductImages(product);
              const currentIndex = currentImageIndex[product.id] || 0;
              const hasMultipleImages = images.length > 1;

              return (
                <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative group">
                    {images.length > 0 ? (
                      <>
                        <img src={images[currentIndex]} alt={`${product.name} - Image ${currentIndex + 1}`} className="w-full h-full object-cover" />
                        {hasMultipleImages && (
                          <>
                            <button onClick={() => handlePrevImage(product.id, images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75" aria-label="Previous image">←</button>
                            <button onClick={() => handleNextImage(product.id, images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75" aria-label="Next image">→</button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {images.map((_, idx) => (
                                <button key={idx} onClick={() => setCurrentImageIndex(prev => ({ ...prev, [product.id]: idx }))} className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white bg-opacity-50'}`} aria-label={`View image ${idx + 1}`} />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <span className="text-6xl">📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="mb-3"><span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{product.category}</span></div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-indigo-600">{replaceCurrency(product.price)}</span>
                      <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                    </div>
                    {product.vendorName && (<p className="text-xs text-gray-500 mb-3">Sold by: {product.vendorName}</p>)}
                    {user ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          product.stock > 0
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-400 text-gray-800 cursor-not-allowed'
                        }`}
                      >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    ) : (
                      <Link href="/login" className="w-full block text-center py-2 rounded-lg font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700">
                        Login to Buy
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
