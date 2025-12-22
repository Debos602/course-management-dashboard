import { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, Eye, Search, Filter, X, Save, Users, 
  Clock, DollarSign, Star, Tag, ChevronLeft, ChevronRight, 
  Loader2, Hash, Check, Globe
} from 'lucide-react';
import { useCreateCourseMutation, useDeleteCourseMutation, useGetAllCoursesQuery, useUpdateCourseMutation } from '../../redux/features/courses/coursesApi';
import { useCreateQuizMutation } from '../../redux/features/quize/quizeApi';
import CourseCard from './components/CourseCard';
import Controls from './components/Controls';
import CourseModal from './components/CourseModal';
import QuizModal from './components/QuizModal';
import StatsCards from './components/StatsCards';
import { toast } from 'sonner';
import CourseManagementSkeleton from '../../component/skeleton/CourseManagementSkeleton';
import gsap from 'gsap';

const CourseManagement = () => {
  
  // GSAP refs and timeline
  const statsRef = useRef(null);
  const controlsRef = useRef(null);
  const headerRef = useRef(null);
  const courseCardsRef = useRef([]);
  const modalRef = useRef(null);
  const tl = useRef(gsap.timeline());
  
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

  // Quiz modal state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizCourseId, setQuizCourseId] = useState(null);
  const [quizData, setQuizData] = useState({
    title: '',
    course: '',
    questions: [
      { question: '', options: ['', ''], correctAnswerIndex: 0, explanation: '', marks: 1 }
    ],
    durationMinutes: 30,
    totalMarks: 0,
    isPublished: false
  });

  const [createQuiz, { isLoading: isCreatingQuiz }] = useCreateQuizMutation();

  // Enhanced GSAP animations on mount
  useEffect(() => {
    // Clear previous timeline
    tl.current.clear();
    
    // Create master timeline
    tl.current = gsap.timeline({
      defaults: {
        ease: "expo.out",
        duration: 0.8
      }
    });

    // Header animation - smooth fade and slide
    tl.current.fromTo(headerRef.current,
      {
        y: -40,
        opacity: 0,
        scale: 0.98
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.2)"
      }
    );

    // Stats cards animation - elegant staggered entrance
    tl.current.fromTo('.stat-card',
      {
        y: 60,
        opacity: 0,
        rotationX: -15,
        scale: 0.85
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        scale: 1,
        duration: 0.6,
        stagger: {
          amount: 0.3,
          from: "random"
        },
        ease: "elastic.out(1, 0.5)"
      },
      "-=0.4"
    );

    // Controls bar animation - smooth slide with bounce
    tl.current.fromTo(controlsRef.current,
      {
        y: -50,
        opacity: 0,
        filter: "blur(5px)"
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out"
      },
      "-=0.3"
    );

    // Course cards animation - elegant cascading effect
    animateCourseCardsWithSmoothEffect();

    // Add floating animation to stats cards
    gsap.to('.stat-card', {
      y: -3,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: {
        amount: 1,
        from: "random"
      }
    });

    // Add subtle pulse to create button
    gsap.to('.create-button', {
      scale: 1.02,
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      repeatDelay: 1
    });

    return () => {
      tl.current.kill();
      gsap.killTweensOf('.stat-card');
      gsap.killTweensOf('.create-button');
    };
  }, []);

  // Enhanced course cards animation with smooth effects
  const animateCourseCardsWithSmoothEffect = () => {
    const cards = gsap.utils.toArray('.course-card');
    
    cards.forEach((card, index) => {
      // Reset card position
      gsap.set(card, {
        opacity: 0,
        y: 50,
        rotationY: 10,
        scale: 0.9
      });

      // Create staggered entrance with smooth easing
      gsap.to(card, {
        opacity: 1,
        y: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.05,
        ease: "back.out(1.7)",
        onComplete: () => {
          // Add sophisticated hover effects
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -8,
              scale: 1.03,
              rotationY: -2,
              duration: 0.4,
              ease: "power2.out",
              overwrite: true
            });
            
            // Elevate shadow
            gsap.to(card, {
              boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.05)",
              duration: 0.4
            });
            
            // Animate thumbnail
            const img = card.querySelector('img');
            if (img) {
              gsap.to(img, {
                scale: 1.1,
                duration: 0.6,
                ease: "power2.out"
              });
            }
          });
          
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.5)",
              overwrite: true
            });
            
            // Reset shadow
            gsap.to(card, {
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              duration: 0.5
            });
            
            // Reset thumbnail
            const img = card.querySelector('img');
            if (img) {
              gsap.to(img, {
                scale: 1,
                duration: 0.6,
                ease: "power2.out"
              });
            }
          });
        }
      });
    });
  };

  // Enhanced modal animation
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Create modal timeline
      const modalTl = gsap.timeline();
      
      // Animate backdrop
      modalTl.to('.modal-backdrop', {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Animate modal with 3D effect
      modalTl.fromTo(modalRef.current,
        {
          scale: 0.7,
          opacity: 0,
          y: 100,
          rotationX: 15,
          transformPerspective: 1000
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "back.out(1.4)",
          onComplete: () => {
            // Add subtle floating animation to modal
            gsap.to(modalRef.current, {
              y: -2,
              duration: 3,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1
            });
          }
        },
        "-=0.2"
      );
      
      // Animate form elements with stagger
      modalTl.fromTo('.modal-input',
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out"
        },
        "-=0.4"
      );
    } else if (modalRef.current) {
      // Restore body scroll
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  // Enhanced search/filter animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      
      // Create smooth transition animation
      const cards = gsap.utils.toArray('.course-card');
      
      // Animate cards out
      gsap.to(cards, {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.3,
        stagger: 0.02,
        ease: "power2.in",
        onComplete: () => {
          // After cards disappear, animate new ones in
          setTimeout(() => {
            animateCourseCardsWithSmoothEffect();
          }, 100);
        }
      });
      
      // Animate active filters
      gsap.fromTo('.filter-tag',
        {
          scale: 0.8,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "back.out(1.2)"
        }
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedTags, selectedStatus, minPrice, maxPrice]);

  // Enhanced form input animations
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Animate input focus
    if (e.target.classList.contains('modal-input')) {
      gsap.to(e.target, {
        scale: 1.02,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    }
  };

  // Enhanced tag toggle animation
  const handleTagToggle = (tag) => {
    const isAdding = !data.tags.includes(tag);
    setData(prev => ({
      ...prev,
      tags: isAdding
        ? [...prev.tags, tag]
        : prev.tags.filter(t => t !== tag)
    }));

    // Sophisticated tag animation
    const button = document.querySelector(`[data-tag="${tag}"]`);
    if (button) {
      if (isAdding) {
        // Add animation
        gsap.fromTo(button,
          {
            scale: 0.5,
            rotation: -180
          },
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
          }
        );
        
        // Particle effect
        gsap.fromTo(button.querySelector('.tag-icon'),
          {
            scale: 0,
            rotation: -360
          },
          {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "elastic.out(1, 0.5)"
          }
        );
      } else {
        // Remove animation
        gsap.to(button, {
          scale: 0.8,
          opacity: 0.7,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        });
      }
    }
  };

  // Enhanced file input animation
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      
      setData(prev => ({
        ...prev,
        thumbnailURL: file,
        thumbnailPreview: previewURL
      }));

      // Sophisticated file selection animation
      gsap.fromTo('.file-selected-indicator',
        {
          scale: 0,
          opacity: 0,
          y: -20
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.4)"
        }
      );
      
      // Animate the file input
      gsap.to(e.target, {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "#22c55e",
        duration: 0.3,
        yoyo: true,
        repeat: 1
      });
    }
  }; 

  // Enhanced create modal animation
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
    
    // Animate button click
    gsap.to('.create-button', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        setIsModalOpen(true);
      }
    });
  };

  // Enhanced edit modal animation
  const handleEdit = (course, e) => {
    // Elegant card click animation
    const card = e?.currentTarget.closest('.course-card');
    if (card) {
      gsap.to(card, {
        scale: 0.95,
        y: -5,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "elastic.out(1, 0.5)",
            onComplete: () => {
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
            }
          });
        }
      });
    } else {
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
    }
  };

  // Enhanced delete animation
  const handleDelete = async (id, e) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        // Sophisticated delete animation
        const card = e?.currentTarget.closest('.course-card');
        if (card) {
          // Shrink and fade animation
          gsap.to(card, {
            scale: 0.8,
            opacity: 0,
            rotation: -5,
            duration: 0.4,
            ease: "power2.in",
            onComplete: async () => {
              await deleteCourse(id).unwrap();
              toast.success('Course deleted successfully');
              refetch();
            }
          });
          
          // Particle effect simulation
          const particles = [];
          for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-2 h-2 bg-red-500 rounded-full';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            card.appendChild(particle);
            particles.push(particle);
            
            gsap.to(particle, {
              x: (Math.random() - 0.5) * 100,
              y: (Math.random() - 0.5) * 100,
              opacity: 0,
              scale: 0,
              duration: 0.6,
              ease: "power2.out"
            });
          }
        } else {
          await deleteCourse(id).unwrap();
          toast.success('Course deleted successfully');
          refetch();
        }
      } catch (error) {
        toast.error('Failed to delete course');
      }
    }
  };

  // Enhanced form submission with animation
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting form...');
    console.log('Is editing:', !!editingCourse);
    console.log('Form data:', data);

    try {
      const formData = new FormData();
      
      const payload = {
        title: data.title,
        description: data.description,
        instructorName: data.instructorName,
        price: Number(data.price),
        category: data.category,
        tags: data.tags,
        isPublished: data.isPublished,
      };
      
      formData.append("payload", JSON.stringify(payload));

      if (data.thumbnailURL instanceof File) {
        formData.append("thumbnailURL", data.thumbnailURL);
      }

      // Animate submit button
      const submitBtn = e.target.querySelector('button[type="submit"]');
      gsap.to(submitBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 2
      });

      let result;
      if (editingCourse) {
        console.log('Updating course with ID:', editingCourse._id);
        result = await updateCourse({ 
          courseId: editingCourse._id, 
          body: formData 
        }).unwrap();
        console.log('Update result:', result);
        // Success animation
        gsap.fromTo('.success-indicator',
          {
            scale: 0,
            rotation: -180
          },
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)"
          }
        );
        
        toast.success("Course updated successfully");
      } else {
        console.log('Creating new course');
        result = await createCourse(formData).unwrap();
        console.log('Create result:', result);
        // Success animation with confetti effect
        gsap.fromTo('.success-indicator',
          {
            scale: 0,
            y: -50
          },
          {
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.4)"
          }
        );
        
        toast.success("Course created successfully");
      }

      // Elegant modal close animation
      const modalTl = gsap.timeline();
      modalTl.to(modalRef.current, {
        scale: 0.9,
        opacity: 0.8,
        y: 20,
        duration: 0.3,
        ease: "power2.in"
      });
      
      modalTl.to('.modal-backdrop', {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
      
      modalTl.call(() => {
        setIsModalOpen(false);
        setEditingCourse(null);
        refetch();
      });

    } catch (error) {
      console.error("Submission error:", error);
      
      // Error animation
      gsap.fromTo('.modal-error',
        {
          scale: 0.5,
          opacity: 0,
          y: -10
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        }
      );
      
      if (error.data?.errorMessages) {
        error.data.errorMessages.forEach(err => toast.error(`${err.path}: ${err.message}`));
      } else {
        toast.error(error.data?.message || error.message || "Operation failed");
      }
    }
  };

  // Enhanced tag filter toggle animation
  const handleTagFilterToggle = (tag) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      
      const button = document.querySelector(`[data-filter-tag="${tag}"]`);
      if (button) {
        gsap.to(button, {
          scale: 0.9,
          rotation: prev.includes(tag) ? -180 : 180,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        });
      }
      
      return newTags;
    });
    setPage(1);
  };

  // Quiz modal helpers
  const openQuizModal = (courseId) => {
    setQuizCourseId(courseId);
    setQuizData({
      title: '',
      course: courseId,
      questions: [{ question: '', options: ['', ''], correctAnswerIndex: 0, explanation: '', marks: 1 }],
      durationMinutes: 30,
      totalMarks: 0,
      isPublished: false
    });
    gsap.to('.create-button', { scale: 0.95, duration: 0.08, yoyo: true, repeat: 1, onComplete: () => setIsQuizModalOpen(true) });
  };

  const closeQuizModal = () => {
    gsap.to('.modal-backdrop-quiz', {
      opacity: 0,
      duration: 0.25,
      onComplete: () => setIsQuizModalOpen(false)
    });
  };

  const handleQuizFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleQuestionChange = (qIndex, field, value) => {
    setQuizData(prev => {
      const questions = [...prev.questions];
      questions[qIndex] = { ...questions[qIndex], [field]: value };
      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', options: ['', ''], correctAnswerIndex: 0, explanation: '', marks: 1 }]
    }));
  };

  const removeQuestion = (index) => {
    setQuizData(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
  };

  const addOption = (qIndex) => {
    setQuizData(prev => {
      const questions = [...prev.questions];
      questions[qIndex].options = [...questions[qIndex].options, ''];
      return { ...prev, questions };
    });
  };

  const removeOption = (qIndex, oIndex) => {
    setQuizData(prev => {
      const questions = [...prev.questions];
      questions[qIndex].options = questions[qIndex].options.filter((_, i) => i !== oIndex);
      if (questions[qIndex].correctAnswerIndex >= questions[qIndex].options.length) {
        questions[qIndex].correctAnswerIndex = 0;
      }
      return { ...prev, questions };
    });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    setQuizData(prev => {
      const questions = [...prev.questions];
      questions[qIndex].options = questions[qIndex].options.map((opt, i) => i === oIndex ? value : opt);
      return { ...prev, questions };
    });
  };

  const setCorrectAnswer = (qIndex, index) => {
    setQuizData(prev => {
      const questions = [...prev.questions];
      questions[qIndex].correctAnswerIndex = index;
      return { ...prev, questions };
    });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    try {
      // compute total marks if not provided
      const total = quizData.questions.reduce((s, q) => s + (Number(q.marks) || 0), 0);
      const payload = {
        title: quizData.title,
        course: quizData.course || quizCourseId,
        questions: quizData.questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswerIndex: Number(q.correctAnswerIndex),
          explanation: q.explanation,
          marks: Number(q.marks) || 0
        })),
        durationMinutes: Number(quizData.durationMinutes) || 0,
        totalMarks: total,
        isPublished: !!quizData.isPublished
      };

      await createQuiz(payload).unwrap();
      toast.success('Quiz created successfully');
      setIsQuizModalOpen(false);
    } catch (err) {
      console.error('Quiz creation failed', err);
      toast.error(err?.data?.message || 'Failed to create quiz');
    }
  };

  // Enhanced clear filters animation
  const clearAllFilters = () => {
    // Elegant filter removal animation
    gsap.to('.filter-tag', {
      opacity: 0,
      x: -20,
      scale: 0.8,
      duration: 0.3,
      stagger: 0.03,
      ease: "power2.in",
      onComplete: () => {
        setSelectedCategory('');
        setSelectedTags([]);
        setSelectedStatus('');
        setMinPrice('');
        setMaxPrice('');
        setSearch('');
        setPage(1);
      }
    });
    
    // Reset animation for search input
    gsap.to('input[type="text"]', {
      borderColor: "#d1d5db",
      backgroundColor: "#ffffff",
      duration: 0.3
    });
  };

  // Loading state
  if (isLoading && page === 1) {
    return <CourseManagementSkeleton />;
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
      {/* Enhanced Header with animation */}
      <div ref={headerRef} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
        <p className="text-gray-600">Manage your courses with advanced filtering and search</p>
      </div>

      <div ref={statsRef}>
        <StatsCards stats={stats} />
      </div>

      <div ref={controlsRef}>
        <Controls
          search={search}
          setSearch={(v) => { setSearch(v); setPage(1); }}
          minPrice={minPrice}
          setMinPrice={(v) => { setMinPrice(v); setPage(1); }}
          maxPrice={maxPrice}
          setMaxPrice={(v) => { setMaxPrice(v); setPage(1); }}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={(v) => { setSelectedCategory(v); setPage(1); }}
          selectedStatus={selectedStatus}
          setSelectedStatus={(v) => { setSelectedStatus(v); setPage(1); }}
          allTags={allTags}
          selectedTags={selectedTags}
          handleTagFilterToggle={handleTagFilterToggle}
          onCreate={handleCreate}
        />
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || selectedTags.length > 0 || selectedStatus || minPrice || maxPrice || search) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {search && (
            <span className="filter-tag inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              Search: "{search}"
              <button onClick={() => setSearch('')} className="ml-1 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="filter-tag inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('')} className="ml-1 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedTags.map(tag => (
            <span key={tag} className="filter-tag inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              Tag: {tag}
              <button onClick={() => handleTagFilterToggle(tag)} className="ml-1 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedStatus && (
            <span className="filter-tag inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              Status: {selectedStatus}
              <button onClick={() => setSelectedStatus('')} className="ml-1 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="filter-tag inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
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

      {isQuizModalOpen && (
        <QuizModal
          quizData={quizData}
          setQuizData={setQuizData}
          handleQuizFieldChange={handleQuizFieldChange}
          handleQuestionChange={handleQuestionChange}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          addOption={addOption}
          removeOption={removeOption}
          handleOptionChange={handleOptionChange}
          setCorrectAnswer={setCorrectAnswer}
          handleQuizSubmit={handleQuizSubmit}
          isCreating={isCreatingQuiz}
          onCancel={closeQuizModal}
        />
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
            {courses.length > 0 ? courses.map((course, index) => (
              <div key={course._id} ref={el => courseCardsRef.current[index] = el}>
                <CourseCard
                  course={course}
                  onEdit={(c) => handleEdit(c)}
                  onDelete={(id) => handleDelete(id)}
                  onCreateQuiz={(id) => openQuizModal(id)}
                />
              </div>
            )) : (
              <div className="md:col-span-3 text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <button onClick={handleCreate} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-5 h-5" /> Create New Course
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
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

      {isModalOpen && (
        <CourseModal
          editingCourse={editingCourse}
          data={data}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleTagToggle={handleTagToggle}
          allTags={allTags}
          onCancel={() => { gsap.to(modalRef.current, { scale: 0.9, opacity: 0.8, y: 20, duration: 0.3, ease: 'power2.in', onComplete: () => setIsModalOpen(false) }); }}
          onSubmit={handleSubmit}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default CourseManagement;