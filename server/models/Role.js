const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true, // Tránh trùng lặp danh mục
      trim: true, // Loại bỏ khoảng trắng thừa
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema, "Role");
module.exports = Role;
