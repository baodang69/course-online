const Course = require("../models/Course");

// 📌 1. Tạo khóa học mới
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      image,
      categoryId,
      levelId,
      price,
      status,
      objectives,
    } = req.body;

    const newCourse = new Course({
      title,
      description,
      instructor,
      image,
      categoryId,
      levelId,
      price,
      status,
      objectives,
    });

    await newCourse.save();
    res
      .status(201)
      .json({ message: "Khóa học đã được tạo!", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 📌 2. Lấy danh sách tất cả khóa học
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .populate("categoryId", "categoryName")
      .populate("levelId", "levelName");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 📌 3. Lấy thông tin chi tiết của một khóa học theo ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("categoryId", "categoryName")
      .populate("levelId", "levelName");

    if (!course)
      return res.status(404).json({ message: "Không tìm thấy khóa học!" });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 📌 4. Cập nhật khóa học theo ID
exports.updateCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      categoryId,
      levelId,
      price,
      status,
      objectives,
    } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image,
        categoryId,
        levelId,
        price,
        status,
        objectives,
      },
      { new: true }
    )
      .populate("instructor", "name email")
      .populate("categoryId", "categoryName")
      .populate("levelId", "levelName");

    if (!updatedCourse)
      return res.status(404).json({ message: "Không tìm thấy khóa học!" });

    res.json({ message: "Cập nhật thành công!", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 📌 5. Xóa khóa học theo ID
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse)
      return res.status(404).json({ message: "Không tìm thấy khóa học!" });

    res.json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};
