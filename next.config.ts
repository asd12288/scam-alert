import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Function to copy extension assets after build
const copyExtensionAssets = () => {
  try {
    // Ensure the output directory exists
    const publicExtDir = path.resolve("public/extension");
    const publicExtIconsDir = path.resolve("public/extension/icons");
    
    if (!fs.existsSync(publicExtDir)) {
      fs.mkdirSync(publicExtDir, { recursive: true });
    }
    
    if (!fs.existsSync(publicExtIconsDir)) {
      fs.mkdirSync(publicExtIconsDir, { recursive: true });
    }
    
    // Copy the manifest and styles
    fs.copyFileSync(
      path.resolve("extension/manifest.json"),
      path.resolve("public/extension/manifest.json")
    );
    
    fs.copyFileSync(
      path.resolve("extension/styles.css"),
      path.resolve("public/extension/styles.css")
    );
    
    // Copy icons (this assumes icons exist)
    const iconDir = path.resolve("extension/icons");
    if (fs.existsSync(iconDir)) {
      const icons = fs.readdirSync(iconDir);
      icons.forEach(icon => {
        const srcPath = path.join(iconDir, icon);
        const destPath = path.join(publicExtIconsDir, icon);
        if (fs.statSync(srcPath).isFile()) {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    }
    
    console.log("Extension assets copied successfully");
  } catch (error) {
    console.error("Error copying extension assets:", error);
  }
};

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
  
  // Copy extension assets when building for production
  webpack: (config, { isServer, dev }) => {
    // Copy extension assets in production builds
    if (!dev && !isServer) {
      console.log("Preparing to copy extension assets...");
      copyExtensionAssets();
    }
    return config;
  }
};

export default nextConfig;
