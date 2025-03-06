const Category = require("../models/Category");

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = new Category({ categoryName });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("courses");
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { categoryName, courses } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryName, courses },
      { new: true, runValidators: true }
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Lấy danh sách khóa học theo categoryId
exports.getCoursesByCategory = async (req, res) => {
  try {
    const courses = await Course.find({
      categoryId: req.params.categoryId,
    }).populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};
