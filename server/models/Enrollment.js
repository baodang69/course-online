const mongoose = require("mongoose");

const enrollSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Studying", "Completed"],
      default: "Not Enrolled",
    },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model("Enrollment", enrollSchema, "Enrollment");
module.exports = Enrollment;
