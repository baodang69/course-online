// pages/admin/lessons.js
import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import CourseCardBlank from "../../components/ui/cardcourseblank";
import { Input } from "@/components/ui/input"; // Import Input component

const LessonAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state searchTerm

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

  const filteredCourses = courses.filter((course) => {
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");
      return (
        searchRegex.test(course.title) || searchRegex.test(course.description)
      );
    }
    return true; // Nếu searchTerm rỗng, trả về tất cả khóa học
  });

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Quản lý bài học</h2>
      <Input // Thêm input tìm kiếm
        type="text"
        placeholder="Tìm kiếm khóa học..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCourses.map(
          (
            course // Hiển thị filteredCourses
          ) => (
            <CourseCardBlank
              key={course._id}
              course={course}
              onSelect={handleSelectCourse}
            />
          )
        )}
      </div>
    </div>
  );
};

export default LessonAdmin;
