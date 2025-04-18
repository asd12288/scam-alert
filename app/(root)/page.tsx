"use client";

import InputScam from "@/components/InputScamForm";
import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { JsonLd } from "react-schemaorg";

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
    <>
      {/* Structured data for better search engine understanding */}
      <JsonLd<any>
        item={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Scam Protector",
          "applicationCategory": "SecurityApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "Advanced tool to detect online scams, phishing attempts, and fraudulent websites in real-time.",
        }}
      />
      
      <main
        className={`${
          hasResults ? "min-h-screen" : "h-screen"
        } flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900`}
      >
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          {/* Hero section with better responsive sizing */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mr-2" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
                Scam Protector
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-base sm:text-lg px-4">
              Using advanced technology to detect and protect you from
              sophisticated online scams.
            </p>
          </div>

          {/* Main search form - centered with proper width constraints */}
          <div className="w-full">
            <InputScam onResultsChange={setHasResults} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
