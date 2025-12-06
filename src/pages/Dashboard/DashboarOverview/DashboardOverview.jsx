import { useState, useEffect, useRef } from "react";
import MultiAxisLineChart from "../../../component/LineChart/LineChart";
import DoughnutChartGray from "../../../component/DoughnutChartGray/DoughnutChartGray";
import { useAppSelector } from "../../../redux/features/hook";
import { gsap } from "gsap";

const DashboardOverview = () => {
    const user = useAppSelector((state) => state.auth.user); // Custom hook to get user data
    console.log(user); // Log user data for debugging
    const headerRef = useRef(null); // Ref for header
    const quickActionsRef = useRef([]); // Ref for quick action cards
    const chartRef = useRef(null); // Ref for chart section
    const tableRef = useRef(null); // Ref for table

    const [quickActions, setQuickActions] = useState([
        {
            title: "My Tasks",
            description: "View and manage your tasks",
            color: "blue",
            data: [],
        },
        {
            title: "Upcoming Events",
            description: "Check your upcoming events",
            color: "green",
            data: [],
        },
        {
            title: "Notifications",
            description: "View new notifications",
            color: "purple",
            data: [],
        },
        {
            title: "Support",
            description: "Contact support or view FAQs",
            color: "red",
            data: [],
        },
    ]);

    // Static country data
    const userCountryData = [
        { country: "USA", population: 331002651, gdp: 21427700 },
        { country: "China", population: 1439323776, gdp: 14722731 },
        { country: "Japan", population: 126476461, gdp: 5081770 },
        { country: "Germany", population: 83783942, gdp: 3845630 },
        { country: "India", population: 1380004385, gdp: 2875142 },
    ];

    useEffect(() => {
        setQuickActions([
            {
                title: "My Tasks",
                description: "5 pending tasks",
                color: "blue",
                data: ["Task A", "Task B"],
            },
            {
                title: "Upcoming Events",
                description: "3 upcoming events",
                color: "green",
                data: ["Meeting", "Conference"],
            },
            {
                title: "Notifications",
                description: "2 new notifications",
                color: "purple",
                data: ["Reminder", "New Message"],
            },
            {
                title: "Support",
                description: "Help center available",
                color: "red",
                data: [],
            },
        ]);
    }, []);

    // map color keys to bluish Tailwind utility classes
    const colorMap = {
        blue: { text: "text-brand-700", dot: "bg-brand-100", highlight: "bg-brand-50" },
        green: { text: "text-brand-700", dot: "bg-brand-100", highlight: "bg-brand-50" },
        purple: { text: "text-brand-700", dot: "bg-brand-100", highlight: "bg-brand-50" },
        red: { text: "text-brand-600", dot: "bg-brand-50", highlight: "bg-brand-50" },
    };

    useEffect(() => {
        // Header Animation: Fade in and slide from left
        gsap.fromTo(
            headerRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
        );

        // Quick Actions Animation: Staggered fade-in and scale
        gsap.fromTo(
            quickActionsRef.current,
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)",
            }
        );

        // Chart Animation: Fade in and slide from bottom
        gsap.fromTo(
            chartRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 }
        );

        // Table Animation: Fade in with row stagger
        gsap.fromTo(
            tableRef.current.querySelectorAll("tr"),
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                delay: 1,
            }
        );
    }, []);

    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
            {/* Header Section */}
            <div
                ref={headerRef}
                className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white shadow-md p-4 rounded-md border-l-4 border-brand-600"
            >
                <div className="text-2xl font-semibold text-brand-900">
                    Welcome, {user?.Username || user?.username || "User"}!
                </div>
            </div>

            {/* Quick Actions and Charts */}
            <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
                <div className="md:col-span-6 col-span-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action, index) => (
                            <div
                                key={index}
                                ref={(el) => (quickActionsRef.current[index] = el)}
                                className="bg-white p-4 rounded-md shadow hover:shadow-lg cursor-pointer flex items-start gap-3"
                                role="button"
                                tabIndex={0}
                            >
                                <div
                                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                        colorMap[action.color]?.dot || "bg-brand-100"
                                    }`}
                                >
                                    <span className={colorMap[action.color]?.text || "text-brand-600"}>
                                        •
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className={`text-lg font-semibold ${colorMap[action.color]?.text || "text-brand-600"}`}>
                                        {action.title}
                                    </div>
                                    <div className="text-gray-500 text-sm">{action.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <div ref={chartRef} className="bg-white p-4 rounded-md shadow-xl mt-6">
                        <MultiAxisLineChart />
                    </div>
                </div>

                <div className="md:col-span-2 col-span-1">
                    <div className="bg-white rounded-md shadow-xl p-4">
                        <DoughnutChartGray />
                    </div>
                </div>
            </div>

            {/* Country Data Table */}
            <div
                ref={tableRef}
                className="bg-white p-6 rounded-md shadow-md mt-8"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Country Data
                </h2>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                                Country
                            </th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                                Population
                            </th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                                GDP (USD)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {userCountryData.map((data, index) => (
                            <tr
                                key={index}
                                className={
                                    data.country === user.country
                                        ? "bg-brand-50"
                                        : ""
                                }
                            >
                                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                                    {data.country}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                                    {data.population.toLocaleString()}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                                    ${data.gdp.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardOverview;
