const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const auth = require("../controllers/middleware");
const { uploadCourse } = require("../config/cloudinary");

const {
  checkUser,
  verifyToken,
  checkAdmin,
} = require("../controllers/middleware");

// 📌 Tạo khóa học mới
router.post(
  "/",
  auth.verifyToken,
  uploadCourse.single("image"),
  courseController.createCourse
);

// 📌 Lấy danh sách tất cả khóa học
router.get("/", courseController.getAllCourses);

// 📌 Lấy thông tin chi tiết khóa học theo ID
router.get("/:id", courseController.getCourseById);

// 📌 Cập nhật khóa học theo ID
router.put(
  "/:id",
  auth.verifyToken,
  uploadCourse.single("image"),
  courseController.updateCourse
);

// 📌 Cập nhật hình ảnh khóa học theo ID
router.put(
  "/:id/image",
  auth.verifyToken,
  uploadCourse.single("image"),
  courseController.updateCourseImage
);

// 📌 Xóa khóa học theo ID
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
