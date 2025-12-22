import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import {
    useGetQuizzesQuery,
    useUpdateQuizMutation,
    useDeleteQuizMutation,
} from "../../redux/features/quize/quizeApi";
import { QuizSkeleton } from "../../component/skeleton/QuizSkeleton";

export default function Quiz() {
    const { data: quizzesResponse, isLoading, isError, refetch } = useGetQuizzesQuery();
    const quizzes = quizzesResponse?.data || [];
    const [updateQuiz] = useUpdateQuizMutation();
    const [deleteQuiz] = useDeleteQuizMutation();

    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        questions: [],
        durationMinutes: 30,
        isPublished: false,
    });

    const modalRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        if (editing) {
            setForm({
                title: editing.title || "",
                description: editing.description || "",
                questions: editing.questions || [],
                durationMinutes: editing.durationMinutes || 30,
                isPublished: editing.isPublished || false,
            });
            gsap.fromTo(
                modalRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
            );
        }
    }, [editing]);

    useEffect(() => {
        if (!isLoading && quizzes.length > 0 && listRef.current) {
            gsap.from(listRef.current.children, {
                opacity: 1,
                // x: -30,
                stagger: 0.1,
                duration: 0.2,
                ease: "power3.out",
            });
        }
    }, [quizzes, isLoading]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    };

    const updateQuestion = (index, field, value) => {
        setForm((s) => {
            const questions = [...s.questions];
            questions[index] = { ...questions[index], [field]: value };
            return { ...s, questions };
        });
    };

    const updateOption = (qIndex, oIndex, value) => {
        setForm((s) => {
            const questions = [...s.questions];
            const options = [...questions[qIndex].options];
            options[oIndex] = value;
            questions[qIndex] = { ...questions[qIndex], options };
            return { ...s, questions };
        });
    };

    const addQuestion = () => {
        setForm((s) => ({
            ...s,
            questions: [
                ...s.questions,
                {
                    question: "",
                    options: [],
                    correctAnswerIndex: 0,
                    explanation: "",
                    marks: 0,
                },
            ],
        }));
    };

    const removeQuestion = (index) => {
        setForm((s) => {
            const questions = [...s.questions];
            questions.splice(index, 1);
            return { ...s, questions };
        });
    };

    const addOption = (qIndex) => {
        setForm((s) => {
            const questions = [...s.questions];
            const options = [...questions[qIndex].options, ""];
            questions[qIndex] = { ...questions[qIndex], options };
            return { ...s, questions };
        });
    };

    const removeOption = (qIndex, oIndex) => {
        setForm((s) => {
            const questions = [...s.questions];
            const options = [...questions[qIndex].options];
            options.splice(oIndex, 1);
            // Adjust correctAnswerIndex if necessary
            let correct = questions[qIndex].correctAnswerIndex;
            if (correct >= options.length) {
                correct = 0;
            }
            questions[qIndex] = { ...questions[qIndex], options, correctAnswerIndex: correct };
            return { ...s, questions };
        });
    };

    const calculateTotalMarks = (questions) => {
        return questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalMarks = calculateTotalMarks(form.questions);
        const payload = {
            title: form.title,
            description: form.description,
            questions: form.questions,
            durationMinutes: Number(form.durationMinutes),
            totalMarks,
            isPublished: form.isPublished,
        };

        try {
            await updateQuiz({ id: editing.id, ...payload }).unwrap();
            setEditing(null);
            refetch();
        } catch (err) {
            console.error(err);
            alert("Failed to save quiz");
        }
    };

    const handleEdit = (q) => {
        const id = q._id || q.id;
        setEditing({ ...q, id });
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this quiz?")) return;
        try {
            await deleteQuiz(id).unwrap();
            refetch();
        } catch (err) {
            console.error(err);
            alert("Failed to delete");
        }
    };

    const closeModal = () => {
        gsap.to(modalRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.4,
            ease: "back.in(1.7)",
            onComplete: () => setEditing(null),
        });
    };

    if (isLoading) {
        return <QuizSkeleton />;
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-extrabold mb-6 text-black tracking-wide">Quiz Management</h1>

            <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Quizzes</h2>
                {isError && <div className="text-red-600">Failed to load quizzes</div>}
                {quizzes.length === 0 && <div className="text-cyan-600">No quizzes found</div>}
                <ul ref={listRef} className="space-y-4">
                    {quizzes.map((q) => {
                        const id = q._id || q.id;
                        return (
                            <li key={id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-start hover:bg-cyan-50 transition duration-200">
                                <div>
                                    <div className="font-semibold text-cyan-800">{q.title}</div>
                                    <div className="text-sm text-gray-600">{q.description}</div>
                                </div>
                                <div className="space-x-3">
                                    <button onClick={() => handleEdit(q)} className="text-sm px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition">Edit</button>
                                    <button onClick={() => handleDelete(id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Delete</button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div ref={modalRef} className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto relative border border-cyan-300">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-cyan-800">Edit Quiz</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-black-900">Title</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full border border-cyan-300 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black-900">Description</label>
                                <input
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full border border-cyan-300 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black-900">Duration (minutes)</label>
                                <input
                                    name="durationMinutes"
                                    type="number"
                                    value={form.durationMinutes}
                                    onChange={handleChange}
                                    className="w-full border border-cyan-300 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    name="isPublished"
                                    type="checkbox"
                                    checked={form.isPublished}
                                    onChange={handleChange}
                                    className="mr-2 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                />
                                <label className="text-sm font-medium text-black-900">Published</label>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-black-900">Questions</h3>
                                {form.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="p-5 border border-cyan-200 rounded-lg mb-5 space-y-4 bg-cyan-50">
                                        <div>
                                            <label className="block text-sm text-black-900">Question Text</label>
                                            <input
                                                value={q.question}
                                                onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                                                className="w-full border border-cyan-300 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-black-900">Options</label>
                                            {q.options.map((opt, oIndex) => (
                                                <div key={oIndex} className="flex items-center mb-3">
                                                    <input
                                                        value={opt}
                                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                        className="flex-1 border border-cyan-300 px-3 py-2 rounded-md mr-3 text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                        placeholder={`Option ${oIndex + 1}`}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOption(qIndex, oIndex)}
                                                        className="text-sm px-3 py-1 bg-red-400 text-white rounded-md hover:bg-red-500 transition"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addOption(qIndex)}
                                                className="text-sm px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                            >
                                                Add Option
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-black-900">Correct Answer Index</label>
                                            <select
                                                value={q.correctAnswerIndex}
                                                onChange={(e) =>
                                                    updateQuestion(qIndex, "correctAnswerIndex", parseInt(e.target.value))
                                                }
                                                className="w-full border border-cyan-300 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                            >
                                                {q.options.map((_, oIndex) => (
                                                    <option key={oIndex} value={oIndex}>
                                                        {oIndex + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-black-900">Explanation</label>
                                            <textarea
                                                value={q.explanation}
                                                onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                                                className="w-full border border-cyan-300 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-black-900">Marks</label>
                                            <input
                                                type="number"
                                                value={q.marks}
                                                onChange={(e) => updateQuestion(qIndex, "marks", Number(e.target.value))}
                                                className="w-full border border-cyan-300 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                min="0"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(qIndex)}
                                            className="text-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                        >
                                            Remove Question
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="text-sm px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition"
                                >
                                    Add Question
                                </button>
                            </div>
                            <div className="text-sm text-cyan-800 font-medium">
                                Total Marks: {calculateTotalMarks(form.questions)}
                            </div>
                            <div className="flex space-x-3">
                                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}