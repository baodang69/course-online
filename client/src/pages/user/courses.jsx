import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import Header from "../../components/ui/header";
import Footer from "../../components/ui/footer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [levels, setLevels] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollmentCounts, setEnrollmentCounts] = useState({}); // Thêm state mới
  const [coursesEnrollCount, setCoursesEnrollCount] = useState({}); // Thêm state mới
  const [categoryCourseCounts, setCategoryCourseCounts] = useState({}); // Thêm state mới
  const [showNewOnly, setShowNewOnly] = useState(false); // Thêm state mới

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          courseRes,
          enrollRes,
          categoryRes,
          levelRes,
          enrollmentCountRes,
        ] = await Promise.all([
          axios.get(`http://localhost:5000/api/course`),
          axios.get(`http://localhost:5000/api/enroll/check/${userId}`),
          axios.get(`http://localhost:5000/api/category`),
          axios.get(`http://localhost:5000/api/level`),
          axios.get(`http://localhost:5000/api/enroll/count`), // Thêm API call mới
        ]);

        // Tạo object chứa số lượng enroll cho mỗi course
        const courseCounts = {};
        enrollmentCountRes.data.forEach((item) => {
          courseCounts[item._id] = item.count;
        });

        // Tạo object chứa số lượng enroll cho từng khóa học
        const courseEnrollments = {};
        enrollmentCountRes.data.forEach((item) => {
          courseEnrollments[item._id] = item.count;
        });
        setCoursesEnrollCount(courseEnrollments);

        // Tính số lượng enrollment cho mỗi category
        const categoryCounts = {};
        courseRes.data.forEach((course) => {
          const categoryId = course.categoryId?._id;
          if (categoryId) {
            categoryCounts[categoryId] =
              (categoryCounts[categoryId] || 0) +
              (courseCounts[course._id] || 0);
          }
        });

        // Tính số lượng khóa học cho mỗi category
        const coursesPerCategory = {};
        courseRes.data.forEach((course) => {
          const categoryId = course.categoryId?._id;
          if (categoryId) {
            coursesPerCategory[categoryId] =
              (coursesPerCategory[categoryId] || 0) + 1;
          }
        });
        setCategoryCourseCounts(coursesPerCategory);

        // Sắp xếp courses theo số lượng enrollment
        const sortedCourses = courseRes.data.sort(
          (a, b) => (courseCounts[b._id] || 0) - (courseCounts[a._id] || 0)
        );

        setCourses(sortedCourses);
        setEnrolled(enrollRes.data.map((id) => String(id)));
        setCategories(categoryRes.data);
        setLevels(levelRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleFilterCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFilterLevel = (levelId) => {
    setSelectedLevels((prev) =>
      prev.includes(levelId)
        ? prev.filter((id) => id !== levelId)
        : [...prev, levelId]
    );
  };

  // Thêm hàm kiểm tra khóa học mới
  const isNewCourse = (createdAt) => {
    const courseDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - courseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 31;
  };

  const filteredCourses = courses.filter((course) => {
    const matchCategory =
      selectedCategories.length === 0 ||
      (course.categoryId &&
        course.categoryId._id &&
        selectedCategories.includes(course.categoryId._id.toString()));

    const matchLevel =
      selectedLevels.length === 0 ||
      (course.levelId &&
        selectedLevels.includes(course.levelId._id.toString()));

    const matchSearch =
      !searchTerm ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description &&
        course.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchNew = !showNewOnly || isNewCourse(course.createdAt);

    return matchCategory && matchLevel && matchSearch && matchNew;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4 grid grid-cols-4 gap-6 flex-grow">
        <aside className="col-span-1 border-r pr-4">
          <h2 className="font-bold text-xl mb-4">Category</h2>
          {/* Thêm filter New courses */}
          <div className="flex items-center justify-between mb-4 pr-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new-courses"
                checked={showNewOnly}
                onCheckedChange={setShowNewOnly}
              />
              <label
                htmlFor="new-courses"
                className="text-sm cursor-pointer flex items-center"
              >
                New Courses
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              </label>
            </div>
          </div>
          <Separator className="my-4" />
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between mb-2 pr-2"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={String(category._id)}
                  checked={selectedCategories.includes(String(category._id))}
                  onCheckedChange={() =>
                    handleFilterCategory(String(category._id))
                  }
                />
                <label
                  htmlFor={String(category._id)}
                  className="text-sm cursor-pointer"
                >
                  {category.categoryName}
                </label>
              </div>
              <div className="text-sm text-gray-500">
                <span className="mr-2">
                  ( {categoryCourseCounts[category._id] || 0} )
                </span>
              </div>
            </div>
          ))}

          <Separator className="my-4" />
          <h2 className="font-bold text-xl mb-4">Level</h2>
          {levels.map((level) => (
            <div key={level._id} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={level._id.toString()}
                checked={selectedLevels.includes(level._id.toString())}
                onCheckedChange={() => handleFilterLevel(level._id.toString())}
              />
              <label
                htmlFor={level._id.toString()}
                className="text-sm cursor-pointer"
              >
                {level.levelName}
              </label>
            </div>
          ))}
        </aside>

        <section className="col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">All Courses</h1>
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 rounded-full py-2 px-4 pl-10 border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <Card
                  key={course._id}
                  className={`flex p-4 transition-all duration-300 relative ${
                    enrolled.includes(String(course._id))
                      ? "bg-blue-50 border-blue-200 hover:shadow-blue-100" // Style cho khóa học đã đăng ký
                      : "bg-white hover:shadow-lg"
                  }`}
                >
                  {isNewCourse(course.createdAt) && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                  <Link
                    to={
                      enrolled.includes(String(course._id))
                        ? `/enrolled/${course._id}`
                        : `/courses/detail/${course._id}`
                    }
                    className="block w-40 flex-shrink-0"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className={`w-full h-24 object-cover rounded-lg transition-transform duration-300 hover:scale-105 ${
                        enrolled.includes(String(course._id))
                          ? "border-2 border-blue-300" // Thêm border cho ảnh khóa học đã đăng ký
                          : ""
                      }`}
                    />
                  </Link>
                  <CardContent className="ml-4 flex flex-col">
                    <div className="flex justify-between items-center">
                      <Link
                        to={
                          enrolled.includes(String(course._id))
                            ? `/enrolled/${course._id}`
                            : `/courses/detail/${course._id}`
                        }
                        className={`text-lg font-semibold transition-all duration-300 hover:underline ${
                          enrolled.includes(String(course._id))
                            ? "text-blue-600" // Màu chữ khác cho tiêu đề khóa học đã đăng ký
                            : "hover:text-blue-600"
                        }`}
                      >
                        {course.title}
                      </Link>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">
                        By: {course.instructor?.name}
                      </p>
                      <p className="text-sm text-gray-500 ml-36">
                        {coursesEnrollCount[course._id] || 0} học viên
                      </p>
                    </div>
                    <p className="text-lg font-bold mt-1">
                      {course.price === 0
                        ? "Miễn phí"
                        : `${course.price.toLocaleString()} VND`}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Không có khóa học nào.
              </p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Course;
