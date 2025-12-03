/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9000/api/:path*',
      },
      {
        source: '/api/v1/auth/:path*',
        destination: 'http://localhost:8080/api/v1/auth/:path*',
      },
    ];
  },
  trailingSlash: true,
};

module.exports = nextConfig;