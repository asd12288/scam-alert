import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  typescript: {
    // Disable type checking during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
