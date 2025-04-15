import React from "react";
import Link from "next/link";
import { Home, Shield, AlertTriangle } from "lucide-react";
import GoBackButton from "@/components/ui/GoBackButton";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            <Shield className="w-20 h-20 text-blue-600 dark:text-blue-400" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <AlertTriangle className="w-10 h-10 text-white dark:text-gray-900" />
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
          404: Page Not Found
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Navigation Options */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors w-full"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Link>
          
          <div className="flex space-x-4">
            <Link
              href="/blogs"
              className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              Browse Articles
            </Link>
            <Link
              href="/report"
              className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              Report a Scam
            </Link>
          </div>
        </div>
        
        {/* Additional Resources */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Looking for something specific? Try our{" "}
            <Link href="/guide" className="text-blue-600 dark:text-blue-400 underline">
              security guide
            </Link>{" "}
            or{" "}
            <GoBackButton />
          </p>
        </div>
      </div>
    </div>
  );
}