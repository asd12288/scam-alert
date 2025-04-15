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
  
  // Explicitly set the app directory
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
