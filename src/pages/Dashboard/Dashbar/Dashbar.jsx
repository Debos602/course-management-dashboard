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
        <section className="sticky top-0 z-50 w-full mx-auto px-4 py-3 bg-gradient-to-r from-brand-50 to-white/60 border-b border-brand-100 backdrop-blur-sm">
            <div className="text-brand-900 text-[14px] md:text-[18px] flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-brand-600 rounded-md p-2 shadow-md">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                            <path d="M3 12h18M3 6h18M3 18h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="font-bold text-brand-800 text-lg md:text-xl">Dashboard</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative" ref={searchRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search courses, users..."
                                className={`px-4 py-2 rounded-full focus:outline-none transition-all duration-300 text-sm md:text-base shadow-sm ${
                                    searchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
                                } md:w-64 md:opacity-100 bg-brand-50 border border-brand-100 focus:ring-2 focus:ring-brand-300`}
                            />
                            <FaSearch
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-500 cursor-pointer md:hidden"
                                onClick={toggleSearch}
                            />
                        </div>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <IoNotifications className="text-2xl cursor-pointer text-brand-600 hover:text-brand-700 transition-colors" />
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-500 rounded-full shadow">3</span>
                            </div>
                            <div
                                className="cursor-pointer"
                                onClick={toggleDropdown}
                            >
                                {user?.Avatar ? (
                                    <img
                                        src={`https://d1wh1xji6f82aw.cloudfront.net/${user?.Avatar}`}
                                        alt={user?.name || "User avatar"}
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-white shadow-sm hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center ring-2 ring-white shadow-sm hover:scale-105 transition-transform">
                                        <CgProfile className="text-lg md:text-xl" aria-hidden="true" />
                                    </div>
                                )}
                            </div>
                        </div>
                        {dropdownOpen && (
                            <div className="absolute right-0 top-[55px] mt-2 w-72 bg-white ring-1 ring-brand-100 rounded-xl shadow-2xl overflow-hidden">
                                {/* User info section */}
                                <div className="px-4 py-3 border-b border-brand-50 bg-brand-50">
                                    <div className="flex items-center gap-3">
                                       {user?.Avatar ? (
                                    <img
                                        src={`https://d1wh1xji6f82aw.cloudfront.net/${user?.Avatar}`}
                                        alt={user?.name || "User avatar"}
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-white shadow-sm hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center ring-2 ring-white shadow-sm hover:scale-105 transition-transform">
                                        <CgProfile className="text-lg md:text-xl" aria-hidden="true" />
                                    </div>
                                )}
                                        <div>
                                            <p className="font-medium text-brand-900">
                                                {user?.name || user?.Username || "User"}
                                            </p>
                                            <p className="text-sm text-brand-600 truncate">
                                                {user?.email || "user@example.com"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dropdown items */}
                                <Link
                                    to="#"
                                    className="px-4 py-3 text-brand-800 hover:bg-brand-50 flex items-center gap-3 transition-colors"
                                >
                                    <CgProfile className="text-lg text-brand-600" />
                                    <span>Profile</span>
                                </Link>
                                <Link
                                    to="#"
                                    className="px-4 py-3 text-brand-800 hover:bg-brand-50 flex items-center gap-3 transition-colors"
                                >
                                    <CiSettings className="text-lg text-brand-600" />
                                    <span>Settings</span>
                                </Link>
                                <Link
                                    onClick={handleLogout}
                                    to="#"
                                    className="px-4 py-3 text-brand-800 hover:bg-brand-50 flex items-center gap-3 transition-colors"
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
