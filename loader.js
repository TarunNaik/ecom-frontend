"use client"

export default function myImageLoader({ src, width, quality }) {
  // In development, and for absolute URLs, just return the src
  if (process.env.NODE_ENV === "development" || src.startsWith('http')) {
    return src;
  }

  // This part is for production builds if you use a specific image optimization service.
  // For now, we'll just return the src.
  return src;
}
