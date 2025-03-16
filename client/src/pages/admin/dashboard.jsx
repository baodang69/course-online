import React, { useState, useEffect } from "react";
import axios from "../../lib/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/users");
        setUserCount(userRes.data.length);

        const courseRes = await axios.get("http://localhost:5000/api/course");
        setCourseCount(courseRes.data.length);
        setCourses(courseRes.data);

        const enrollRes = await axios.get("http://localhost:5000/api/enroll");
        const enrollmentCounts = {};
        enrollRes.data.forEach((enrollment) => {
          const courseId = enrollment.course;
          if (enrollmentCounts[courseId]) {
            enrollmentCounts[courseId]++;
          } else {
            enrollmentCounts[courseId] = 1;
          }
        });

        const enrollmentData = Object.keys(enrollmentCounts).map(
          (courseId) => ({
            course: courseId,
            count: enrollmentCounts[courseId],
          })
        );
        setEnrollmentData(enrollmentData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: enrollmentData.map((item) => {
      console.log("enrollmentData:", enrollmentData);
      if (item.course) {
        const course = courses.find(
          (c) => c._id.toString() === item.course.toString()
        );
        return course
          ? course.title
          : `Khóa học không tồn tại (${item.course})`;
      } else {
        return "Khóa học không tồn tại";
      }
    }),
    datasets: [
      {
        label: "Số lượng đăng ký",
        data: enrollmentData.map((item) => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Số lượng đăng ký khóa học",
      },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: Math.round,
        font: {
          weight: "bold",
        },
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Tổng số người dùng</h2>
          <p className="text-3xl font-bold">{userCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Tổng số khóa học</h2>
          <p className="text-3xl font-bold">{courseCount}</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-4 rounded shadow">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
