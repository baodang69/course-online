const express = require("express");
const enrollController = require("../controllers/enrollController");

const router = express.Router();

router.get("/count", enrollController.getEnrollmentCount);
router.get("/check/:userId/:courseId", enrollController.checkEnrolled);
router.get("/check/:userId", enrollController.checkUsersCourses);
router.get("/", enrollController.getAllEnrollments);
router.get("/:id", enrollController.getEnrollmentById);
router.post("/", enrollController.createEnrollment);
router.put("/:id", enrollController.updateEnrollment);
router.delete("/:id", enrollController.deleteEnrollment);

module.exports = router;
