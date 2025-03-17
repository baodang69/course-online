const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String },
    videoUrl: { type: String },
    resources: [{ type: String }],
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema, "Lesson");
module.exports = Lesson;
