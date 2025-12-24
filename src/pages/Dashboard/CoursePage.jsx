import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetCourseLessonsQuery,
  useGetStudentEnrollmentsQuery,
  useUpdateEnrollmentProgressMutation,
  useCreateAssignmentMutation,
} from "../../redux/features/courses/coursesApi";
import { toast } from "sonner";
import { Quiz } from "../../component/quiz/quiz";
import { AssignmentSubmit } from "../../component/assignment/AssignmentSubmit";
import { useGetQuizByIdQuery } from "../../redux/features/quize/quizeApi";
import { CourseLoadingSkeleton } from "../../component/skeleton/CourseLoadingSkeleton";



// Main Course Page
const CoursePage = () => {



  const { id } = useParams();
  const { data: quiz, isLoading: quizLoading } = useGetQuizByIdQuery(id);
  const { data: enrollmentsResp, isLoading: enrollLoading } = useGetStudentEnrollmentsQuery();

  const enrollmentForCourse = (enrollmentsResp?.data || enrollmentsResp || []).find(
    (enr) => (enr.course && (enr.course._id === id || enr.course.id === id))
  );

  const courseFromEnroll = enrollmentForCourse ? enrollmentForCourse.course : null;

  const initialCourse = courseFromEnroll
    ? {
        id: courseFromEnroll._id,
        title: courseFromEnroll.title,
        description: courseFromEnroll.description,
        progress: enrollmentForCourse?.progress ?? 0,
        lessons: courseFromEnroll.syllabus || [],
        thumbnailURL: courseFromEnroll.thumbnailURL,
      }
    : null;

  const [localCourse, setLocalCourse] = useState(initialCourse);
  const [quizResult, setQuizResult] = useState(null);

  const { data: lessonsResp, isLoading: lessonsLoading, isError: lessonsError } = useGetCourseLessonsQuery(id, { skip: !id });
  const [updateEnrollmentProgress] = useUpdateEnrollmentProgressMutation();
  const [createAssignment] = useCreateAssignmentMutation();

  // Normalize lessons
  let rawLessons = [];
  if (Array.isArray(lessonsResp)) rawLessons = lessonsResp;
  else if (Array.isArray(lessonsResp?.data)) rawLessons = lessonsResp.data;
  else if (lessonsResp && typeof lessonsResp === "object") rawLessons = [lessonsResp];

  const apiLessons = rawLessons.map((l) => ({
    id: l._id || l.id,
    title: l.title || l.name || "Untitled Lesson",
    videoURL: l.video || l.videoUrl || l.videoLink || l.contentUrl || l.videoURL || "",
    completed: l.completed || false,
    assignment: l.assignment || null,
    quiz: l.quiz || null,
  }));

  const initialLessons = apiLessons.length ? apiLessons : (localCourse?.lessons || []);
  const [lessons, setLessons] = useState(initialLessons);
  const [selectedLesson, setSelectedLesson] = useState(initialLessons[0] || null);
 
  const videoRef = useRef(null);

  useEffect(() => {
    const arr = apiLessons.length ? apiLessons : (localCourse?.lessons || []);
    setLessons(arr);
    setSelectedLesson(arr[0] || null);
  }, [lessonsResp, localCourse]);

  useEffect(() => {
    if (!localCourse && initialCourse) setLocalCourse(initialCourse);
  }, [initialCourse]);

  useEffect(() => {
    if (videoRef.current && typeof videoRef.current.play === "function") {
      const p = videoRef.current.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    }
  }, [selectedLesson]);

  useEffect(() => {
    setQuizResult(null);
  }, [selectedLesson]);

  // Show loading skeleton if any loading state is true
  if (lessonsLoading || enrollLoading || quizLoading || !localCourse) {
    return <CourseLoadingSkeleton />;
  }

  const handleToggleComplete = async (lessonId) => {
    if (!localCourse) return;

    const prevLessons = localCourse?.lessons || lessons;
    const prev = prevLessons.find((l) => l.id === lessonId);
    const prevCompleted = prev?.completed || false;

    const updatedLessons = prevLessons.map((l) =>
      l.id === lessonId ? { ...l, completed: !l.completed } : l
    );

    const toggledToCompleted = !prevCompleted;
    const total = updatedLessons.length || 1;
    const done = updatedLessons.filter((l) => l.completed).length;
    let newProgress = Math.round((done / total) * 100);
    if (toggledToCompleted) newProgress = 100;

    const updatedCourse = { ...localCourse, lessons: updatedLessons, progress: newProgress };
    setLocalCourse(updatedCourse);

    const completedLessons = updatedLessons.filter((l) => l.completed).map((l) => l.id);

    try {
      const res = await updateEnrollmentProgress({ courseId: localCourse.id, body: { progress: newProgress, completedLessons } }).unwrap();
      const enrollment = res?.data || res;
      if (enrollment) {
        const serverCourse = enrollment.course || courseFromEnroll || {};
        setLocalCourse((prev) => ({
          ...prev,
          progress: enrollment.progress ?? newProgress,
          lessons: prev.lessons.map((l) => ({
            ...l,
            completed: (enrollment.completedLessons || []).includes(l.id) || l.completed,
          })),
        }));
      }
      toast?.success?.("Progress updated");
    } catch (err) {
      console.error(err);
      toast?.error?.("Failed to update progress");
      // revert
      setLocalCourse((prev) => ({
        ...prev,
        lessons: prev.lessons.map((l) => (l.id === lessonId ? { ...l, completed: !prevCompleted } : l)),
        progress: prev.progress,
      }));
    }
  };

  const handleAssignmentSubmit = async (lessonId, payload) => {
    const prevLessons = localCourse?.lessons || lessons;
    const prevLesson = prevLessons.find((l) => l.id === lessonId);

    setLocalCourse((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l) => (l.id === lessonId ? { ...l, assignment: { ...payload, submitted: true } } : l)),
    }));

    const body = { lessonId, submissionLink: payload.submittedLink || null, description: payload.submittedDescription || null };

    try {
      const res = await createAssignment({ courseId: localCourse.id, body }).unwrap();
      const server = res?.data || res;
      setLocalCourse((prev) => ({
        ...prev,
        lessons: prev.lessons.map((l) => (l.id === lessonId ? { ...l, assignment: server } : l)),
      }));
      toast?.success?.("Assignment submitted");
    } catch (err) {
      console.error(err);
      toast?.error?.("Failed to submit assignment");
      setLocalCourse((prev) => ({
        ...prev,
        lessons: prev.lessons.map((l) => (l.id === lessonId ? { ...l, assignment: prevLesson?.assignment || null } : l)),
      }));
    }
  };

  const handleQuizScore = (scoreObj) => {
    setQuizResult({ lessonId: selectedLesson?.id, ...scoreObj });
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="max-w-[75%] space-y-1">
            <h1 className="text-3xl font-bold text-brand-900 leading-snug">{localCourse?.title}</h1>
            <p className="text-sm text-gray-600 leading-relaxed">{localCourse?.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <div className="px-3 py-1 text-sm font-semibold bg-brand-100 text-brand-700 rounded-full shadow-inner">{localCourse?.progress}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded shadow p-4">
              {lessonsError ? (
                <div className="p-8 text-center text-red-600">Failed to load lessons.</div>
              ) : selectedLesson ? (
                <>
                  <h2 className="text-xl font-semibold text-brand-800">{selectedLesson.title}</h2>
                  <div className="mt-3 aspect-video bg-black">
                    {selectedLesson.videoURL ? (
                      selectedLesson.videoURL.endsWith(".mp4") || selectedLesson.videoURL.includes(".mp4") ? (
                        <video key={selectedLesson.id} ref={videoRef} className="w-full h-full" controls autoPlay>
                          <source src={selectedLesson.videoURL} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <iframe
                          key={selectedLesson.id}
                          className="w-full h-full"
                          src={selectedLesson.videoURL}
                          title={selectedLesson.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No video available</div>
                    )}
                  </div>
                 
                    <Quiz quiz={quiz?.data?.questions} onScore={handleQuizScore} />
                 
                  
                  <div className="mt-3 flex items-center gap-3">
                    <button onClick={() => handleToggleComplete(selectedLesson.id)} className={`px-4 py-2 rounded ${selectedLesson.completed ? "bg-green-600 text-white" : "bg-brand-600 text-white"}`}>
                      {selectedLesson.completed ? "Completed" : "Mark as Completed"}
                    </button>

                    <Link to="/dashboard" className="text-sm text-gray-600 underline">Back to Dashboard</Link>
                  </div>

                  {quizResult && quizResult.lessonId === selectedLesson.id && (
                    <div className="mt-2 p-2 bg-brand-50 rounded">Score: {quizResult.score} / {quizResult.total}</div>
                  )}

                  <div className="mt-6">
                    <AssignmentSubmit assignment={selectedLesson.assignment} onSubmit={(p) => handleAssignmentSubmit(selectedLesson.id, p)} />
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">No lessons available for this course.</div>
              )}
            </div>
          </div>

          {/* Right */}
          <aside className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Running Module</div>
                <div className="text-sm font-semibold text-brand-700">{localCourse?.progress}%</div>
              </div>
              <div className="mt-2 w-full bg-gray-200 h-2 rounded overflow-hidden">
                <div className="h-2 bg-brand-600" style={{ width: `${localCourse?.progress}%` }} />
              </div>
            </div>

            <div className="mb-4">
              <input placeholder="Search lesson" className="w-full border rounded p-2 focus:ring-brand-500" onChange={(e) => {
                const q = e.target.value.toLowerCase();
                if (!q) setLessons(apiLessons.length ? apiLessons : (localCourse?.lessons || []));
                else setLessons((apiLessons.length ? apiLessons : (localCourse?.lessons || [])).filter(l => (l.title || '').toLowerCase().includes(q)));
              }} />
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {lessons.map((l, idx) => (
                <button key={l.id || idx} onClick={() => setSelectedLesson(l)} className={`w-full text-left p-3 rounded ${selectedLesson?.id === l.id ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-900"} hover:opacity-90`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{l.title}</div>
                    </div>
                    <div className="text-sm font-semibold">{l.completed ? "✓" : ""}</div>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;