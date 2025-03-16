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
  const [enrollmentCounts, setEnrollmentCounts] = useState({});

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

        setCourses(courseRes.data);
        setEnrolled(enrollRes.data.map((id) => String(id)));
        setCategories(categoryRes.data);
        setLevels(levelRes.data);

        // Chuyển đổi mảng count thành object để dễ truy cập
        const countsObj = {};
        enrollmentCountRes.data.forEach((item) => {
          countsObj[item._id] = item.count;
        });
        setEnrollmentCounts(countsObj);
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
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

    return matchCategory && matchLevel && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4 grid grid-cols-4 gap-6 flex-grow">
        <aside className="col-span-1 border-r pr-4">
          <h2 className="font-bold text-xl mb-4">Category</h2>
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center space-x-2 mb-2"
            >
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
                <Card key={course._id} className="flex p-4">
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
                      className="w-full h-24 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </Link>
                  <CardContent className="ml-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <Link
                        to={
                          enrolled.includes(String(course._id))
                            ? `/enrolled/${course._id}`
                            : `/courses/detail/${course._id}`
                        }
                        className="text-lg font-semibold transition-all duration-300 hover:underline hover:text-blue-600"
                      >
                        {course.title}
                      </Link>
                      <p className="text-sm text-gray-500">
                        By: {course.instructor?.name}
                      </p>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                      <p className="text-lg font-bold">
                        {course.price === 0
                          ? "Miễn phí"
                          : `${course.price.toLocaleString()} VND`}
                      </p>
                      <p className="text-sm text-gray-600 ml-auto">
                        {enrollmentCounts[course._id] || 0} học viên đã tham gia
                      </p>
                    </div>
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
