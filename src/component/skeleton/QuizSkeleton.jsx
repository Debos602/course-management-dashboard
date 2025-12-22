export const QuizSkeleton = () => {
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-100 min-h-screen">
      {/* Header */}
      <div className="h-9 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

      {/* Quizzes Section */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
        <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>

        <ul className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <li
              key={i}
              className="p-4 border border-gray-200 rounded-lg flex justify-between items-start animate-pulse"
            >
              <div className="flex-1">
                <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-64 bg-gray-200 rounded"></div>
              </div>
              <div className="space-x-3 flex">
                <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};