
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';

const carouselImages = [
  "/images/IMG001.jpg",
  "/images/IMG002.jpg",
  "/images/IMG003.jpg",
  "/images/IMG004.jpg",
  "/images/IMG005.jpg",
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // const goToPrevious = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
  // };
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  return (
    <div className="bg-white text-gray-600">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-md shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            <Link href="/" className="flex items-center">
              <Image src="/images/logo-black.jpg" alt="Faguni Logo" className="w-15 h-15 rounded-full" width={40} height={40} />
              {/* <!--span className="ml-2">Faguni</span--> */}
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/browse-products" className="hover:text-indigo-600">Men</Link>
            <Link href="/browse-products" className="hover:text-indigo-600">Women</Link>
            <Link href="/browse-products" className="hover:text-indigo-600">Kids</Link>
            <Link href="/contact" className="hover:text-indigo-600">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Login</Link>
            <Link href="/register" className="hidden sm:inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Sign Up</Link>
            <button className="lg:hidden p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <section className="hero" style={{ marginTop: "60px" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "800px",
              height: "400px",
              margin: "auto",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
            }}
          >
            <Image
              key={carouselImages[currentIndex]}
              src={carouselImages[currentIndex]}
              alt={`Saree Style ${currentIndex + 1}`}
              fill
              style={{
                objectFit: "cover",
                objectPosition: "top",
                borderRadius: "10px"
              }}
              priority
              unoptimized={true}
            />

            {/* Carousel Navigation Arrows */}
            <button
              onClick={goToPrevious}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "50%",
                zIndex: 2,
              }}
              aria-label="Previous Slide"
            >
              &#10094;
            </button>
            <button
              onClick={goToNext}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "50%",
                zIndex: 2,
              }}
              aria-label="Next Slide"
            >
              &#10095;
            </button>

            {/* Carousel Dots */}
            <div
              style={{
                position: "absolute",
                bottom: "15px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                zIndex: 2,
              }}
            >
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "2px solid white",
                    backgroundColor: idx === currentIndex ? "white" : "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Hero Text Content */}
          <section className="hero" style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#fff' }}>
            <h1 style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: '3rem',
              fontWeight: '700',
              color: '#222',
              marginBottom: '20px'
            }}>Elegant Sarees</h1>
            <p style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: '1.25rem',
              color: '#555',
              marginBottom: '30px',
            }}>Discover our stunning collection</p>
            <button style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontFamily: "'Raleway', sans-serif",
              border: '2px solid #222',
              backgroundColor: '#fff',
              color: '#222',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'background-color 0.3s, color 0.3s',
            }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = '#222';
                target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = '#fff';
                target.style.color = '#222';
              }}
            >
              <Link href="/browse-products">
                Shop Now
              </Link>
            </button>
          </section>
        </section>


        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Product 1 */}
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="relative w-full h-64">
                  <Image src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop" alt="Product" fill unoptimized={true} style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Classic Watch</h3>
                  <p className="text-gray-600 mb-4">$150</p>
                  <Link href="/products/1" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">View Item</Link>
                </div>
              </div>
              {/* Product 2 */}
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="relative w-full h-64">
                  <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" alt="Product" fill unoptimized={true} style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Running Shoes</h3>
                  <p className="text-gray-600 mb-4">$120</p>
                  <Link href="/products/2" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">View Item</Link>
                </div>
              </div>
              {/* Product 3 */}
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="relative w-full h-64">
                  <Image src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop" alt="Product" fill unoptimized={true} style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Headphones</h3>
                  <p className="text-gray-600 mb-4">$80</p>
                  <Link href="/products/3" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">View Item</Link>
                </div>
              </div>
              {/* Product 4 */}
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="relative w-full h-64">
                  <Image src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1780&auto=format&fit=crop" alt="Product" fill unoptimized={true} style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Sunglasses</h3>
                  <p className="text-gray-600 mb-4">$95</p>
                  <Link href="/products/4" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">View Item</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-700 mb-8">Get the latest updates on new products and upcoming sales</p>
            <form className="max-w-md mx-auto">
              <div className="flex items-center">
                <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-r-md hover:bg-indigo-700">Subscribe</button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-gray-400">Your one-stop shop for the latest fashion trends.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <ul>
                <li><Link href="/browse-products" className="hover:text-indigo-400">Men</Link></li>
                <li><Link href="/browse-products" className="hover:text-indigo-400">Women</Link></li>
                <li><Link href="/browse-products" className="hover:text-indigo-400">Kids</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul>
                <li><Link href="/contact" className="hover:text-indigo-400">Contact Us</Link></li>
                <li><Link href="/support" className="hover:text-indigo-400">Support</Link></li>
                <li><Link href="/orders" className="hover:text-indigo-400">Orders</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-indigo-400">Facebook</a>
                <a href="#" className="hover:text-indigo-400">Twitter</a>
                <a href="#" className="hover:text-indigo-400">Instagram</a>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 mt-8 pt-8 border-t border-gray-700">
            <p>&copy; 2024 Faguni Fashion Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
