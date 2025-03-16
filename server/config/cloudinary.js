const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage: storage });

const courseStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "courses",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const uploadCourse = multer({ storage: courseStorage });

module.exports = { upload, uploadCourse, cloudinary };
