"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SpinnerMini from "./ui/SpinnerMini";

// Define the form schema with validation
const reportFormSchema = z.object({
  reporterName: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .optional(),
  reporterEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  suspiciousUrl: z.string().min(5, {
    message: "Please enter a valid URL or domain.",
  }),
  scamType: z.string().min(1, {
    message: "Please select a scam type.",
  }),
  description: z
    .string()
    .min(10, {
      message: "Please provide at least a brief description.",
    })
    .max(1000, {
      message: "Description must not exceed 1000 characters.",
    }),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

export function Report() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reporterName: "",
      reporterEmail: "",
      suspiciousUrl: "",
      scamType: "",
      description: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: ReportFormValues) {
    try {
      setIsSubmitting(true);
      setError(null);

      // Map form data to match Supabase column names (camelCase to snake_case)
      const reportData = {
        reporter_name: data.reporterName,
        reporter_email: data.reporterEmail,
        suspicious_url: data.suspiciousUrl,
        scam_type: data.scamType,
        description: data.description,
        reported_at: new Date().toISOString(),
        status: "pending_review",
      };

      // Submit the data to Supabase
      const { error: supabaseError } = await supabase
        .from("scam_reports")
        .insert([reportData]);

      if (supabaseError) throw supabaseError;

      // Show success message and reset form
      setIsSuccess(true);
      form.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error("Error submitting report:", err);
      setError(
        err.message || "Failed to submit your report. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Scam type options
  const scamTypes = [
    { value: "phishing", label: "Phishing or Fake Website" },
    { value: "investment", label: "Investment or Cryptocurrency Scam" },
    { value: "romance", label: "Romance Scam" },
    { value: "shopping", label: "Shopping or Marketplace Fraud" },
    {
      value: "impersonation",
      label: "Impersonation Scam (Government, Tech Support, etc.)",
    },
    { value: "malware", label: "Malware or Virus Distribution" },
    { value: "employment", label: "Job or Employment Scam" },
    { value: "other", label: "Other Scam Type" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Submit a Scam Report</h2>

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg text-green-700 flex items-center">
          <CheckCircle className="mr-2 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium">Thank you for your report!</p>
            <p className="text-sm">
              Your submission helps protect others from scams.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 flex items-center">
          <AlertTriangle className="mr-2 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium">Submission error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="reporterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    You can choose to remain anonymous
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reporterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We may contact you for additional information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="suspiciousUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suspicious URL or Domain</FormLabel>
                <FormControl>
                  <Input placeholder="example-scam.com" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the website, email domain, or app name involved in the
                  scam
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scamType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scam Type</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select the type of scam</option>
                    {scamTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description of the Scam</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Please describe how the scam works, any interactions you had, and any other details that might help others avoid it."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include as many details as possible
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center pt-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center"
            >
              {isSubmitting ? (
                <SpinnerMini />
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
