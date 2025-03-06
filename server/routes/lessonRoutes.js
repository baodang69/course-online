const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");

router.get("/course/:courseId", lessonController.getLessonsByCourse);
router.get("/", lessonController.getAllLessons);
router.get("/:id", lessonController.getLessonById);
router.post("/", lessonController.createLesson);
router.put("/:id", lessonController.updateLesson);
router.delete("/:id", lessonController.deleteLesson);

module.exports = router;
