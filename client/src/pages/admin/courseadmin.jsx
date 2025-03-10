import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash, Plus, Edit } from "lucide-react"; // Import Plus icon
import axios from "../../lib/axios";

const CourseAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
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
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
      }
    };
    fetchData();
  }, []);

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
    setEditedCourse({ ...course, objectives: course.objectives || [] });
    setIsReadOnly(readOnly);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    setEditedCourse({ ...editedCourse, [e.target.name]: e.target.value });
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
      const userData = localStorage.getItem("user");
      let userId = null;

      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          userId = parsedUser._id; // Lấy _id từ parsedUser
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
        }
      }

      if (!userId) {
        console.error("User ID not found in localStorage");
        return; // Dừng lại nếu không tìm thấy userId
      }

      const courseData = {
        ...editedCourse,
        instructor: userId, // Gắn userId vào trường instructor
      };

      console.log("Course data:", courseData); // Kiểm tra dữ liệu trước khi gửi

      if (selectedCourse && selectedCourse._id) {
        // Cập nhật khóa học hiện có
        await axios.put(
          `http://localhost:5000/api/course/${selectedCourse._id}`,
          courseData
        );
        setCourses(
          courses.map((course) =>
            course._id === selectedCourse._id ? courseData : course
          )
        );
      } else {
        // Thêm khóa học mới
        const response = await axios.post(
          "http://localhost:5000/api/course",
          courseData
        );
        setCourses([...courses, response.data]);
      }
      setIsDialogOpen(false);
      setSelectedCourse(null);
      setEditedCourse({
        // Reset lại editedCourse
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
      console.error(
        "Error updating/creating course:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
        <Button onClick={() => handleEditClick({}, false)}>Thêm mới</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course._id} className="p-4 hover:scale-105 cursor-pointer">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-72 object-cover rounded-lg"
              onClick={() => handleEditClick(course, true)}
            />
            <CardContent className="mt-2">
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <div className="flex justify-between mt-2">
                <Button onClick={() => handleEditClick(course, false)}>
                  <Edit size={16} />
                </Button>
                <Button onClick={() => handleDelete(course._id)}>
                  <Trash size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-4xl"
          style={{ overflow: "auto", maxHeight: "80vh" }}
        >
          <DialogHeader>
            <DialogTitle>
              {isReadOnly ? "Xem khóa học" : "Chỉnh sửa khóa học"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label>Tiêu đề</Label>
            <Input
              name="title"
              value={editedCourse.title}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
            <Label>Hình ảnh</Label>
            <Input
              name="image"
              value={editedCourse.image}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
            <Label>Mô tả</Label>
            <Input
              name="description"
              value={editedCourse.description}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
            <Label>Giá</Label>
            <Input
              type="number"
              name="price"
              value={editedCourse.price}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />

            {/* Chọn Category */}
            <Label>Danh mục</Label>
            <Select
              onValueChange={(value) =>
                setEditedCourse({ ...editedCourse, categoryId: value })
              }
              value={editedCourse.categoryId}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Chọn Level */}
            <Label>Cấp độ</Label>
            <Select
              onValueChange={(value) =>
                setEditedCourse({ ...editedCourse, levelId: value })
              }
              value={editedCourse.levelId}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Chọn cấp độ"
                  value={levels.levelNName}
                />
              </SelectTrigger>
              <SelectContent>
                {levels.map((lvl) => (
                  <SelectItem key={lvl._id} value={lvl._id}>
                    {lvl.levelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Chọn Status */}
            <Label>Trạng thái</Label>
            <Select
              onValueChange={(value) =>
                setEditedCourse({ ...editedCourse, status: value })
              }
              value={editedCourse.status}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            {/* Mục tiêu khóa học */}
            <Label>Mục tiêu khóa học</Label>
            {editedCourse.objectives.map((obj, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex items-center flex-grow border rounded-md overflow-hidden">
                  <Input
                    value={obj}
                    onChange={(e) =>
                      handleObjectiveChange(index, e.target.value)
                    }
                    disabled={isReadOnly}
                    className="flex-grow border-0 focus-visible:ring-0"
                  />
                  {!isReadOnly && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveObjective(index)}
                      variant="ghost"
                      size="icon"
                      className="text-black bg-white" // Custom styles
                    >
                      <Trash size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {!isReadOnly && (
              <Button
                type="button"
                onClick={handleAddObjective}
                className="bg-black text-white hover:bg-black-600 "
              >
                <Plus size={16} className="mr-2" /> {/* Plus icon */}
                Thêm mục tiêu
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Đóng</Button>
            {!isReadOnly && (
              <Button onClick={handleUpdateCourse}>Cập nhật</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseAdmin;
