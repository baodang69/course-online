const Role = require("../models/Role");

// 📌 Tạo role mới
exports.createRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    // Kiểm tra nếu roleName đã tồn tại
    const existingRole = await Role.findOne({ roleName });
    if (existingRole) {
      return res.status(400).json({ message: "Role này đã tồn tại!" });
    }

    const newRole = new Role({ roleName });
    await newRole.save();

    res.status(201).json({ message: "Tạo role thành công!", role: newRole });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 📌 Lấy danh sách tất cả role
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 📌 Lấy role theo ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Không tìm thấy role!" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 📌 Cập nhật role
exports.updateRole = async (req, res) => {
  try {
    const { roleName } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { roleName },
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Không tìm thấy role!" });
    }

    res.json({ message: "Cập nhật role thành công!", role });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 📌 Xóa role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Không tìm thấy role!" });
    }

    res.json({ message: "Xóa role thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};
