import React from "react";

const SecurityReportSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
      {/* Header skeleton */}
      <div className="px-5 py-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200"></div>
          <div className="overflow-hidden">
            <div className="h-6 bg-gray-200 rounded w-44 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gray-100"></div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="p-4">
        {/* Screenshot placeholder */}
        <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
          <div className="relative h-48 bg-gray-200"></div>
        </div>

        {/* Summary section skeleton */}
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>

          {/* Key findings skeleton */}
          <div className="mt-5">
            <div className="h-5 bg-gray-200 rounded w-36 mb-3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-gray-100 border border-gray-200 flex items-start"
                >
                  <div className="w-5 h-5 rounded-full bg-gray-200 mr-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Information section skeleton */}
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-gray-200 bg-gray-50"
              >
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations section skeleton */}
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-52 mb-3"></div>
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-gray-200 mr-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical details button skeleton */}
        <div className="mt-6">
          <div className="flex items-center justify-between w-full px-4 py-2 bg-gray-200 rounded-lg">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="w-5 h-5 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* Help section button skeleton */}
        <div className="mt-6">
          <div className="flex items-center justify-between w-full px-4 py-2 bg-gray-200 rounded-lg">
            <div className="h-4 bg-gray-300 rounded w-48"></div>
            <div className="w-5 h-5 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityReportSkeleton;
