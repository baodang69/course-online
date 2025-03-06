const multer = require("multer");
const path = require("path");

// Cấu hình Multer để lưu file tạm trong thư mục "uploads/"
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Chỉ cho phép upload file ảnh (jpg, png, jpeg)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ được upload file ảnh (jpg, png, jpeg)!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
