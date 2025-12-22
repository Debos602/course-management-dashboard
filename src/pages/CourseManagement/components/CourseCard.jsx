import React from 'react';
import { Edit, Trash2, Hash, Star, Tag } from 'lucide-react';

const CourseCard = ({ course, onEdit, onDelete, onCreateQuiz }) => {
  return (
    <div className="course-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img src={course.thumbnailURL || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop'} alt={course.title} className="w-full h-full object-cover" />

        {course.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-gray-900">{course.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
          <span className="text-xl font-bold text-blue-600">${course.price}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && <span className="text-xs text-gray-500">+{course.tags.length - 3} more</span>}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Instructor</p>
            <p className="text-sm font-medium">{course.instructorName}</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => onCreateQuiz && onCreateQuiz(course._id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Create Quiz for this course">
              <Hash className="w-4 h-4" />
            </button>
            <button onClick={() => onEdit && onEdit(course)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete && onDelete(course._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
