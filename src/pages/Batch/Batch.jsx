import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Plus, Edit, Trash2, Users, Calendar, User, 
  Clock, ChevronRight, X, Search, Filter, GraduationCap,
  CheckCircle, AlertCircle, Loader2, Hash, BookOpen,
  Eye, Save, ChevronLeft, UserPlus, UserMinus
} from "lucide-react";
import Loading from "../../component/Loading/Loading";
import { useGetAllBatchesQuery } from "../../redux/features/batch/batchApi";

const Batch = () => {

    const { data: batch, isLoading, isError, error } = useGetAllBatchesQuery();
    console.log("api-batch", batch);


    // State management
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCapacity, setFilterCapacity] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        course: "",
        startDate: "",
        endDate: "",
        instructor: "",
        students: [],
        capacity: 20
    });

    // Refs for GSAP animations
    const modalRef = useRef(null);
    const cardRefs = useRef([]);
    const statsRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        if (batch?.data) {
            setBatches(batch.data);
        }
    }, [batch]);

    // Calculate batch statistics
    const calculateStats = () => {
        if (!batches.length) return { total: 0, active: 0, full: 0, avgCapacity: 0 };
        
        const now = new Date();
        const active = batches.filter(batch => 
            new Date(batch.startDate) <= now && new Date(batch.endDate) >= now
        ).length;
        
        const full = batches.filter(batch => 
            batch.enrollments?.length >= batch.capacity
        ).length;
        
        const avgCapacity = batches.length ? 
            Math.round(batches.reduce((sum, batch) => sum + (batch.enrollments?.length || 0), 0) / batches.length) : 0;
        
        return {
            total: batches.length,
            active,
            full,
            avgCapacity
        };
    };

    const stats = calculateStats();

    // GSAP Animations
    const animatePageElements = () => {
        // Clear previous animations
        gsap.killTweensOf('.animate-element');
        
        // Header animation
        gsap.fromTo(headerRef.current,
            { y: -30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" }
        );

        // Stats cards animation
        gsap.fromTo('.stat-card',
            { y: 40, opacity: 0, rotationX: -10 },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "elastic.out(1, 0.5)",
                onComplete: () => {
                    // Add floating animation
                    gsap.to('.stat-card', {
                        y: -3,
                        duration: 2,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                        stagger: 0.1
                    });
                }
            }
        );

        // Batch cards animation
        gsap.fromTo('.batch-card',
            {
                y: 60,
                opacity: 0,
                scale: 0.9,
                rotationY: 15
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                rotationY: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: "back.out(1.4)",
                onComplete: () => {
                    // Add hover animations
                    gsap.utils.toArray('.batch-card').forEach(card => {
                        card.addEventListener('mouseenter', () => {
                            gsap.to(card, {
                                y: -5,
                                scale: 1.02,
                                duration: 0.3,
                                ease: "power2.out"
                            });
                        });
                        
                        card.addEventListener('mouseleave', () => {
                            gsap.to(card, {
                                y: 0,
                                scale: 1,
                                duration: 0.4,
                                ease: "elastic.out(1, 0.5)"
                            });
                        });
                    });
                }
            }
        );
    };

    useEffect(() => {
        if (!isLoading && batches.length > 0) {
            animatePageElements();
        }
    }, [isLoading, batches]);

    // Modal animations
    useEffect(() => {
        if (isModalOpen && modalRef.current) {
            gsap.fromTo(modalRef.current,
                {
                    scale: 0.8,
                    opacity: 0,
                    y: 50,
                    rotationX: 10
                },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.6,
                    ease: "back.out(1.4)"
                }
            );
            
            // Backdrop animation
            gsap.to('.modal-backdrop', {
                opacity: 1,
                duration: 0.3
            });
        }
    }, [isModalOpen]);

    // Filter batches
    const filteredBatches = batches.filter(batch => {
        const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            batch.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            batch.course.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCapacity = !filterCapacity || 
            (filterCapacity === "full" && batch.enrollments.length >= batch.capacity) ||
            (filterCapacity === "available" && batch.enrollments.length < batch.capacity);
        
        return matchesSearch && matchesCapacity;
    });

    // Handle view details
    const handleViewDetails = (batch) => {
        setSelectedBatch(batch);
        setIsEditMode(false);
        setIsModalOpen(true);
        
        // Animate clicked card
        const card = document.querySelector(`[data-batch-id="${batch._id}"]`);
        if (card) {
            gsap.to(card, {
                scale: 0.95,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        }
    };

    // Handle edit
    const handleEdit = (batch) => {
        setSelectedBatch(batch);
        setIsEditMode(true);
        setFormData({
            name: batch.name,
            course: batch.course._id,
            startDate: batch.startDate.split('T')[0],
            endDate: batch.endDate.split('T')[0],
            instructor: batch.course.instructorName,
            students: batch.enrollments,
            capacity: batch.capacity
        });
        setIsModalOpen(true);
    };

    // Handle delete
    const handleDelete = (batchId) => {
        if (window.confirm('Are you sure you want to delete this batch?')) {
            // Simulate delete animation
            const card = document.querySelector(`[data-batch-id="${batchId}"]`);
            if (card) {
                gsap.to(card, {
                    opacity: 0,
                    scale: 0.8,
                    x: 100,
                    duration: 0.4,
                    ease: "power2.in",
                    onComplete: () => {
                        setBatches(prev => prev.filter(b => b._id !== batchId));
                    }
                });
            } else {
                setBatches(prev => prev.filter(b => b._id !== batchId));
            }
        }
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' ? parseInt(value) : value
        }));
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditMode) {
            // Update existing batch
            setBatches(prev => prev.map(b => 
                b._id === selectedBatch._id 
                    ? { 
                        ...b, 
                        name: formData.name,
                        course: { ...b.course, _id: formData.course, instructorName: formData.instructor },
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        capacity: formData.capacity 
                      }
                    : b
            ));
        } else {
            // Create new batch
            const newBatch = {
                _id: Date.now().toString(),
                name: formData.name,
                course: {
                    _id: formData.course,
                    title: `Course ${formData.course}`,
                    instructorName: formData.instructor,
                    thumbnailURL: ""
                },
                startDate: `${formData.startDate}T00:00:00.000Z`,
                endDate: `${formData.endDate}T00:00:00.000Z`,
                enrollments: [],
                capacity: formData.capacity,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            setBatches(prev => [...prev, newBatch]);
        }
        
        // Animate success
        gsap.fromTo('.success-indicator',
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }
        );
        
        handleCloseModal();
    };

    // Handle close modal
    const handleCloseModal = () => {
        gsap.to(modalRef.current, {
            scale: 0.8,
            opacity: 0,
            y: 50,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                setIsModalOpen(false);
                setSelectedBatch(null);
                setIsEditMode(false);
            }
        });
    };

    // Get batch status
    const getBatchStatus = (batch) => {
        const now = new Date();
        const start = new Date(batch.startDate);
        const end = new Date(batch.endDate);
        
        if (now < start) return "upcoming";
        if (now > end) return "completed";
        return "active";
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) return <Loading />;
    if (isError) return <div className="error-container">Error: {error?.message}</div>;

    return (
        <div className="batch-management p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div ref={headerRef} className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Batch Management
                        </h1>
                        <p className="text-gray-600">
                            Manage and track all your learning batches in one place
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setIsEditMode(false);
                            setFormData({
                                name: "",
                                course: "",
                                startDate: "",
                                endDate: "",
                                instructor: "",
                                students: [],
                                capacity: 20
                            });
                            setIsModalOpen(true);
                        }}
                        className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <span className="font-semibold">Create New Batch</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Batches", value: stats.total, icon: <Hash className="w-6 h-6" />, color: "from-blue-500 to-blue-600" },
                    { label: "Active Batches", value: stats.active, icon: <Users className="w-6 h-6" />, color: "from-green-500 to-emerald-600" },
                    { label: "Full Capacity", value: stats.full, icon: <AlertCircle className="w-6 h-6" />, color: "from-amber-500 to-orange-600" },
                    { label: "Avg. Students", value: stats.avgCapacity, icon: <User className="w-6 h-6" />, color: "from-purple-500 to-pink-600" }
                ].map((stat, index) => (
                    <div 
                        key={index}
                        className="stat-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                style={{ width: `${(stat.value / Math.max(...[stats.total, stats.active, stats.full, stats.avgCapacity])) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search batches by name, course, or instructor..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <select
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            value={filterCapacity}
                            onChange={(e) => setFilterCapacity(e.target.value)}
                        >
                            <option value="">All Capacity</option>
                            <option value="full">Full</option>
                            <option value="available">Available</option>
                        </select>
                        
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilterCapacity("");
                            }}
                            className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5" />
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Batches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredBatches.map((batch, index) => (
                    <div
                        key={batch._id}
                        data-batch-id={batch._id}
                        className="batch-card group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
                    >
                        {/* Header with gradient */}
                        <div className={`h-3 ${
                            getBatchStatus(batch) === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                            getBatchStatus(batch) === 'upcoming' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                            'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`} />
                        
                        <div className="p-6">
                            {/* Batch Info */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <GraduationCap className="w-5 h-5 text-blue-600" />
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            getBatchStatus(batch) === 'active' ? 'bg-green-100 text-green-800' :
                                            getBatchStatus(batch) === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {getBatchStatus(batch).toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{batch.name}</h3>
                                    <p className="text-gray-600 text-sm">{batch.course.title}</p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        <strong>Instructor:</strong> {batch.course.instructorName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        <strong>Students:</strong> {batch.enrollments?.length || 0} / {batch.capacity}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Capacity</span>
                                    <span>{Math.round((batch.enrollments?.length || 0) / batch.capacity * 100)}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${
                                            (batch.enrollments?.length || 0) >= batch.capacity 
                                                ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                                                : 'bg-gradient-to-r from-blue-500 to-purple-600'
                                        }`}
                                        style={{ width: `${Math.min((batch.enrollments?.length || 0) / batch.capacity * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleViewDetails(batch)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors group"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                                
                                <button
                                    onClick={() => handleEdit(batch)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                
                                <button
                                    onClick={() => handleDelete(batch._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredBatches.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                        <Search className="w-12 h-12 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No batches found</h3>
                    <p className="text-gray-600 mb-8">Try adjusting your search or create a new batch</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div
                        ref={modalRef}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {isEditMode ? 'Edit Batch' : selectedBatch ? 'Batch Details' : 'Create New Batch'}
                                    </h2>
                                    {selectedBatch && !isEditMode && (
                                        <p className="text-sm text-gray-600 mt-1">ID: {selectedBatch._id}</p>
                                    )}
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Batch Details or Form */}
                            {isEditMode || !selectedBatch ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Batch Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                                placeholder="Enter batch name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Course ID *
                                            </label>
                                            <input
                                                type="text"
                                                name="course"
                                                required
                                                value={formData.course}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                                placeholder="Enter course ID"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Capacity *
                                            </label>
                                            <input
                                                type="number"
                                                name="capacity"
                                                required
                                                min="1"
                                                value={formData.capacity}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Start Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                required
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                End Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                required
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Instructor Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="instructor"
                                                required
                                                value={formData.instructor}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                                placeholder="Enter instructor name"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                                        >
                                            <Save className="w-4 h-4" />
                                            {isEditMode ? 'Update Batch' : 'Create Batch'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* View Details */
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Batch Name</h3>
                                            <p className="text-lg font-semibold text-gray-900">{selectedBatch.name}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Course</h3>
                                            <p className="text-lg font-semibold text-gray-900">{selectedBatch.course.title}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Instructor</h3>
                                            <p className="text-lg font-semibold text-gray-900">{selectedBatch.course.instructorName}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                                            <p className={`text-lg font-semibold ${
                                                getBatchStatus(selectedBatch) === 'active' ? 'text-green-600' :
                                                getBatchStatus(selectedBatch) === 'upcoming' ? 'text-blue-600' :
                                                'text-gray-600'
                                            }`}>
                                                {getBatchStatus(selectedBatch).toUpperCase()}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {formatDate(selectedBatch.startDate)} - {formatDate(selectedBatch.endDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Capacity</h3>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {selectedBatch.enrollments?.length || 0} / {selectedBatch.capacity}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Students List */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrolled Students</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                                            {selectedBatch.enrollments?.map((enrollment, index) => (
                                                <div key={enrollment._id} className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{enrollment.user.name}</p>
                                                            <p className="text-sm text-gray-600">{enrollment.user.email}</p>
                                                        </div>
                                                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                            #{index + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => setIsEditMode(true)}
                                            className="flex items-center gap-2 px-5 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit Batch
                                        </button>
                                        <button
                                            onClick={handleCloseModal}
                                            className="px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Batch;