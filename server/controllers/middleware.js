const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const SECRET_KEY = process.env.JWT_SECRET || "mySecretKey";

// 📌 Middleware kiểm tra JWT
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    console.log("🟢 Token nhận được:", token); // 🔍 Kiểm tra token

    if (!token) {
      console.log("🔴 Không có token!");
      return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("🟢 Token giải mã:", decoded); // 🔍 Kiểm tra token đã decode

    req.userId = decoded.userId;

    const user = await User.findById(req.userId).select("-password");
    console.log("🟢 User tìm được:", user); // 🔍 Kiểm tra user có tồn tại không

    if (!user) {
      console.log("🔴 Không tìm thấy user!");
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    req.user = user;
    console.log("✅ Middleware verifyToken chạy thành công!");
    next();
  } catch (error) {
    console.log("🔴 Lỗi khi verify token:", error.message);
    return res.status(403).json({ message: "Token không hợp lệ!" });
  }
};

// 📌 Middleware kiểm tra quyền user (đã đăng nhập)
exports.checkUser = (req, res, next) => {
  console.log("🔍 Kiểm tra user trong checkUser:", req.user);

  if (!req.user) {
    console.log("🔴 Không có user, yêu cầu đăng nhập!");
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }

  console.log("✅ checkUser: User hợp lệ!");
  next();
};

// 📌 Middleware kiểm tra quyền admin
exports.checkAdmin = async (req, res, next) => {
  try {
    console.log("🔍 Kiểm tra user trong checkAdmin:", req.user);

    if (!req.user) {
      console.log("🔴 Không có user, yêu cầu đăng nhập!");
      return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
    }

    const userRole = await Role.findById(req.user.role);
    console.log("🟢 Role của user:", userRole);

    if (!userRole || userRole.roleName !== "Admin") {
      console.log("🔴 Không có quyền admin!");
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }

    console.log("✅ checkAdmin: User có quyền admin!");
    next();
  } catch (error) {
    console.log("🔴 Lỗi checkAdmin:", error.message);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};
