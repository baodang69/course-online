const express = require("express");
const router = express.Router();
const auth = require("../controllers/middleware");
const commentController = require("../controllers/commentController");

// Get comments by courseId
router.get("/course/:courseId", commentController.getCommentsByCourse);

// Create comment (requires authentication)
router.post(
  "/",
  auth.verifyToken,
  auth.checkUser,
  commentController.createComment
);

// Delete comment (requires authentication)
router.delete(
  "/:id",
  auth.verifyToken,
  auth.checkUser,
  commentController.deleteComment
);

// Update comment (requires authentication)
router.put(
  "/:id",
  auth.verifyToken,
  auth.checkUser,
  commentController.updateComment
);

module.exports = router;
