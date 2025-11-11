"use client";

import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginData = {
        email: email,
        password: password,
      };

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        credentials: "include", // Include cookies for session-based auth
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      console.log("Response status:", response.status);
      
      // Get response as text first
      const responseText = await response.text();
      console.log("Response body:", responseText);

      if (!response.ok) {
        throw new Error(responseText || "Login failed");
      }

      // Try to parse as JSON, fallback to text
      let data;
      const contentType = response.headers.get("content-type");
      
      if (responseText && contentType && contentType.includes("application/json")) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.log("Failed to parse JSON, treating as text response");
          data = { message: responseText };
        }
      } else {
        // Plain text response with roles
        console.log("Login successful (text response):", responseText);
        
        // Parse the response to extract roles
        // Expected format: "Login successful! Role: ROLE_BUYER" or "ROLE_VENDOR"
        let userRole = "buyer"; // default
        
        if (responseText.toLowerCase().includes("role")) {
          // Extract roles from the message - handles ROLE_BUYER, ROLE_VENDOR, ROLE_ADMIN format
          const roleMatch = responseText.match(/ROLE_([A-Z]+)/i);
          console.log("Role match result:", roleMatch);
          
          if (roleMatch && roleMatch[1]) {
            const extractedRole = roleMatch[1].toLowerCase(); // Gets "buyer", "vendor", or "admin"
            console.log("Extracted role:", extractedRole);
            userRole = extractedRole;
          }
        }
        
        console.log("Final user role:", userRole);
        
        // Store user data
        const userData = {
          email: email,
          role: userRole,
          fullRole: responseText.match(/ROLE_([A-Z]+)/i)?.[0] || `ROLE_${userRole.toUpperCase()}`,
        };
        
        console.log("Storing user data:", userData);
        
        localStorage.setItem("authToken", "authenticated");
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Redirect based on role
        alert("Login successful! Redirecting to your dashboard...");
        
        if (userRole === "buyer") {
          window.location.href = "/dashboard/buyer";
        } else if (userRole === "vendor") {
          window.location.href = "/dashboard/vendor";
        } else if (userRole === "admin") {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard/buyer";
        }
        return;
      }

      console.log("Login successful:", data);
      
      // Store token if your backend returns one
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      
      // Store user data
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect to dashboard based on user role
        const userRole = data.user.role?.toLowerCase() || data.user.Role?.toLowerCase();
        
        if (userRole === "buyer") {
          window.location.href = "/dashboard/buyer";
        } else if (userRole === "vendor") {
          window.location.href = "/dashboard/vendor";
        } else if (userRole === "admin") {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        // Fallback if no user object returned
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-indigo-600 font-semibold hover:text-indigo-700"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="block text-center text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
