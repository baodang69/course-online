import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Phân bố khóa học theo danh mục",
      },
    },
  };

  const colors = [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
  ];

  const chartData = {
    labels: data.map((item) => item.categoryName),
    datasets: [
      {
        data: data.map((item) => item.courseCount),
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  return <Pie options={options} data={chartData} />;
};

export default PieChart;
