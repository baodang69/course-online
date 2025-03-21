const express = require("express");
const router = express.Router();
const auth = require("../controllers/middleware");
const userController = require("../controllers/userController");
const { upload } = require("../config/cloudinary");

router.get("/:id", userController.getUserById);
router.put(
  "/:id/name",
  auth.verifyToken,
  auth.checkUser,
  userController.updateUserName
);
router.put(
  "/:id/password",
  auth.verifyToken,
  auth.checkUser,
  userController.updatePassword
);
router.put(
  "/:id/avatar",
  auth.verifyToken,
  auth.checkUser,
  upload.single("avatar"),
  userController.updateAvatar
);

module.exports = router;
