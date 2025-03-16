const Comment = require("../models/Comment");

// Get all comments for a course
exports.getCommentsByCourse = async (req, res) => {
  try {
    const comments = await Comment.find({ courseId: req.params.courseId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new comment
exports.createComment = async (req, res) => {
  try {
    const { content, courseId } = req.body;
    const comment = new Comment({
      content,
      userId: req.user.id,
      courseId,
    });

    const savedComment = await comment.save();
    // Populate user info before sending response
    const populatedComment = await Comment.findById(savedComment._id).populate(
      "userId",
      "name avatar"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is owner of comment
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.remove();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is owner of comment
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.content = req.body.content;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "name avatar"
    );

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
