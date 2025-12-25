export const StudentDashboardSkeleton = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 animate-pulse">
          <div>
            <div className="h-9 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div className="text-center">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-8 bg-gray-200 rounded mt-1"></div>
            </div>
            <div className="text-center">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-6 w-12 bg-gray-200 rounded mt-1"></div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <article key={i} className="bg-white rounded-lg shadow p-5 animate-pulse">
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-6 w-40 bg-gray-200 rounded"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="mt-2 w-20 h-20 rounded-full bg-gray-200"></div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};