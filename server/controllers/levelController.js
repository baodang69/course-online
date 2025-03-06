const Level = require("../models/Level");

// Lấy danh sách tất cả levels
exports.getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy một level theo ID
exports.getLevelById = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);
    if (!level) return res.status(404).json({ message: "Level không tồn tại" });

    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Thêm mới level
exports.createLevel = async (req, res) => {
  try {
    const { levelName } = req.body;
    if (!levelName)
      return res.status(400).json({ message: "Tên level là bắt buộc" });

    const newLevel = new Level({ levelName });
    await newLevel.save();

    res.status(201).json(newLevel);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Cập nhật level theo ID
exports.updateLevel = async (req, res) => {
  try {
    const { levelName } = req.body;
    const updatedLevel = await Level.findByIdAndUpdate(
      req.params.id,
      { levelName },
      { new: true, runValidators: true }
    );

    if (!updatedLevel)
      return res.status(404).json({ message: "Level không tồn tại" });

    res.status(200).json(updatedLevel);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xóa level theo ID
exports.deleteLevel = async (req, res) => {
  try {
    const deletedLevel = await Level.findByIdAndDelete(req.params.id);
    if (!deletedLevel)
      return res.status(404).json({ message: "Level không tồn tại" });

    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
