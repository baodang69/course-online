const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, // Khóa học chứa bài học
    title: { type: String, required: true }, // Tiêu đề bài học
    content: { type: String }, // Nội dung văn bản
    videoUrl: { type: String }, // Link video bài học
    resources: [{ type: String }], // Danh sách tài liệu (PDF, link, v.v.)
    order: { type: Number, required: true }, // Thứ tự bài học trong khóa học
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema, "Lesson");
module.exports = Lesson;
