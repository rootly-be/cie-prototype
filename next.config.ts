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
    ],
  },
};

export default nextConfig;
