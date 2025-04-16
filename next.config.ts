import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  typescript: {
    // Disable type checking during build
    ignoreBuildErrors: true,
  },

  eslint: {
    // Disable ESLint during production build
    ignoreDuringBuilds: true,
  },

  // Configure route handling for Vercel deployment
  trailingSlash: false,

  // Handle the API routes that make fetch calls during build
  output: "standalone",

  // Suppress hydration warnings in development
  reactStrictMode: true,
  onDemandEntries: {
    // Keep pages in memory for longer during development
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 5,
  },
  // Add a flag to help debug issues
  experimental: {
    // This can help with hydration issues
    optimizeCss: true,
  },
};

export default nextConfig;
