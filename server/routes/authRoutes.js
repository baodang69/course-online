const express = require("express");
const upload = require("../config/multer");
const authController = require("../controllers/authController");

const router = express.Router();

// Đăng ký tài khoản
router.post("/register", upload.single("avatar"), authController.register);

// Đăng nhập
router.post("/login", authController.login);

// Lấy thông tin người dùng
router.get("/profile", authController.getProfile);

// Lấy danh sách người dùng
router.get("/", authController.getAllUsers);

module.exports = router;
