const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema(
  {
    levelName: {
      type: String,
      required: true,
      unique: true, // Tránh trùng lặp danh mục
      trim: true, // Loại bỏ khoảng trắng thừa
    },
  },
  { timestamps: true }
);

const Level = mongoose.model("Level", levelSchema, "Level");
module.exports = Level;
