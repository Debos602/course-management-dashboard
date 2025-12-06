export const mockCourses = [
  {
    id: "course-1",
    title: "Introduction to Programming",
    description: "Learn the fundamentals of programming using JavaScript.",
    enrolled: true,
    progress: 40, // percent
    lessons: [
      {
        id: "l1",
        title: "Variables & Types",
        video: "https://www.youtube.com/embed/8r2E4s0ZxAs",
        completed: true,
        assignment: { submitted: false },
        quiz: {
          questions: [
            {
              id: "q1",
              text: "Which keyword declares a variable in modern JavaScript?",
              options: ["var", "let", "define", "dim"],
              answerIndex: 1,
            },
            {
              id: "q2",
              text: "What is the type of `null` in JavaScript?",
              options: ["object", "null", "undefined", "number"],
              answerIndex: 0,
            },
          ],
        },
      },
      {
        id: "l2",
        title: "Functions",
        video: "https://www.youtube.com/embed/IsT0rCk0kXU",
        completed: false,
        assignment: { submitted: false },
        quiz: {
          questions: [
            {
              id: "q3",
              text: "How do you define a function?",
              options: ["func x() {}", "function x() {}", "def x() {}", "sub x() {}"],
              answerIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "course-2",
    title: "Web Development Basics",
    description: "Build simple web pages with HTML, CSS and JS.",
    enrolled: true,
    progress: 20,
    lessons: [
      {
        id: "l3",
        title: "HTML Basics",
        video: "https://www.youtube.com/embed/qz0aGYrrlhU",
        completed: false,
        assignment: { submitted: false },
        quiz: { questions: [] },
      },
    ],
  },
];
