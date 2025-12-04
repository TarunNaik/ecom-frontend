"use client";

import { useState, useEffect } from "react";

interface User {
  name?: string;
}

interface WelcomeBannerProps {
  user: User | null;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-3xl font-bold mb-2">
        Welcome back, {user?.name || "Valued Customer"}!
      </h2>
      <p className="text-indigo-200">
        We're glad to see you again. Explore the latest products and manage your account.
      </p>
    </div>
  );
};

export default WelcomeBanner;