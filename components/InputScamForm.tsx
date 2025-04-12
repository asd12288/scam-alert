"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import SpinnerMini from "./ui/SpinnerMini";
import Report from "./Report";
import { AlertTriangle, Search, X, Bot, Brain } from "lucide-react";

const formSchema = z.object({
  domain: z.string().min(3, "Domain is required"),
});

const InputScam = () => {
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

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-4 text-center">
        <div className="inline-flex items-center justify-center bg-[rgba(255,77,79,0.05)] px-4 py-2 rounded-lg border border-[rgba(255,77,79,0.1)] mb-3">
          <Brain className="w-4 h-4 text-[rgb(255,77,79)] mr-2" />
          <p className="text-sm text-gray-700">Our AI analyzes domains for scam patterns</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center p-1 bg-white shadow-md rounded-lg border border-gray-100">
            <div className="flex items-center pl-3 text-gray-400">
              <Search size={20} />
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
                        placeholder="Enter a domain for AI scanning"
                        {...field}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={18} />
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
              className="min-w-[120px] bg-[rgb(255,77,79)] hover:bg-[rgb(255,30,30)] text-white font-medium px-6 py-3 rounded-md m-1 flex items-center justify-center"
            >
              {loading ? <SpinnerMini /> : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  AI Scan
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {error && (
        <div className="mt-4 p-3 bg-[#fff8f8] border border-[rgba(255,77,79,0.3)] rounded-lg text-[rgb(255,77,79)] flex items-start">
          <AlertTriangle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
          <span>{error}</span>
        </div>
      )}

      {score !== null && domainData && (
        <div className="mt-6 fade-in">
          <Report score={score} data={domainData} />
        </div>
      )}

      {!score && !error && !loading && form.formState.isSubmitted && (
        <div className="mt-6 text-center p-6 bg-gray-50 rounded-lg border border-gray-100 text-gray-600">
          No results to display. Try checking a different domain.
        </div>
      )}
    </div>
  );
};

export default InputScam;
