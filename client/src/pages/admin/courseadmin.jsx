import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "../../lib/axios";
import CourseCard from "../../components/ui/cardcourse";
import CourseDialog from "../../components/ui/dialogcourse";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input"; // Import Input

const CourseAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State cho tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // State cho kết quả tìm kiếm
  const [editedCourse, setEditedCourse] = useState({
    title: "",
    image: "",
    description: "",
    categoryId: "",
    levelId: "",
    price: "",
    status: "draft",
    objectives: [],
  });

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, categoryRes, levelRes] = await Promise.all([
          axios.get("http://localhost:5000/api/course"),
          axios.get("http://localhost:5000/api/category"),
          axios.get("http://localhost:5000/api/level"),
        ]);
        setCourses(courseRes.data);
        setCategories(categoryRes.data);
        setLevels(levelRes.data);
        // Lọc kết quả tìm kiếm
        if (searchTerm) {
          const filteredCourses = courseRes.data.filter((course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSearchResults(filteredCourses);
        } else {
          setSearchResults(courseRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
      }
    };
    fetchData();
  }, [searchTerm]); // Thêm searchTerm vào dependency array

  const handleDelete = async (courseId) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/course/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error.response || error.message);
    }
  };

  const handleEditClick = (course, readOnly = false) => {
    setSelectedCourse(course);
    setEditedCourse({
      ...course,
      // Đảm bảo lấy _id từ categoryId và levelId object
      categoryId: course.categoryId?._id || course.categoryId,
      levelId: course.levelId?._id || course.levelId,
      objectives: course.objectives || [],
    });
    setIsReadOnly(readOnly);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    if (e.target.name === "searchTerm") {
      setSearchTerm(e.target.value); // Cập nhật searchTerm
    } else {
      setEditedCourse({ ...editedCourse, [e.target.name]: e.target.value });
    }
  };

  const handleAddObjective = () => {
    setEditedCourse((prevCourse) => ({
      ...prevCourse,
      objectives: [...(prevCourse.objectives || []), ""], // Tạo bản sao mới
    }));
  };

  const handleRemoveObjective = (index) => {
    const newObjectives = [...editedCourse.objectives];
    newObjectives.splice(index, 1);
    setEditedCourse({ ...editedCourse, objectives: newObjectives });
  };

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...editedCourse.objectives];
    newObjectives[index] = value;
    setEditedCourse({ ...editedCourse, objectives: newObjectives });
  };

  const handleUpdateCourse = async () => {
    try {
      const formData = new FormData();

      // Log data being sent
      console.log("Course data being sent:", editedCourse);

      // Append all required fields
      formData.append("title", editedCourse.title);
      formData.append("description", editedCourse.description);
      formData.append("price", editedCourse.price || 0);
      formData.append("status", editedCourse.status || "draft");
      formData.append("instructor", user._id); // Add instructor ID always

      // Optional fields
      if (editedCourse.categoryId) {
        formData.append("categoryId", editedCourse.categoryId);
      }
      if (editedCourse.levelId) {
        formData.append("levelId", editedCourse.levelId);
      }
      if (editedCourse.objectives?.length > 0) {
        formData.append("objectives", JSON.stringify(editedCourse.objectives));
      }
      if (editedCourse.image instanceof File) {
        formData.append("image", editedCourse.image);
      }

      // Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      let response;
      if (selectedCourse?._id) {
        response = await axios.put(
          `http://localhost:5000/api/course/${selectedCourse._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/course",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      console.log("Server response:", response.data);

      // Update local state
      setCourses((prevCourses) => {
        if (selectedCourse?._id) {
          return prevCourses.map((course) =>
            course._id === selectedCourse._id ? response.data : course
          );
        }
        return [...prevCourses, response.data];
      });

      setIsDialogOpen(false);
      setSelectedCourse(null);
      setEditedCourse({
        title: "",
        image: "",
        description: "",
        categoryId: "",
        levelId: "",
        price: "",
        status: "draft",
        objectives: [],
      });
    } catch (error) {
      console.error("Error details:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      toast.error("Có lỗi xảy ra khi lưu khóa học");
    }
  };

  // Thêm xử lý file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedCourse((prev) => ({
        ...prev,
        image: file, // Save the file directly instead of URL
      }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {" "}
      {/* Thêm background trắng */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
        <Button onClick={() => handleEditClick({}, false)}>Thêm mới</Button>
      </div>
      {/* Cải thiện input tìm kiếm */}
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          className="pl-10 border rounded-md shadow-sm"
          name="searchTerm"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {searchResults.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onRead={(course) => handleEditClick(course, true)}
          />
        ))}
      </div>
      <CourseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isReadOnly={isReadOnly}
        editedCourse={editedCourse}
        categories={categories}
        levels={levels}
        onInputChange={handleInputChange}
        onAddObjective={handleAddObjective}
        onRemoveObjective={handleRemoveObjective}
        onObjectiveChange={handleObjectiveChange}
        onUpdateCourse={handleUpdateCourse}
        onImageChange={handleImageChange} // Thêm prop này
      />
    </div>
  );
};

export default CourseAdmin;
