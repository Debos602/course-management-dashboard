import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const MultiAxisLineChart = () => {
    const BRAND = {
        brand50: "#f0f9ff",
        brand100: "#e0f2fe",
        brand300: "#7dd3fc",
        brand500: "#0ea5e9",
        brand700: "#0369a1",
    };

    const data = {
        labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
        ],
        datasets: [
            {
                label: "Dataset 1",
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: BRAND.brand500,
                backgroundColor: "rgba(14,165,233,0.08)",
                pointBackgroundColor: BRAND.brand500,
                yAxisID: "y",
            },
            {
                label: "Dataset 2",
                data: [28, 48, 40, 19, 86, 27, 90],
                borderColor: BRAND.brand700,
                backgroundColor: "rgba(3,105,161,0.08)",
                pointBackgroundColor: BRAND.brand700,
                yAxisID: "y1",
            },
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: "index",
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: "Multi Axis Line Chart",
                color: BRAND.brand700,
                font: { weight: "600", size: 16 },
            },
        },
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
                ticks: { color: BRAND.brand700 },
                grid: { color: "rgba(14,165,233,0.08)" },
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                grid: {
                    drawOnChartArea: false,
                },
                ticks: { color: BRAND.brand700 },
            },
            x: { ticks: { color: BRAND.brand700 }, grid: { color: "transparent" } },
        },
    };
    return (
        <div className="bg-white p-4 rounded-md shadow-xl w-full">
            <div className="w-full h-56 sm:h-72">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default MultiAxisLineChart;
