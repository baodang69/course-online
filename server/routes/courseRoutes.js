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

router.post(
  "/",
  auth.verifyToken,
  uploadCourse.single("image"),
  courseController.createCourse
);
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.put(
  "/:id",
  auth.verifyToken,
  uploadCourse.single("image"),
  courseController.updateCourse
);
router.put(
  "/:id/image",
  auth.verifyToken,
  uploadCourse.single("image"),
  courseController.updateCourseImage
);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
