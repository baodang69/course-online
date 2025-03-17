const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");
const middleware = require("../controllers/middleware");

// Route cho việc xem bài học - chỉ cần verify token và check user
router.get("/course/:courseId", lessonController.getLessonsByCourse);

router.get(
  "/",
  middleware.verifyToken,
  middleware.checkUser,
  middleware.checkAdmin,
  lessonController.getAllLessons
);
router.get(
  "/:id",
  middleware.verifyToken,
  middleware.checkUser,
  middleware.checkAdmin,
  lessonController.getLessonById
);
router.post("/", lessonController.createLesson);
router.put("/:id", lessonController.updateLesson);
router.delete("/:id", lessonController.deleteLesson);

module.exports = router;
