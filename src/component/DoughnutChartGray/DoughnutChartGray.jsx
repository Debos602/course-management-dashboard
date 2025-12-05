import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
} from "chart.js";

// Registering necessary Chart.js components
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale
);

const Utils = {
    numbers: ({ count, min, max }) => {
        return Array.from({ length: count }, () =>
            Math.floor(Math.random() * (max - min + 1) + min)
        );
    },
    rand: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
    CHART_COLORS: {
        gray: "#6c757d",
        lightGray: "#adb5bd",
        darkGray: "#495057",
        mediumGray: "#868e96",
        charcoal: "#343a40",
    },
};

const DoughnutChartUserActivity = () => {
    const DATA_COUNT = 5;
    const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

    // Example user activity data
    const activityData = {
        labels: [
            "View Profile",
            "Edit Profile",
            "Delete Account",
            "Change Email",
            "Change Password",
        ],
        datasets: [
            {
                label: "User Activity Count",
                data: Utils.numbers(NUMBER_CFG), // Simulated user count data for activities
                backgroundColor: [
                    Utils.CHART_COLORS.gray,
                    Utils.CHART_COLORS.lightGray,
                    Utils.CHART_COLORS.darkGray,
                    Utils.CHART_COLORS.mediumGray,
                    Utils.CHART_COLORS.charcoal,
                ],
                hoverBackgroundColor: [
                    Utils.CHART_COLORS.lightGray,
                    Utils.CHART_COLORS.darkGray,
                    Utils.CHART_COLORS.mediumGray,
                    Utils.CHART_COLORS.charcoal,
                    Utils.CHART_COLORS.gray,
                ],
                borderWidth: 0,
            },
        ],
    };

    const config = {
        type: "doughnut",
        data: activityData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false, // Hide the default legend
                },
                title: {
                    display: true,
                    text: "User Activity Count",
                    font: {
                        size: 18,
                        color: Utils.CHART_COLORS.charcoal,
                        weight: "bold",
                    },
                    padding: {
                        top: 10,
                        bottom: 20,
                    },
                },
            },
        },
    };

    return (
        <div className="flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-lg">
            {/* Chart */}
            <div className="relative w-[200px] h-[200px]">
                <Doughnut data={activityData} options={config.options} />
            </div>

            {/* Custom Legend as List */}
            <div className="mt-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Activity Breakdown
                </h3>
                <ul className="space-y-2">
                    {activityData.labels.map((label, index) => (
                        <li key={index} className="flex items-center">
                            <span
                                className="w-4 h-4 rounded-full mr-3"
                                style={{
                                    backgroundColor:
                                        activityData.datasets[0]
                                            .backgroundColor[index],
                                }}
                            ></span>
                            <span className="text-gray-700">{label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DoughnutChartUserActivity;
