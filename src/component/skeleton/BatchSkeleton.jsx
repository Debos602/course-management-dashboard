import React from "react";
import { Search, Hash, Users, Calendar, Eye } from "lucide-react";

const BatchSkeleton = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
              <div className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Batches Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="h-3 bg-gray-200 animate-pulse" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-10 bg-gray-100 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state hint */}
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 animate-pulse flex items-center justify-center">
          <Eye className="w-8 h-8 text-gray-300" />
        </div>
        <div className="h-6 w-48 bg-gray-200 rounded mx-auto animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
      </div>
    </div>
  );
};

export default BatchSkeleton;
