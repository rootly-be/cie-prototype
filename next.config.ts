import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment (Story 8.1)
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'cieenghien.be',
      },
      {
        // S3 storage (development placeholder)
        protocol: 'https',
        hostname: 's3.example.com',
      },
      {
        // Hetzner S3 storage
        protocol: 'https',
        hostname: '*.your-objectstorage.com',
      },
      {
        // AWS S3
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
