"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Shield, Lock } from "lucide-react";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SpinnerMini from "@/components/ui/SpinnerMini";
import { supabase } from "@/lib/supabase";

// Create a client component that safely uses the useSearchParams hook
function UpdatePasswordContent() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Verify the recovery token when the page loads
  useEffect(() => {
    async function verifyRecoveryToken() {
      try {
        // Get the recovery token from the URL
        // In Supabase, the recovery token is usually passed as a hash parameter
        // and handled internally, but we're adding this check as an example
        const hash = window.location.hash;

        // If no hash is present, the link might be invalid
        if (!hash) {
          setError(
            "Invalid or expired password reset link. Please request a new one."
          );
          setIsValid(false);
          setIsVerifying(false);
          return;
        }

        // The hash contains credentials in the format #access_token=XXX&refresh_token=YYY&...
        // We don't need to manually parse it as Supabase's client SDK will detect it

        // Check if the session is valid
        // This will automatically pick up the access token from the URL if present
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          throw new Error(error?.message || "Invalid or expired reset link");
        }

        setIsValid(true);
      } catch (err: any) {
        console.error("Recovery verification error:", err);
        setError(
          err.message ||
            "Failed to verify recovery link. Please request a new one."
        );
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    }

    verifyRecoveryToken();
  }, []);

  if (isVerifying) {
    return (
      <div className="text-center">
        <SpinnerMini size={30} />
        <p className="mt-4 text-gray-600">Verifying your reset link...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
          <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {isValid ? (
        <UpdatePasswordForm />
      ) : (
        <div className="text-center">
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
            <p className="font-medium">Invalid Recovery Link</p>
            <p className="text-sm mt-1">
              {error || "Your password reset link is invalid or has expired."}
            </p>
          </div>
          <p className="mt-4 text-gray-600">
            Please request a new password reset link.
          </p>
          <Link
            href="/reset-password"
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Request New Link
          </Link>
        </div>
      )}
    </>
  );
}

// Main page component with Suspense boundary
export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Create New Password
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Please enter a new secure password for your account
          </p>
        </div>

        {/* Password Update Form or Error */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <Suspense
            fallback={
              <div className="text-center">
                <SpinnerMini size={30} />
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            }
          >
            <UpdatePasswordContent />
          </Suspense>
        </div>

        {/* Security info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            For security reasons, password reset links expire after 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
