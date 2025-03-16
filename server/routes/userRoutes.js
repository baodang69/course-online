const express = require("express");
const router = express.Router();
const auth = require("../controllers/middleware");
const userController = require("../controllers/userController");
const { upload } = require("../config/cloudinary");

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user name
router.put(
  "/:id/name",
  auth.verifyToken,
  auth.checkUser,
  userController.updateUserName
);

// Update user password
router.put(
  "/:id/password",
  auth.verifyToken,
  auth.checkUser,
  userController.updatePassword
);

// Update user avatar
router.put(
  "/:id/avatar",
  auth.verifyToken,
  auth.checkUser,
  upload.single("avatar"),
  userController.updateAvatar
);

module.exports = router;
