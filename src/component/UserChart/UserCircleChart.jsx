import PropTypes from "prop-types"; // Importing PropTypes
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

const UserCircleChart = ({ data, labels, title }) => {
    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"], // Customize colors
                hoverBackgroundColor: ["#66BB6A", "#FFB300", "#EF5350"],
                borderWidth: 0, // Removing the border
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 24,
                },
            },
        },
    };

    return (
        <div className="flex justify-center items-center">
            <div className="relative w-64 h-64">
                <Doughnut data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

// PropTypes validation
UserCircleChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number).isRequired, // Validating that 'data' is an array of numbers
    labels: PropTypes.arrayOf(PropTypes.string).isRequired, // Validating that 'labels' is an array of strings
    title: PropTypes.string.isRequired, // Validating that 'title' is a string
};

export default UserCircleChart;
