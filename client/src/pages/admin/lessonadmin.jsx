// pages/admin/lessons.js
import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import CourseCardBlank from "../../components/ui/cardcourseblank";

const LessonAdmin = () => {
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học:", error);
    }
  };

  const handleSelectCourse = (courseId) => {
    navigate(`/admin/lessons/${courseId}`);
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Quản lý bài học</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {" "}
        {/* Điều chỉnh grid-cols */}
        {courses.map((course) => (
          <CourseCardBlank
            key={course._id}
            course={course}
            onSelect={handleSelectCourse}
          />
        ))}
      </div>
    </div>
  );
};

export default LessonAdmin;
