import React from "react";
import { Shield, KeyRound } from "lucide-react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reset Password | Scam Protector",
  description: "Reset your Scam Protector account password",
};

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Reset Your Password
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <KeyRound className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <ResetPasswordForm />
        </div>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Back to login
            </Link>
          </p>
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
};

export default ResetPasswordPage;
