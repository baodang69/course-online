const express = require("express");
const router = express.Router();
const auth = require("../controllers/middleware");
const commentController = require("../controllers/commentController");

router.get("/course/:courseId", commentController.getCommentsByCourse);
router.post(
  "/",
  auth.verifyToken,
  auth.checkUser,
  commentController.createComment
);
router.delete(
  "/:id",
  auth.verifyToken,
  auth.checkUser,
  commentController.deleteComment
);
router.put(
  "/:id",
  auth.verifyToken,
  auth.checkUser,
  commentController.updateComment
);

module.exports = router;
