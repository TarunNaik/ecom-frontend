"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  imageUrls?: string[]; // Support for multiple images
  vendorId: number;
  vendorName?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [wishlistedProductIds, setWishlistedProductIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const authToken = localStorage.getItem("authToken");
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch("http://localhost:8080/api/buyer/products", {
        method: "GET",
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

  const fetchWishlist = async () => {
    const authToken = localStorage.getItem("authToken");
    
    if (!authToken) {
      // User not logged in, skip fetching wishlist
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/buyer/wishlist", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const responseText = await response.text();
        const wishlistData = responseText ? JSON.parse(responseText) : [];
        const wishlist = Array.isArray(wishlistData) ? wishlistData : [];
        
        // Extract product IDs from wishlist
        const productIds = new Set(wishlist.map((item: any) => item.productId));
        setWishlistedProductIds(productIds);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      // Silently fail - wishlist is optional
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
    // Prioritize imageUrls array, fallback to single imageUrl, or use empty array
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls;
    }
    if (product.imageUrl) {
      return [product.imageUrl];
    }
    return [];
  };

  const handleAddToCart = async (productId: number) => {
    if (!currentUser) {
      alert("Please login to add items to cart");
      window.location.href = "/login";
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      
      if (!authToken) {
        alert("Please login to add items to cart");
        window.location.href = "/login";
        return;
      }

      const quantity = 1; // Default quantity
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

      alert("Product added to cart!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    if (!currentUser) {
      alert("Please login to add items to wishlist");
      window.location.href = "/login";
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      
      if (!authToken) {
        alert("Please login to add items to wishlist");
        window.location.href = "/login";
        return;
      }

      const isInWishlist = wishlistedProductIds.has(productId);

      if (isInWishlist) {
        // Remove from wishlist
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

        // Update local state
        setWishlistedProductIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });

        alert("Product removed from wishlist!");
      } else {
        // Add to wishlist
        const response = await fetch(`http://localhost:8080/api/buyer/wishlist/add/${productId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to add to wishlist");
        }

        // Update local state
        setWishlistedProductIds(prev => new Set(prev).add(productId));

        alert("Product added to wishlist!");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update wishlist");
    }
  };

  // Get unique categories
  const categories = ["ALL", ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "ALL" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              {currentUser && (
                <Link
                  href="/dashboard/buyer"
                  className="text-indigo-600 hover:text-indigo-700 text-sm mb-2 inline-block"
                >
                  ← Back to Dashboard
                </Link>
              )}
              <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
            </div>
            <div className="flex gap-4">
              {currentUser && (
                <Link
                  href="/cart"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  🛒 Cart
                </Link>
              )}
              {!currentUser && (
                <Link
                  href="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Login
                </Link>
              )}
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

        {/* Filters */}
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

        {/* Products Grid */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-600">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-600">No products found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const images = getProductImages(product);
              const currentIndex = currentImageIndex[product.id] || 0;
              const hasMultipleImages = images.length > 1;
              const isInWishlist = wishlistedProductIds.has(product.id);

              return (
                <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Product Image with Carousel */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative group">
                    {images.length > 0 ? (
                      <>
                        <img
                          src={images[currentIndex]}
                          alt={`${product.name} - Image ${currentIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Wishlist Heart Icon */}
                        <button
                          onClick={() => handleAddToWishlist(product.id)}
                          className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <span className="text-red-500 text-xl">
                            {isInWishlist ? '❤️' : '🤍'}
                          </span>
                        </button>
                        
                        {/* Image Navigation Arrows - Show only if multiple images */}
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={() => handlePrevImage(product.id, images.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
                              aria-label="Previous image"
                            >
                              ←
                            </button>
                            <button
                              onClick={() => handleNextImage(product.id, images.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
                              aria-label="Next image"
                            >
                              →
                            </button>
                            
                            {/* Image Indicators */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {images.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentImageIndex(prev => ({ ...prev, [product.id]: idx }))}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    idx === currentIndex 
                                      ? 'bg-white w-4' 
                                      : 'bg-white bg-opacity-50'
                                  }`}
                                  aria-label={`View image ${idx + 1}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                        
                        {/* Image Counter */}
                        {hasMultipleImages && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {currentIndex + 1} / {images.length}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-6xl">📦</span>
                        
                        {/* Wishlist Heart Icon for products without images */}
                        <button
                          onClick={() => handleAddToWishlist(product.id)}
                          className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <span className="text-red-500 text-xl">
                            {isInWishlist ? '❤️' : '🤍'}
                          </span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="mb-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-indigo-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    {product.vendorName && (
                      <p className="text-xs text-gray-500 mb-3">
                        Sold by: {product.vendorName}
                      </p>
                    )}

                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        product.stock > 0
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
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
