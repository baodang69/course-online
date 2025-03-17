import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import BarChart from "../../components/admin/analytics/BarChart";
import PieChart from "../../components/admin/analytics/PieChart";

const Dashboard = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/course"),
          axios.get("http://localhost:5000/api/enroll/count"),
          axios.get("http://localhost:5000/api/category"),
        ]);

        // Process enrollment data
        const courseEnrollments = coursesRes.data.map((course) => ({
          title: course.title,
          enrollmentCount:
            enrollmentRes.data.find((e) => e._id === course._id)?.count || 0,
        }));
        setEnrollmentData(courseEnrollments);

        // Process category data
        const categoryStats = categoriesRes.data.map((category) => ({
          categoryName: category.categoryName,
          courseCount: coursesRes.data.filter(
            (course) => course.categoryId?._id === category._id
          ).length,
        }));
        setCategoryData(categoryStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Thống kê sơ bộ</h1>
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-1">
            <h2 className="text-xl font-bold mb-4">
              Số lượng học viên theo khóa học
            </h2>
            <BarChart data={enrollmentData} />
          </div>
          <div className="col-span-1">
            <h2 className="text-xl font-bold mb-4">
              Phân bố khóa học theo danh mục
            </h2>
            <div className="w-1/2 mx-auto">
              <PieChart data={categoryData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
