const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true, // Tránh trùng lặp danh mục
      trim: true, // Loại bỏ khoảng trắng thừa
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema, "Category");
module.exports = Category;
