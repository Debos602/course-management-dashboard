import { FaShoppingCart, FaTachometerAlt, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineSchool } from "react-icons/md";
import { useAppSelector } from "../../../redux/features/hook";
import { BathIcon } from "lucide-react";
import { MdQuiz } from "react-icons/md";
import { MdPlayLesson } from "react-icons/md";


const Sidebar = () => {
    const location = useLocation(); // Get current path

    const user = useAppSelector((s) => s.auth.user);
    const role = (user?.role || user?.Role || "").toString().toLowerCase();

    // Role-specific navigation
    const navLinks =
        role === "student"
            ? [
                  { to: "student", label: "My Courses", Icon: MdOutlineSchool },
                  { to: "course-management", label: "Course Management", Icon: FaShoppingCart },
              ]
            : [
                  { to: "", label: "Dashboard Overview", Icon: FaTachometerAlt },
                  { to: "course-management", label: "Course Management", Icon: FaShoppingCart },
                  { to: "batch", label: "Batch Management", Icon: BathIcon },
                  { to: "Quiz", label: "Quiz Management", Icon: MdQuiz },
                  { to: "Lessons", label: "Lessons Management", Icon: MdPlayLesson },
              ];

    return (
        <div className="bg-white text-brand-900 text-base w-16 md:min-w-[300px] border-r border-brand-100">
            <div className="sticky top-0 left-0">
                <div className="flex items-center justify-center h-16 md:h-24 bg-brand-600">
                    <Link to="/dashboard" className="flex items-center text-white">
                        <div className="p-1 rounded-md bg-white/10 mr-2">
                            <MdOutlineSchool size={40} className="mr-2" />
                        </div>
                        <span className="text-2xl font-bold hidden md:block">CourseManage</span>
                    </Link>
                </div>

                <ul className="flex flex-col mt-5 text-xl mx-1 md:px-4">
                    {navLinks.map(({ to, label, Icon }, idx) => {
                        const routePath = to ? `/dashboard/${to}` : "/dashboard";
                        const isActive = location.pathname === routePath;
                        return (
                            <li key={idx}>
                                <Link
                                    to={routePath}
                                    className={`relative flex items-center py-3 px-3 my-2 space-x-4 rounded cursor-pointer transition-colors group ${
                                        isActive
                                            ? "bg-brand-600 text-white shadow-lg"
                                            : "text-brand-800 hover:bg-brand-50 hover:text-brand-900"
                                    }`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {/* active left indicator */}
                                    {isActive && (
                                        <span className="absolute left-0 top-0 h-full w-1 bg-brand-700 rounded-r-md" />
                                    )}
                                    <Icon className={`${isActive ? "text-white" : "text-brand-600"} text-lg`} />
                                    <span className="hidden md:inline text-[16px] font-semibold">
                                        {label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
