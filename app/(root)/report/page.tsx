
import React from "react";
import { Shield, AlertTriangle, Brain } from "lucide-react";
import { Metadata } from "next";
import { Report } from "@/components/Report";

export const metadata: Metadata = {
  title: "Report a Scam | AI Scam Alert",
  description:
    "Report potential scams to help protect others from online fraud",
};

const ReportPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced AI header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-red-50 px-3 py-1 rounded-full text-red-600 text-sm font-medium mb-3">
            <AlertTriangle className="w-4 h-4 inline mr-1" /> Report a Scam
          </div>
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Report Suspicious Activity
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg mb-6">
            Help protect others by reporting scams, suspicious websites, or
            fraudulent activities.
          </p>
        </div>

        {/* Information about reporting */}
        <div className="mb-8 bg-blue-50 border border-blue-100 p-6 rounded-lg">
          <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            How Your Report Helps
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              When you report a scam, our AI systems analyze the information to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Add suspicious domains to our detection database</li>
              <li>Improve our AI models to detect similar scams</li>
              <li>Help warn others about emerging threats</li>
              <li>
                Create targeted educational materials about new scam types
              </li>
            </ul>
            <p className="text-gray-700">
              Your report is confidential and helps make the internet safer for
              everyone.
            </p>
          </div>
        </div>

        {/* Report form */}
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm mb-8">
          <Report />
        </div>

        {/* Additional information */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            For immediate assistance with active fraud, please also contact your
            financial institution or local authorities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
