const express = require("express");
const courseController = require("../controllers/courseController");

const {
  checkUser,
  verifyToken,
  checkAdmin,
} = require("../controllers/middleware");

const router = express.Router();

// 📌 Tạo khóa học mới
router.post("/", courseController.createCourse);

// 📌 Lấy danh sách tất cả khóa học
router.get("/", verifyToken, checkUser, courseController.getAllCourses);

// 📌 Lấy thông tin chi tiết khóa học theo ID
router.get("/:id", courseController.getCourseById);

// 📌 Cập nhật khóa học theo ID
router.put("/:id", courseController.updateCourse);

// 📌 Xóa khóa học theo ID
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
