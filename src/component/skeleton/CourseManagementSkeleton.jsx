import { useState } from 'react';
import { 
  Plus, Edit, Trash2, Eye, Search, Filter, X, Save, Users, 
  Clock, DollarSign, Star, Tag, ChevronLeft, ChevronRight, 
  Hash, Check, Globe
} from 'lucide-react';

const CourseManagementSkeleton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg animate-pulse">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
              <div className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 animate-pulse">
                <div className="h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <span className="text-gray-400">-</span>
              <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-28 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-blue-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Tag Filters Skeleton */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display Skeleton */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-32 h-7 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>

      {/* Courses Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Course Thumbnail Skeleton */}
            <div className="relative h-48 overflow-hidden bg-gray-200 animate-pulse"></div>

            {/* Course Content Skeleton */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              {/* Tags Skeleton */}
              <div className="flex flex-wrap gap-1 mb-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Modal Skeleton */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Form fields skeleton */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={i < 2 ? "md:col-span-2" : ""}>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-40 h-10 bg-blue-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagementSkeleton;