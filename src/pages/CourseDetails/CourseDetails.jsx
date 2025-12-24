import { useParams, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useGetCourseByIdQuery } from '../../redux/features/courses/coursesApi';
import { useCreateEnrollmentsMutation } from '../../redux/features/enrollments/enrollmentsApi';
import { useSelector } from 'react-redux';


export default function CourseDetails() {

    const user = useSelector((state) => state.auth.user);

  const { courseId } = useParams();
  const { data: courseResp, isLoading, error } = useGetCourseByIdQuery(courseId);
  const course = courseResp?.data || courseResp;

  const [createEnrollments] = useCreateEnrollmentsMutation();

  const handleEnroll = async () => {
        try {
            await createEnrollments({
            courseId,
            userId: user._id, // auth / redux / context থেকে
            }).unwrap();

            toast.success(`Enrolled in ${course?.title || "course"}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to enroll.");
        }
        };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto text-center">
          <h3 className="text-xl font-bold text-red-600 mb-2">Course not found</h3>
          <p className="mb-6 text-gray-600">{error?.message || 'Could not load course details.'}</p>
          <Link to="/dashboard" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
  <section className="min-h-screen py-12 px-4">
  <div className="max-w-6xl mx-auto relative">
    
    {/* HERO */}
    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16">
      <img
        src={course.thumbnailURL}
        alt={course.title}
        className="w-full h-[420px] object-cover scale-105"
      />

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent backdrop-blur-sm"></div>

      <div className="absolute bottom-0 left-0 p-10 text-white max-w-3xl">
        <span className="inline-block mb-3 px-4 py-1 rounded-full bg-white/20 text-sm tracking-wide">
          {course.category || 'General'}
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          {course.title}
        </h1>

        <p className="text-white/80 text-lg mb-6">
          {course.description}
        </p>

        <div className="flex items-center gap-6">
          <span className="font-medium">
            Instructor: {course.instructorName || 'Unknown'}
          </span>

          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-5 h-5 fill-yellow-400" />
            <span className="text-white font-semibold">
              {course.rating ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* CONTENT GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

      {/* LEFT CONTENT */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-10 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          What you’ll learn
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 mb-10">
          <div>
            <span className="block text-sm font-semibold text-gray-500">Status</span>
            <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${
              course.isPublished
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {course.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>

          <div>
            <span className="block text-sm font-semibold text-gray-500">Category</span>
            <p className="mt-2 font-medium">{course.category}</p>
          </div>
        </div>

        {Array.isArray(course.tags) && course.tags.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm shadow-md hover:scale-105 transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* RIGHT STICKY CARD */}
      <div className="lg:sticky lg:top-24 h-fit bg-white rounded-3xl shadow-2xl p-8 border">
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">Course Price</p>
          <p className="text-4xl font-extrabold text-sky-600 mt-2">
            ${course.price}
          </p>
        </div>

        <button
          onClick={handleEnroll}
          className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-blue-600 hover:to-sky-700 transition-all shadow-lg hover:shadow-xl"
        >
          🚀 Enroll Now
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Lifetime access · Certificate included
        </p>
      </div>

    </div>
  </div>
</section>

  );
}