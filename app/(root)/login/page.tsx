import React from "react";
import { Shield, Lock } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";
import { JsonLd } from "react-schemaorg";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In | Scam Protector",
  description:
    "Sign in to your Scam Protector account to access personalized scam detection features and saved reports.",
  keywords: [
    "login",
    "sign in",
    "user account",
    "scam protection",
    "access account",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/login",
  },
};

const LoginPage = () => {
  return (
    <>
      {/* Structured data for Login page */}
      <JsonLd<any>
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Sign In to Scam Protector",
          description:
            "Sign in to your account to access personalized scam detection features.",
          mainEntityOfPage: {
            "@type": "WebPageElement",
            name: "Login Form",
            description:
              "Secure login form for accessing Scam Protector user accounts.",
          },
        }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Welcome Back
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to access personalized scam protection
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <LoginForm />
          </div>

          {/* Security info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Secured with industry-standard encryption and authentication
              protocols
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
