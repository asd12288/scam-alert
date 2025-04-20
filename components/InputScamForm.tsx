"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import SpinnerMini from "./ui/SpinnerMini";
import {
  AlertTriangle,
  Search,
  X,
  Bot,
  Brain,
  HelpCircle,
  Globe,
} from "lucide-react";
import SecurityReport from "./ui/SecurityReport";

const formSchema = z.object({
  domain: z.string().min(3, "Domain is required"),
});

interface InputScamProps {
  onResultsChange?: (hasResults: boolean) => void;
}

// Create a separate client component for the clear button
function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      aria-label="Clear search"
    >
      <X size={18} />
    </button>
  );
}

const InputScam = ({ onResultsChange }: InputScamProps) => {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [domainData, setDomainData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
    },
  });

  // Notify parent component when results status changes
  useEffect(() => {
    const hasResults = score !== null || error !== null;
    onResultsChange?.(hasResults);
  }, [score, error, onResultsChange]);

  const resetForm = () => {
    form.reset();
    setScore(null);
    setDomainData(null);
    setError(null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      setError(null);

      // Clean the domain input (remove https://, www., etc.)
      let cleanDomain = values.domain.trim();
      cleanDomain = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/i, "");
      cleanDomain = cleanDomain.split("/")[0]; // Remove any paths

      // Easter egg for when users check our own website
      if (cleanDomain.toLowerCase() === "scam-protector.com") {
        // Create a special result for our own website
        setScore(100);
        setDomainData({
          domain: cleanDomain,
          aiSummary: "This is the official Scam Protector website - the most trusted security analysis tool on the web. You're in safe hands! 😎\n\n✅ Our website is 100% secure and trustworthy\n✅ We help millions stay safe online\n✅ You have excellent taste in security tools\n\n💡 Recommendation: Bookmark this site and share it with friends and family to help them stay safe online too!",
          details: {
            safeBrowsing: {
              isMalicious: false,
              matches: [],
              score: 100,
            },
            whois: {
              data: {
                domainName: "scam-protector.com",
                creationDate: "2022-10-15T00:00:00.000Z", 
                expirationDate: "2030-10-15T00:00:00.000Z",
                registrar: "Super Secure Domains Inc.",
                registrantOrganization: "Scam Protector Team",
                registrantCountry: "United States",
                domainAge: 914, // About 2.5 years as of April 2025
                privacyProtected: false,
              },
              riskFactors: [],
              score: 100,
            },
            patternAnalysis: {
              riskFactors: [],
              suspiciousScore: 0,
            },
            ssl: {
              valid: true,
              issuer: "Let's Encrypt Authority X3",
              daysRemaining: 89,
            },
            analysisDate: new Date().toISOString(),
          },
          screenshot: "/easter-egg-shield.png",
          specialEasterEgg: true,
        });
        
        // Scroll to results after a short delay
        setTimeout(() => {
          const reportHeader = document.getElementById("report-header");
          if (reportHeader) {
            const paddingTop = 20;
            const headerPosition =
              reportHeader.getBoundingClientRect().top +
              window.pageYOffset -
              paddingTop;
            window.scrollTo({
              top: headerPosition,
              behavior: "smooth",
            });
          }
        }, 300);
        
        setLoading(false);
        return;
      }

      const response = await fetch("/api/domain-security", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: cleanDomain }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setScore(result.score);
      setDomainData({
        domain: result.domain || cleanDomain,
        aiSummary: result.aiSummary,
        details: result.details || {},
        screenshot: result.screenshot,
      });

      // Scroll to results after a short delay
      setTimeout(() => {
        const reportHeader = document.getElementById("report-header");
        if (reportHeader) {
          // Add padding to ensure the header isn't at the very top of the screen
          const paddingTop = 20;
          const headerPosition =
            reportHeader.getBoundingClientRect().top +
            window.pageYOffset -
            paddingTop;
          window.scrollTo({
            top: headerPosition,
            behavior: "smooth",
          });
        }
      }, 300);
    } catch (error: any) {
      console.error("Error checking domain:", error);
      setError(
        error.message || "Failed to check domain security. Please try again."
      );
      setScore(null);
      setDomainData(null);
    } finally {
      setLoading(false);
    }
  }

  const placeholderExamples = [
    "example.com",
    "yourbank.com",
    "onlineshopping.site",
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  // Change placeholder text every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <div className="relative flex flex-col sm:flex-row items-stretch gap-3">
                <div className="flex items-center flex-1 relative bg-white rounded-lg border-2 border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                  <div className="pl-3 py-2 text-gray-500">
                    <Globe size={24} />
                  </div>
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem className="flex-1 w-full">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              className="w-full pl-2 pr-8 py-3 border-0 shadow-none focus:ring-0 text-lg bg-transparent"
                              placeholder={
                                placeholderExamples[currentPlaceholder]
                              }
                              {...field}
                              aria-label="Enter website address"
                            />
                            {field.value && <ClearButton onClick={resetForm} />}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-auto sm:w-auto w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg flex items-center justify-center"
                >
                  {loading ? (
                    <SpinnerMini size="lg" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      <span>Check Website</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex justify-between items-center mt-3">
                <div className="text-sm text-gray-500">
                  Examples: amazon.com, facebook.com, cnn.com
                </div>
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-blue-600 flex items-center text-sm hover:text-blue-800"
                >
                  <HelpCircle size={16} className="mr-1" />
                  Help
                </button>
              </div>

              {showHelp && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-gray-700 text-base">
                  <h3 className="font-medium mb-2">How to use this tool:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Type or paste a website address (like "amazon.com")</li>
                    <li>You don't need to add "www." or "https://"</li>
                    <li>Click "Check Website" to see if it's safe</li>
                    <li>
                      Our AI will analyze the website and give you safety advice
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 flex items-start">
          <AlertTriangle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium">Something went wrong</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-6 flex justify-center">
          <div className="p-6 bg-white rounded-lg border border-blue-100 shadow-sm w-full max-w-md">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                Checking website safety
              </h3>
              <p className="mt-2 text-gray-600">
                Our AI is analyzing this website for potential scams and
                security risks...
              </p>
            </div>
          </div>
        </div>
      )}

      {score !== null && domainData && (
        <div id="results-section" className="mt-8 scroll-mt-6">
          <SecurityReport score={score} data={domainData} />
        </div>
      )}

      {!score && !error && !loading && form.formState.isSubmitted && (
        <div className="mt-8 text-center p-5 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
          <p className="text-lg font-medium">No results to display</p>
          <p className="mt-2">
            Please try checking a different website address.
          </p>
        </div>
      )}
    </div>
  );
};

export default InputScam;
