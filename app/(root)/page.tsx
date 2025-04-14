"use client";

import InputScam from "@/components/InputScamForm";
import TestDomains from "@/components/TestDomains";
import React from "react";
import {
  Shield,
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  Bot,
  Brain,
  Zap,
} from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced AI header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-blue-600 text-sm font-medium mb-3">
            <Bot className="w-4 h-4 inline mr-1" /> Powered by Advanced AI
          </div>
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              <span className="text-blue-600">AI</span> Scam Alert
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg">
            Using artificial intelligence to detect and protect you from
            sophisticated online scams.
          </p>
        </div>

        {/* Main search form */}
        <div className="mb-12">
          <InputScam />
        </div>

        {/* AI Features highlight - New section */}
        <div className="mb-12 bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            Our AI-Powered Security Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center shadow-sm">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                Real-time Analysis
              </h3>
              <p className="text-sm text-gray-600">
                Neural networks analyze websites in seconds for scam patterns
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center shadow-sm">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Deep Learning</h3>
              <p className="text-sm text-gray-600">
                Our models learn and adapt to emerging scam techniques
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center shadow-sm">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                Predictive Defense
              </h3>
              <p className="text-sm text-gray-600">
                AI identifies threats before they become widespread
              </p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-semibold text-blue-600">$1+ Trillion</p>
            <p className="text-sm text-gray-500">
              Global losses to scams in 2024
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-semibold text-blue-600">
              $12.5 Billion
            </p>
            <p className="text-sm text-gray-500">
              U.S. reported losses in 2024
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-semibold text-blue-600">85%</p>
            <p className="text-sm text-gray-500">People faced scam attempts</p>
          </div>
        </div>

        {/* Common scam examples */}
        <div className="mb-12">
          <h2 className="text-xl font-medium text-gray-800 mb-4 text-center">
            Emerging Scam Trends to Watch For
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-5 rounded-lg border border-red-100">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    AI-Driven Scams
                  </h3>
                  <p className="text-sm text-gray-600">
                    AI-generated deepfakes and voice cloning used to impersonate
                    loved ones and celebrities for financial fraud.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-5 rounded-lg border border-red-100">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Pig Butchering Scams
                  </h3>
                  <p className="text-sm text-gray-600">
                    Long-term trust building followed by investment fraud, often
                    through fake cryptocurrency or trading platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div className="mb-12 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h2 className="text-xl font-medium text-gray-800 mb-6 text-center flex items-center justify-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            How Our AI Scanner Works
          </h2>
          <div className="space-y-5">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Our AI scans the domain against multiple threat intelligence
                  databases
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Advanced machine learning analyzes domain registration
                  patterns and anomalies
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Neural network models evaluate website content for scam
                  indicators
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                4
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Real-time AI risk assessment updated with emerging scam
                  patterns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/guide"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              View Scam Prevention Guide
            </Link>
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Read Latest Scam Alerts
            </Link>
          </div>
        </div>

        {/* Test domain examples */}
        <div className="pb-8">
          <p className="text-sm text-center text-gray-500 mb-3">
            Try our scanner with these example domains:
          </p>
          <TestDomains />
        </div>
      </div>
    </div>
  );
};

export default page;
