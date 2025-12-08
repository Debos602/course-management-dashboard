import { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Eye, Search, Filter, X, Save, Users, 
  Clock, DollarSign, Star, Tag, ChevronLeft, ChevronRight, 
  Loader2, Hash, Check, Globe
} from 'lucide-react';
import { useCreateCourseMutation, useDeleteCourseMutation, useGetAllCoursesQuery, useUpdateCourseMutation } from '../../redux/features/courses/coursesApi';
import { toast } from 'sonner';
import CourseManagementSkeleton from '../../component/skeleton/CourseManagementSkeleton';

const CourseManagement = () => {
  
  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Get all courses with filters
  const { data: coursesResponse, isLoading, error, refetch } = useGetAllCoursesQuery({
    page,
    limit,
    search: search || undefined,
    category: selectedCategory || undefined,
    tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
    status: selectedStatus || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
  });

  console.log("API Response:", coursesResponse);

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  // Extract data from API response based on your backend structure
  const courses = coursesResponse?.data || [];
  const meta = coursesResponse?.meta || {};
  
  const totalCourses = meta.total || 0;
  const totalPages = meta.totalPages || 1;

  // Extract unique categories and tags from ALL courses
  const categories = [...new Set(courses.map(course => course.category).filter(Boolean))];
  const allTags = [...new Set(courses.flatMap(course => course.tags || []).filter(Boolean))];

  // Calculate stats
  const stats = {
    total: totalCourses,
    published: courses.filter(c => c.isPublished).length,
    draft: courses.filter(c => !c.isPublished).length,
    totalEnrollment: courses.reduce((sum, course) => sum + (course.enrollment || 0), 0),
    totalRevenue: courses.reduce((sum, course) => sum + (course.price || 0), 0)
  };

  // Local state for form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [data, setData] = useState({
    title: '',
    description: '',
    instructorName: '',
    price: '',
    category: '',
    tags: [],
    isPublished: false,
    thumbnailURL: '',
    thumbnailPreview: ''
  });

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedTags, selectedStatus, minPrice, maxPrice]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle tag selection in form
  const handleTagToggle = (tag) => {
    setData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for display
      const previewURL = URL.createObjectURL(file);
      
      setData(prev => ({
        ...prev,
        thumbnailURL: file,
        thumbnailPreview: previewURL
      }));
    }
  };

  // Open modal for creating new course
  const handleCreate = () => {
    setEditingCourse(null);
    setData({
      title: '',
      description: '',
      instructorName: '',
      price: '',
      category: '',
      tags: [],
      isPublished: false,
      thumbnailURL: '',
      thumbnailPreview: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing course
  const handleEdit = (course) => {
    setEditingCourse(course);
    setData({
      title: course.title,
      description: course.description,
      instructorName: course.instructorName,
      price: course.price,
      category: course.category,
      tags: course.tags || [],
      isPublished: course.isPublished,
      thumbnailURL: course.thumbnailURL || '',
      thumbnailPreview: course.thumbnailURL || ''
    });
    setIsModalOpen(true);
  };

  // Handle course deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id).unwrap();
        toast.success('Course deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete course');
      }
    }
  };

  // Handle form submission (create/update)
// Handle form submission (create/update)
// Handle form submission (create/update)
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Create FormData object for file upload
    const formData = new FormData();
    
    const payload = {
      title: data.title,
      description: data.description,
      instructorName: data.instructorName,
      price: Number(data.price),
      category: data.category,
      tags: data.tags, // Use data.tags instead of selectedTags
      isPublished: data.isPublished, // Use isPublished directly from data
    };
    
    // Add JSON payload
    formData.append("payload", JSON.stringify(payload));

    // Only append file if file is new File object (upload)
    if (data.thumbnailURL instanceof File) {
      formData.append("thumbnailURL", data.thumbnailURL);
    }

    // Update or create
    if (editingCourse) {
      await updateCourse({ 
        courseId: editingCourse._id, 
        body: formData 
      }).unwrap();
      toast.success("Course updated successfully");
    } else {
      await createCourse(formData).unwrap();
      toast.success("Course created successfully");
    }

    setIsModalOpen(false);
    setEditingCourse(null);
    refetch();

  } catch (error) {
    console.error("Submission error:", error);
    if (error.data?.errorMessages) {
      error.data.errorMessages.forEach(err => toast.error(`${err.path}: ${err.message}`));
    } else {
      toast.error(error.data?.message || error.message || "Operation failed");
    }
  }
};

  // Handle tag filter toggle
  const handleTagFilterToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
    setSelectedStatus('');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    setPage(1);
  };

  // Loading state
  if (isLoading && page === 1) {
    return (
      <CourseManagementSkeleton />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Courses</h3>
          <p className="text-red-600">{error.message || 'Failed to load courses'}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
        <p className="text-gray-600">Manage your courses with advanced filtering and search</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Hash className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Eye className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Enrollment</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollment.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses by title, description, instructor, or tags..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min Price"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max Price"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>

            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Course</span>
            </button>
          </div>
        </div>

        {/* Tag Filters Section */}
        {allTags.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 10).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagFilterToggle(tag)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  {selectedTags.includes(tag) && (
                    <Check className="w-3 h-3 ml-1" />
                  )}
                </button>
              ))}
              {allTags.length > 10 && (
                <span className="text-sm text-gray-500 px-2 py-1">
                  +{allTags.length - 10} more tags
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || selectedTags.length > 0 || selectedStatus || minPrice || maxPrice || search) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              Search: "{search}"
              <button onClick={() => setSearch('')} className="ml-1 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('')} className="ml-1 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedTags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              Tag: {tag}
              <button onClick={() => handleTagFilterToggle(tag)} className="ml-1 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedStatus && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              Status: {selectedStatus}
              <button onClick={() => setSelectedStatus('')} className="ml-1 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              Price: ${minPrice || '0'} - ${maxPrice || '∞'}
              <button onClick={() => {
                setMinPrice('');
                setMaxPrice('');
              }} className="ml-1 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Courses Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.length > 0 ? courses.map(course => (
              <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Course Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnailURL || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop'}
                    alt={course.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Rating Badge */}
                  {course.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-gray-900">{course.rating.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                    <span className="text-xl font-bold text-blue-600">${course.price}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  {/* Tags */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {course.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{course.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Instructor</p>
                      <p className="text-sm font-medium">{course.instructorName}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="md:col-span-3 text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create New Course
                </button>
              </div>
            )}
          </div>

          {/* Pagination - Only show if we have courses */}
          {courses.length > 0 && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{((page - 1) * limit) + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(page * limit, totalCourses)}</span> of{' '}
                <span className="font-semibold">{totalCourses}</span> courses
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Items per page:</span>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value="6">6</option>
                  <option value="9">9</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={data.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows="3"
                      value={data.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Describe the course content, objectives, and target audience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor Name *
                    </label>
                    <input
                      type="text"
                      name="instructorName"
                      required
                      value={data.instructorName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter instructor name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={data.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 44.99"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      required
                      value={data.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., optimization"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {allTags.slice(0, 10).map(tag => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                            data.tags.includes(tag)
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          {data.tags.includes(tag) && (
                            <Check className="w-3 h-3 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add custom tags (comma separated)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value && !data.tags.includes(value)) {
                            setData(prev => ({
                              ...prev,
                              tags: [...prev.tags, value]
                            }));
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail
                    </label>
                    
                    {/* Show selected filename */}
                    {data.thumbnailURL && data.thumbnailURL instanceof File && (
                      <div className="mb-2 text-sm text-green-600">
                        Selected: {data.thumbnailURL.name}
                      </div>
                    )}
                    
                    {/* Show existing thumbnail if editing */}
                    {editingCourse && !(data.thumbnailURL instanceof File) && data.thumbnailURL && (
                      <div className="mb-2">
                        <img 
                          src={data.thumbnailURL} 
                          alt="Current thumbnail" 
                          className="w-32 h-20 object-cover rounded"
                        />
                      </div>
                    )}
                    
                    <input
                      type="file"
                      name="thumbnailURL"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Upload a thumbnail image for the course
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={data.isPublished}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Publish this course</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-colors"
                    disabled={isCreating || isUpdating}
                  >
                    <Save className="w-4 h-4" />
                    {editingCourse ? (isUpdating ? 'Updating...' : 'Update Course') : (isCreating ? 'Creating...' : 'Create Course')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;