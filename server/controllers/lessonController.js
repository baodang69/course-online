// controllers/lessonController.js
const Lesson = require("../models/Lesson");

// Lấy danh sách bài học theo courseId
exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort(
      "order"
    );
    if (!lessons.length)
      return res.status(404).json({ error: "Không tìm thấy bài học nào" });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Lấy tất cả bài học
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().populate("course", "title");
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Lấy một bài học theo ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate(
      "course",
      "title"
    );
    if (!lesson)
      return res.status(404).json({ error: "Bài học không tồn tại" });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Thêm bài học mới
exports.createLesson = async (req, res) => {
  try {
    const { course, title, content, videoUrl, resources, order } = req.body;
    const newLesson = new Lesson({
      course,
      title,
      content,
      videoUrl,
      resources,
      order,
    });
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Cập nhật bài học
exports.updateLesson = async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLesson)
      return res.status(404).json({ error: "Bài học không tồn tại" });
    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Xóa bài học
exports.deleteLesson = async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!deletedLesson)
      return res.status(404).json({ error: "Bài học không tồn tại" });
    res.json({ message: "Bài học đã được xóa" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};
