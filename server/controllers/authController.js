const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

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

    let avatarUrl =
      "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"; // Ảnh mặc định
    // if (req.file) {
    //   // Tải ảnh lên Cloudinary
    //   const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "user_avatars",
    //   });
    //   avatarUrl = uploadResult.secure_url;
    // }

    // Tìm role "User" trong bảng Role
    const userRole = await Role.findOne({ roleName: "User" });
    if (!userRole) {
      return res.status(500).json({ message: "Không tìm thấy role 'User'!" });
    }

    // Lưu user vào DB
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
      role: userRole._id,
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

    const user = await User.findOne({ email }).populate("role");
    if (!user)
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });

    if (user.isBanned) {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
    });
    console.log("🟢 Headers gửi về client:", res.getHeaders());
    res.json({ message: "Đăng nhập thành công!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// 📌 Lấy thông tin người dùng
exports.getProfile = async (req, res) => {
  try {
    res.json(req.user); // Dữ liệu user đã được middleware lấy sẵn
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// 📌 Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role");
    console.log(users);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// API để ban user
exports.banUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    user.isBanned = !user.isBanned; // Đảo ngược trạng thái isBanned
    await user.save();

    res.status(200).json({
      message: user.isBanned
        ? "Người dùng đã bị khóa"
        : "Người dùng đã được mở khóa",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateUserName = async (req, res) => {
  try {
    const { newName } = req.body;
    const userId = req.params.userId;

    if (!newName) {
      res.json({ message: "Tên không được để trống" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    user.name = newName;
    await user.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//Tìm user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("role"); // populate role nếu cần
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
