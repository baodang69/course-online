const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET_KEY = process.env.JWT_SECRET || "mySecretKey";

// 📌 Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại!" });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl = "https://example.com/default-avatar.png"; // Ảnh mặc định
    // if (req.file) {
    //   // Tải ảnh lên Cloudinary
    //   const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "user_avatars",
    //   });
    //   avatarUrl = uploadResult.secure_url;
    // }

    // Lưu user vào DB
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
      enrolledCourses: [],
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 📌 Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({ message: "Đăng nhập thành công!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// 📌 Lấy thông tin người dùng
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// 📌 Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
