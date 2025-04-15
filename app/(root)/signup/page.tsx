import React from "react";
import { Shield, UserPlus } from "lucide-react";
import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | AI Scam Alert",
  description: "Create an account to access personalized scam protection",
};

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Create an Account
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Join our community and get personalized protection against online
            scams
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <SignupForm />
        </div>

        {/* Benefits info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            By creating an account, you get access to:
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
              Personalized alerts
            </div>
            <div className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
              Safety dashboard
            </div>
            <div className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
              Report tracking
            </div>
            <div className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
              Security reports
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
