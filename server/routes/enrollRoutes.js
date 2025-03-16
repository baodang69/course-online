const express = require("express");
const enrollController = require("../controllers/enrollController");

const router = express.Router();

// Đặt route cụ thể lên trước
router.get("/count", enrollController.getEnrollmentCount);
router.get("/check/:userId/:courseId", enrollController.checkEnrolled);
router.get("/check/:userId", enrollController.checkUsersCourses);

// Các route khác
router.get("/", enrollController.getAllEnrollments);
router.get("/:id", enrollController.getEnrollmentById);
router.post("/", enrollController.createEnrollment);
router.put("/:id", enrollController.updateEnrollment);
router.delete("/:id", enrollController.deleteEnrollment);

module.exports = router;
