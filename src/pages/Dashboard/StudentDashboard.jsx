import { Link } from "react-router-dom";
import { mockCourses } from "../../data/mockCourses";
import { useAppSelector } from "../../redux/features/hook";
import { useGetEnrollmentsQuery } from "../../redux/features/courses/coursesApi";

const StudentDashboard = () => {
  const user = useAppSelector((s) => s.auth.user);
  const { data: enrollResp, isLoading, isError, error } = useGetEnrollmentsQuery();

  // Map API enrollments to course-shaped objects for UI
  const apiCourses = (enrollResp?.data || []).map((enr) => {
    const c = enr.course || {};
    return {
      id: c._id,
      title: c.title,
      description: c.description,
      progress: enr.progress ?? 0,
      lessons: (c.syllabus && c.syllabus.length) || 0,
      thumbnailURL: c.thumbnailURL,
      enrolledAt: enr.enrolledAt,
    };
  });

  const courses = apiCourses.length ? apiCourses : mockCourses.filter((c) => c.enrolled);

  const avgProgress = Math.round(
    courses.reduce((acc, c) => acc + (c.progress || 0), 0) / (courses.length || 1)
  );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-brand-900">Hello, {user?.name || user?.Username || 'Student'}</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back — continue learning where you left off.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-500">Courses</div>
              <div className="text-xl font-semibold text-brand-800">{courses.length}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Avg Progress</div>
              <div className="text-xl font-semibold text-brand-800">{avgProgress}%</div>
            </div>
            <Link to="/dashboard" className="px-4 py-2 bg-white border rounded text-sm shadow">Overview</Link>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <article key={course.id} className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-brand-800">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{course.description.slice(0, 100)}...</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Progress</div>
                  <div className="mt-2 w-20 h-20 rounded-full flex items-center justify-center bg-brand-50 text-brand-800 font-semibold">{course.progress}%</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-1 bg-brand-100 text-brand-700 rounded text-xs">{course.lessons.length} lessons</span>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{course.progress >= 100 ? 'Completed' : 'In progress'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/dashboard/course/${course.id}`} className="px-3 py-2 bg-brand-600 text-white rounded text-sm">Continue</Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
