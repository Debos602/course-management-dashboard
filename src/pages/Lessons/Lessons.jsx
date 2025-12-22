import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import LessonsSkeleton from '../../component/skeleton/LessonsSkeleton';
import { toast } from 'sonner';
import { useDeleteLessonMutation } from '../../redux/features/courses/coursesApi';
import { useGetLessonsQuery } from '../../redux/features/lessons/lessonAPi';

export default function Lessons() {
    const listRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;

    // RTK Query: fetch lessons
    const { data: lessonsResponse, error, isLoading: loading, refetch } = useGetLessonsQuery({ page: currentPage, limit });
console.log(lessonsResponse);
    const lessons = lessonsResponse?.data || [];
    const meta = lessonsResponse?.meta || { totalPages: 1 };

    // Delete mutation
    const [deleteLesson] = useDeleteLessonMutation();

    // Delete handler
    const handleDelete = (id) => {
        toast('Delete this lesson?', {
            description: 'This action cannot be undone.',
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        await deleteLesson(id).unwrap();
                        refetch();
                        toast.success('Lesson deleted');
                    } catch (err) {
                        console.error('Delete error', err);
                        toast.error(err?.data?.message || err?.message || 'Failed to delete lesson');
                    }
                },
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {},
            },
            duration: Infinity,
            position: 'top-center',
        });
    };

    // GSAP animation
    useEffect(() => {
        if (!listRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.lesson-card', {
                duration: 0.6,
                y: 16,
                opacity: 0,
                stagger: 0.06,
                ease: 'power3.out',
            });
        }, listRef);

        return () => ctx.revert();
    }, [lessons]);

    // Pagination handlers
    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < meta.totalPages) setCurrentPage(prev => prev + 1);
    };

    // Optional: scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Lessons</h2>
            </div>

            {loading && <LessonsSkeleton />}
            {error && <p className="text-sm text-red-600">{error?.data?.message || error.message}</p>}

            <div ref={listRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                    <article key={lesson._id} className="lesson-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="relative h-44 bg-black/5 flex items-center justify-center">
                            <video src={lesson.videoURL} controls className="w-full h-full object-cover" />
                        </div>

                        <div className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{lesson.title}</h3>
                                    <p className="text-sm text-gray-500">Duration: {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s</p>
                                    <p className="text-xs text-gray-400 mt-2">Created: {new Date(lesson.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex-shrink-0 ml-3 flex items-start gap-2">
                                    <button onClick={() => handleDelete(lesson._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm">Delete</button>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 gap-4">
                <button 
                    disabled={currentPage === 1 || loading} 
                    onClick={handlePrev}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span className="text-gray-700">Page {currentPage} of {meta.totalPages}</span>
                <button 
                    disabled={currentPage >= meta.totalPages || loading} 
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
