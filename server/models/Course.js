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
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    levelId: { type: mongoose.Schema.Types.ObjectId, ref: "Level" },
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    objectives: [{ type: String }],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema, "Courses");
module.exports = Course;
