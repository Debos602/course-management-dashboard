import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Dashbar from "../Dashbar/Dashbar";
import { useAppSelector } from "../../../redux/features/hook";
import { useEffect } from "react";

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAppSelector((s) => s.auth.user);
    const role = (user?.role || user?.Role || "").toString().toLowerCase();

    // If student lands on /dashboard root, redirect to /dashboard/student
    useEffect(() => {
        if (location.pathname === "/dashboard" && role === "student") {
            navigate("/dashboard/student", { replace: true });
        }
    }, [location.pathname, role, navigate]);

    return (
        <div className="flex wrap">
            <Sidebar />
            <div
                className=" w-[calc(100%-300px)] grow bg-gray-100 text-amber-950
        dark:bg-gray-900 dark:text-white"
            >
                <Dashbar />
                <main className="">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
