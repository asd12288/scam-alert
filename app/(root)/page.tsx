"use client";

import InputScam from "@/components/InputScamForm";
import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const Page = () => {
  const [hasResults, setHasResults] = useState(false);

  // Adjust the page height based on whether search results are displayed
  useEffect(() => {
    if (hasResults) {
      document.body.style.overflowY = "auto";
      document.body.style.height = "auto";
    } else {
      document.body.style.overflowY = "hidden";
      document.body.style.height = "100vh";
    }

    return () => {
      // Cleanup function to reset styles when component unmounts
      document.body.style.overflowY = "auto";
      document.body.style.height = "auto";
    };
  }, [hasResults]);

  return (
    <div
      className={`${
        hasResults ? "min-h-screen" : "h-screen"
      } bg-white dark:bg-gray-900 flex items-center justify-center py-8 px-4`}
    >
      <div className="max-w-xl w-full mx-auto">
        {/* Simple centered content */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              <span className="text-blue-600">AI</span> Scam Alert
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
            Using artificial intelligence to detect and protect you from
            sophisticated online scams.
          </p>
        </div>

        {/* Main search form */}
        <div className="mb-8">
          <InputScam onResultsChange={setHasResults} />
        </div>
      </div>
    </div>
  );
};

export default Page;
