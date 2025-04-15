"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import SpinnerMini from "./ui/SpinnerMini";
import { AlertTriangle, Search, X, Bot, Brain } from "lucide-react";
import SecurityReport from "./ui/SecurityReport";

const formSchema = z.object({
  domain: z.string().min(3, "Domain is required"),
});

interface InputScamProps {
  onResultsChange?: (hasResults: boolean) => void;
}

const InputScam = ({ onResultsChange }: InputScamProps) => {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [domainData, setDomainData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

      const response = await fetch("/api/domain-security", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: values.domain }),
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
        domain: result.domain || values.domain,
        aiSummary: result.aiSummary,
        details: result.details || {},
      });
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
    "yourbank-verify.com",
    "amazonshopping.site",
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
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <div className="flex items-center p-1.5 bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="flex items-center pl-3 text-gray-400">
                <Search size={18} />
              </div>
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="w-full px-3 py-3 border-0 shadow-none focus:ring-0 text-gray-900 placeholder-gray-400 text-lg"
                          placeholder={`Enter a domain (e.g., ${placeholderExamples[currentPlaceholder]})`}
                          {...field}
                        />
                        {field.value && (
                          <button
                            type="button"
                            onClick={resetForm}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-md m-1 flex items-center justify-center"
              >
                {loading ? (
                  <SpinnerMini />
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-1.5" />
                    Scan Domain
                  </>
                )}
              </Button>
            </div>

            <div className="text-center mt-1.5 text-xs text-gray-500">
              Enter any website domain to check if it's safe
            </div>
          </div>
        </form>
      </Form>

      {error && (
        <div className="mt-5 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 flex items-start">
          <AlertTriangle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
          <span>{error}</span>
        </div>
      )}

      {score !== null && domainData && (
        <div className="mt-8 transition-all duration-300 ease-in-out animate-fadeIn">
          <SecurityReport score={score} data={domainData} />
        </div>
      )}

      {!score && !error && !loading && form.formState.isSubmitted && (
        <div className="mt-8 text-center p-5 bg-gray-50 rounded-lg border border-gray-100 text-gray-600">
          No results to display. Try checking a different domain.
        </div>
      )}
    </div>
  );
};

export default InputScam;
