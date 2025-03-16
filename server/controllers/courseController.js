const Course = require("../models/Course");

// 📌 1. Tạo khóa học mới
exports.createCourse = async (req, res) => {
  try {
    // Log để debug
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const {
      title,
      description,
      price,
      categoryId,
      levelId,
      status,
      objectives,
      instructor,
    } = req.body;

    // Tạo object courseData với các trường bắt buộc
    const courseData = {
      title,
      description,
      instructor,
      price: Number(price),
      status: status || "draft",
    };

    // Thêm các trường không bắt buộc nếu có
    if (categoryId) courseData.categoryId = categoryId;
    if (levelId) courseData.levelId = levelId;
    if (objectives) {
      courseData.objectives =
        typeof objectives === "string" ? JSON.parse(objectives) : objectives;
    }
    if (req.file) {
      courseData.image = req.file.path;
    }

    console.log("Final courseData:", courseData);

    const course = new Course(courseData);
    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate("instructor", "name email")
      .populate("categoryId", "categoryName")
      .populate("levelId", "levelName");

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      message: "Error creating course",
      error: error.message,
      stack: error.stack,
    });
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
    res.status(500).json({ message: error.message });
  }
};

// 📌 3. Lấy thông tin chi tiết của một khóa học theo ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("categoryId", "categoryName")
      .populate("levelId", "levelName");

    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học!" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 4. Cập nhật khóa học theo ID
exports.updateCourse = async (req, res) => {
  try {
    const courseData = {};

    // Extract data from request body
    const {
      title,
      description,
      price,
      categoryId,
      levelId,
      status,
      objectives,
    } = req.body;

    // Log received data for debugging
    console.log("Received update data:", {
      title,
      description,
      price,
      categoryId,
      levelId,
      status,
      objectives,
      file: req.file,
    });

    // Assign fields
    if (title) courseData.title = title;
    if (description) courseData.description = description;
    if (price) courseData.price = Number(price);
    if (categoryId) courseData.categoryId = categoryId;
    if (levelId) courseData.levelId = levelId;
    if (status) courseData.status = status;

    // Handle objectives
    if (objectives) {
      courseData.objectives =
        typeof objectives === "string" ? JSON.parse(objectives) : objectives;
    }

    // Handle image if present
    if (req.file) {
      courseData.image = req.file.path;
    }

    // Log final courseData before update
    console.log("Final courseData:", courseData);

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      courseData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("instructor", "name email")
      .populate("categoryId", "categoryName")
      .populate("levelId", "levelName");

    if (!updatedCourse) {
      return res.status(404).json({ message: "Không tìm thấy khóa học!" });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📌 5. Xóa khóa học theo ID
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Không tìm thấy khóa học!" });
    }
    res.json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update course image
exports.updateCourseImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.image = req.file.path;
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
