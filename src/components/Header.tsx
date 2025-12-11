"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

interface User {
  name?: string;
  email?: string;
  imageUrl?: string;
}

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/");
  };

  const getInitials = (name = "") => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return `${name[0]}`.toUpperCase();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
              <span className="text-xl font-bold text-gray-800">E-Shop</span>
            </Link>
          </div>

          <nav className="hidden md:flex md:space-x-8">
            <Link href="/browse-products" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Products
            </Link>
            <Link href="/orders" className="text-gray-600 hover:text-indigo-600 transition-colors">
              My Orders
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Support
            </Link>
          </nav>

          <div className="relative flex items-center space-x-4">
            {user && (
              <Link href="/cart" className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600 hover:text-indigo-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="User"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-700 pr-4">{user.name}</span>
              </button>
            ) : (
              <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Login
              </Link>
            )}
            
            {isMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;