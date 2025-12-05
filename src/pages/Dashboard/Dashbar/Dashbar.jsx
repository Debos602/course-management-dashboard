import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CiSettings } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useAppDispatch, useAppSelector } from "../../../redux/features/hook";
import { logout } from "../../../redux/features/auth/authSlice";
import { toast } from "sonner";

const Dashbar = () => {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
    };
    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        navigate("/");
        toast.success("Logout successful!");
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setDropdownOpen(false);
        }
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setSearchOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <section className="sticky top-0 z-50 max-w-full mx-auto px-5 py-4 bg-gray-200 border-b dark:bg-gray-900">
            <div className="text-gray-950 text-[14px] md:text-[18px] flex justify-between items-center dark:text-amber-50">
                <h1 className="font-bold">Dashboard</h1>
                <div className="flex items-center gap-6">
                    <div className="relative" ref={searchRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className={`px-4 py-2 border rounded-full focus:outline-none transition-all duration-300 ${
                                    searchOpen
                                        ? "w-64 opacity-100"
                                        : "w-0 opacity-0"
                                } md:w-64 md:opacity-100 dark:bg-gray-700 dark:border-gray-600`}
                            />
                            <FaSearch
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer md:hidden dark:text-gray-300"
                                onClick={toggleSearch}
                            />
                        </div>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <div className="flex items-center gap-6">
                            <IoNotifications className="text-2xl cursor-pointer hover:text-blue-600 transition-colors dark:hover:text-blue-400" />
                            <div
                                className="cursor-pointer"
                                onClick={toggleDropdown}
                            >
                                <img
                                    src={`https://d1wh1xji6f82aw.cloudfront.net/${user.Avatar}`}
                                    alt="User Avatar"
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                        {dropdownOpen && (
                            <div className="absolute right-0 top-[55px] mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                                {/* User info section */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={`https://d1wh1xji6f82aw.cloudfront.net/${user.Avatar}`}
                                            alt="User Avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {user.name || "User"}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
                                                {user.email ||
                                                    "user@example.com"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dropdown items */}
                                <Link
                                    to="#"
                                    className="px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                                >
                                    <CgProfile className="text-lg text-blue-500" />
                                    <span>Profile</span>
                                </Link>
                                <Link
                                    to="#"
                                    className="px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                                >
                                    <CiSettings className="text-lg text-blue-500" />
                                    <span>Settings</span>
                                </Link>
                                <Link
                                    onClick={handleLogout}
                                    to="#"
                                    className="px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                                >
                                    <RiLogoutCircleRLine className="text-lg text-red-500" />
                                    <span>Logout</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashbar;
