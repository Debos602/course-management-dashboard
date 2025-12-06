import { createBrowserRouter } from "react-router-dom";
import Users from "../pages/Users/Users";
import NotFound from "../pages/NotFound/NotFound";
import ErrorBoundary from "../pages/ErrorBoundary/ErrorBoundary";
import DashboardLayout from "../pages/Dashboard/Layout/DashboardLayout";
import DashboardOverview from "../pages/Dashboard/DashboarOverview/DashboardOverview";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";
import CoursePage from "../pages/Dashboard/CoursePage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ProtectedRoute from "./ProtectedRoute";
import Materials from "../pages/Materials/Materials";

export const router = createBrowserRouter([
    { path: "/", element: <Login /> }, // Login route
    { path: "/register", element: <Register /> },
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
            { path: "users", element: <Users /> },
            { path: "Materials", element: <Materials /> },
        ],
    },
    {
        path: "*", // Catch-all route for 404
        element: <NotFound />,
    },
]);
