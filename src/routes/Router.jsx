import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";
import ErrorBoundary from "../pages/ErrorBoundary/ErrorBoundary";
import DashboardLayout from "../pages/Dashboard/Layout/DashboardLayout";
import DashboardOverview from "../pages/Dashboard/DashboarOverview/DashboardOverview";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";
import CoursePage from "../pages/Dashboard/CoursePage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ProtectedRoute from "./ProtectedRoute";
import CourseManagement from "../pages/CourseManagement/CourseManagement";
import Batch from "../pages/Batch/Batch";
import Quiz from "../pages/Quiz/Quiz";
import Lessons from "../pages/Lessons/Lessons";
import AllCourses from "../pages/All-coures/AllCourses";
import CourseDetails from "../pages/CourseDetails/CourseDetails";


export const router = createBrowserRouter([
    { path: "/", element: <Login /> }, // Login route
    { path: "/register", element: <Register /> },
    { path: "/courses/:courseId", element: <CourseDetails /> },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute allowedRoles={["admin", "user", "student"]}>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />, // Error boundary for root
        children: [
            { index: true, element: <DashboardOverview /> },
            { path: "student", element: <StudentDashboard /> },
            { path: "course/:id", element: <CoursePage /> },
            { path: "batch", element: <Batch /> },
            { path: "course-management", element: <CourseManagement /> },
            { path: "Quiz", element: <Quiz /> },
            { path: "Lessons", element: <Lessons /> },
            { path: "all-courses", element: <AllCourses /> },
            { path: "course-details/:courseId", element: <CourseDetails /> }
           
        ],
    },
    {
        path: "*", // Catch-all route for 404
        element: <NotFound />,
    },
]);
