const express = require("express");
const upload = require("../config/multer");
const authController = require("../controllers/authController");
const middleware = require("../controllers/middleware");

const router = express.Router();

router.post("/register", upload.single("avatar"), authController.register);
router.post("/login", authController.login);
router.get("/profile", authController.getProfile);
router.get("/users", authController.getAllUsers);
router.put(
  "/ban-user/:userId",
  middleware.verifyToken,
  middleware.checkAdmin,
  authController.banUser
);
router.put(
  "/user/:userId/name",
  middleware.verifyToken,
  middleware.checkUser,
  authController.updateUserName
);
router.get("/user/:userId", authController.getUserById);

module.exports = router;
