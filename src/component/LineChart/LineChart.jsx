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
                borderColor: "rgba(75, 75, 75, 1)", // Dark gray
                backgroundColor: "rgba(75, 75, 75, 0.5)", // Light gray
                yAxisID: "y",
            },
            {
                label: "Dataset 2",
                data: [28, 48, 40, 19, 86, 27, 90],
                borderColor: "rgba(169, 169, 169, 1)", // Dark gray
                backgroundColor: "rgba(169, 169, 169, 0.5)", // Light gray
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
            },
        },
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default MultiAxisLineChart;
