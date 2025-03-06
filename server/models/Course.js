const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Thêm categoryId
    levelId: { type: mongoose.Schema.Types.ObjectId, ref: "Level" }, // Thêm levelId
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    objectives: [{ type: String }], // Danh sách mục tiêu khóa học
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema, "Courses");
module.exports = Course;
