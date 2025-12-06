// Loading Skeleton Component
export const CourseLoadingSkeleton = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between mb-6 bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
          <div className="max-w-[75%] space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Content Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded shadow p-4">
              {/* Video Player Skeleton */}
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="aspect-video bg-gray-200 rounded animate-pulse"></div>
              
              {/* Quiz Section Skeleton */}
              <div className="mt-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Buttons Skeleton */}
              <div className="mt-6 flex gap-3">
                <div className="h-10 w-40 bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
              </div>

              {/* Assignment Skeleton */}
              <div className="mt-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-100 rounded"></div>
                  <div className="h-32 bg-gray-100 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <aside className="bg-white p-4 rounded shadow animate-pulse">
            {/* Progress Bar Skeleton */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-10"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="mb-4">
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>

            {/* Lessons List Skeleton */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};