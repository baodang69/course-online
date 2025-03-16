const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user name
exports.updateUserName = async (req, res) => {
  try {
    const { newName } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = newName;
    await user.save();
    res.json({ message: "User name updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user avatar
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cập nhật avatar URL
    user.avatar = req.file.path;
    await user.save();

    // Trả về user đã được cập nhật (không bao gồm password)
    const updatedUser = await User.findById(user._id).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
