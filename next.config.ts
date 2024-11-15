//import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8083/api/v1/:path*',
      },
    ]
  },
}

module.exports = nextConfig