import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaTachometerAlt } from "react-icons/fa";
import { MdOutlineSchool, MdQuiz, MdPlayLesson } from "react-icons/md";
import { BathIcon, ChevronDown, ChevronRight } from "lucide-react";
import { useAppSelector } from "../../../redux/features/hook";

const Sidebar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const user = useAppSelector((s) => s.auth.user);
  const role = (user?.role || user?.Role || "").toString().toLowerCase();

  const navLinks =
    role === "student"
      ? [
          { to: "student", label: "My Courses", Icon: MdOutlineSchool },
          { to: "all-courses", label: "All Courses", Icon: FaShoppingCart },
        ]
      : [
          { to: "", label: "Dashboard Overview", Icon: FaTachometerAlt },

          {
            to: "course-management",
            label: "Course Management",
            Icon: FaShoppingCart,
            // children: [
            //   { to: "create-lesson", label: "Create Lesson", Icon: MdPlayLesson },
            //   { to: "create-quiz", label: "Create Quiz", Icon: MdQuiz },
            // ],
          },

          { to: "batch", label: "Batch Management", Icon: BathIcon },
          { to: "Lessons", label: "Lessons Management", Icon: MdPlayLesson },
            { to: "Quiz", label: "Quiz Management", Icon: MdQuiz },
        ];

  return (
    <div className="bg-white text-brand-900 text-base w-16 md:min-w-[300px] border-r border-brand-100">
      <div className="sticky top-0 left-0">
        {/* LOGO */}
        <div className="flex items-center justify-center h-16 md:h-24 bg-brand-600">
          <Link to="/dashboard" className="flex items-center text-white">
            <div className="p-1 rounded-md bg-white/10 mr-2">
              <MdOutlineSchool size={36} />
            </div>
            <span className="text-2xl font-bold hidden md:block">
              CourseManage
            </span>
          </Link>
        </div>

        {/* NAV */}
        <ul className="flex flex-col mt-5 mx-1 md:px-4">
          {navLinks.map(({ to, label, Icon, children }, idx) => {
            const routePath = to ? `/dashboard/${to}` : "/dashboard";
            const isActive = location.pathname === routePath;

            const isChildActive = children?.some(
              (c) => location.pathname === `/dashboard/${c.to}`
            );

            const isOpen = openMenu === to || isChildActive;

            return (
              <li key={idx}>
                {/* PARENT */}
                <div

                  onClick={() =>
                    children ? setOpenMenu(isOpen ? null : to) : null
                  }
                >
                  <Link
                    to={routePath}
                    className={`flex items-center justify-between py-3 px-3 my-2 rounded transition-all ${
                      isActive || isChildActive
                        ? "bg-brand-600 text-white shadow-lg"
                        : "hover:bg-brand-50 text-brand-800"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <Icon className="text-lg" />
                      <span className="hidden md:inline text-[16px] font-semibold">
                        {label}
                      </span>
                    </div>

                    {children && (
                      <span className="hidden md:block">
                        {isOpen ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </span>
                    )}
                  </Link>
                </div>

                {/* CHILDREN */}
                {children && isOpen && (
                  <ul className="ml-10 mt-2 space-y-2">
                    {children.map((child, cIdx) => {
                      const childPath = `/dashboard/${child.to}`;
                      const childActive =
                        location.pathname === childPath;

                      return (
                        <li key={cIdx}>
                          <Link
                            to={childPath}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition ${
                              childActive
                                ? "bg-brand-100 text-brand-700 font-semibold"
                                : "hover:bg-brand-50"
                            }`}
                          >
                            <child.Icon size={16} />
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
