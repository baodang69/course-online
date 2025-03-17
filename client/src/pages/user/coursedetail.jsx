import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, ArrowLeft, Pencil, Trash2, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Sửa dòng import này
import axios from "../../lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from "react-hot-toast";

export default function VideoCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [courseTitle, setCourseTitle] = useState("Đang tải...");
  const [darkMode, setDarkMode] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Check if user is admin
  const isAdmin = currentUser?.role?.roleName === "Admin";

  // Kiểm tra nếu đang ở trang enrolled thì mới cho phép dark mode
  useEffect(() => {
    if (window.location.pathname.includes("/enrolled/")) {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    }
  }, []);

  // Lưu trạng thái dark mode vào localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // Lấy danh sách bài học
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/lesson/course/${courseId}`
        );
        setLessons(response.data);
        if (response.data.length > 0) {
          setSelectedLesson(response.data[0]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài học:", error);
      }
    };

    fetchLessons();
  }, [courseId]);

  // Lấy thông tin Course
  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/course/${courseId}`
        );
        setCourseTitle(response.data.title || "Không tìm thấy khóa học");
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khóa học:", error);
        setCourseTitle("Không tìm thấy khóa học");
      }
    };

    fetchCourseInfo();
  }, [courseId]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/comments/course/${courseId}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy comments:", error);
      }
    };
    fetchComments();
  }, [courseId]);

  // Get current user
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log("Logged in user:", user); // Debug user info
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  // Thêm listener cho sự kiện userUpdated
  useEffect(() => {
    const handleUserUpdate = async (event) => {
      const { userId, newName } = event.detail;

      // Cập nhật comments nếu có comment của user vừa được update
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.userId._id === userId) {
            return {
              ...comment,
              userId: {
                ...comment.userId,
                name: newName,
              },
            };
          }
          return comment;
        })
      );
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  // Thêm effect để check enrollment
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/auth");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/enroll/check/${user._id}/${courseId}`
        );
        setIsEnrolled(response.data.isEnrolled);

        if (!response.data.isEnrolled) {
          toast.error("Bạn chưa đăng ký khóa học này!");
          navigate(`/courses/detail/${courseId}`);
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
        toast.error("Có lỗi xảy ra khi kiểm tra đăng ký khóa học");
        navigate(`/courses/detail/${courseId}`);
      }
    };

    checkEnrollment();
  }, [courseId, navigate]);

  // Submit comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/comments", {
        content: newComment,
        courseId,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
      toast.success("Đã đăng bình luận thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi comment:", error);
      toast.error("Có lỗi xảy ra khi đăng bình luận!");
    }
  };

  // Delete comment - chỉ admin mới được xóa
  const handleDeleteComment = async (commentId) => {
    if (!isAdmin) {
      toast.error("Chỉ admin mới có quyền xóa bình luận!");
      return;
    }

    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Cập nhật UI sau khi xóa
        setComments(comments.filter((comment) => comment._id !== commentId));
        toast.success("Xóa bình luận thành công");
      } catch (error) {
        console.error("Lỗi khi xóa comment:", error);
        toast.error("Có lỗi xảy ra khi xóa bình luận");
      }
    }
  };

  // Update comment
  const handleUpdateComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/comments/${editingComment._id}`,
        { content: editContent }
      );
      setComments(
        comments.map((comment) =>
          comment._id === editingComment._id ? response.data : comment
        )
      );
      setEditingComment(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật comment:", error);
    }
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      {!isEnrolled ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              Bạn chưa đăng ký khóa học này
            </h2>
            <p className="text-gray-600 mb-4">
              Vui lòng đăng ký để truy cập nội dung khóa học.
            </p>
            <Button
              onClick={() => navigate(`/courses/detail/${courseId}`)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Đăng ký ngay
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4">
              <div className="h-16 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/courses`)}
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Courses
                </Button>

                <h1 className="text-xl font-semibold truncate max-w-2xl">
                  {courseTitle}
                </h1>

                {window.location.pathname.includes("/enrolled/") && (
                  <Button
                    variant="outline"
                    onClick={toggleDarkMode}
                    className="flex items-center gap-2"
                  >
                    {darkMode ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-8 space-y-6">
                {/* Video Player */}
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-black">
                    {selectedLesson ? (
                      <iframe
                        className="w-full h-full"
                        src={`${selectedLesson.videoUrl.replace(
                          "watch?v=",
                          "embed/"
                        )}?autoplay=1`}
                        title={selectedLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No video selected
                      </div>
                    )}
                  </div>
                </Card>

                {/* Lesson Content */}
                <Card className="dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                      {selectedLesson?.title || "No lesson selected"}
                    </h2>
                    <div className="prose dark:prose-invert max-w-none">
                      {selectedLesson?.content || "No content available"}
                    </div>
                  </CardContent>
                </Card>

                {/* Comments Section */}
                <Card className="dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Discussion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitComment} className="mb-6">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Share your thoughts..."
                        rows="3"
                      />
                      <Button type="submit" className="mt-2">
                        Post Comment
                      </Button>
                    </form>

                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <motion.div
                          key={comment._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    comment.userId?.avatar ||
                                    "/default-avatar.png"
                                  }
                                  alt=""
                                  className="w-10 h-10 rounded-full"
                                />
                                <div>
                                  <p className="font-semibold">
                                    {comment.userId?.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {currentUser?._id === comment.userId._id ? (
                                // Chỉ hiện nút sửa cho user
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingComment(comment);
                                    setEditContent(comment.content);
                                  }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              ) : isAdmin ? (
                                // Chỉ hiện nút xóa cho admin
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              ) : null}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                              {comment.content}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <Card className="dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle>Course Content</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y dark:divide-gray-700">
                        {lessons.map((lesson) => (
                          <button
                            key={lesson._id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                              selectedLesson?._id === lesson._id
                                ? "bg-gray-100 dark:bg-gray-700"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <PlayCircle className="w-5 h-5 text-blue-500" />
                              <span className="flex-grow truncate">
                                {lesson.title}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Comment Dialog */}
          <Dialog
            open={!!editingComment}
            onOpenChange={() => setEditingComment(null)}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Comment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateComment} className="space-y-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                  rows="3"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingComment(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
      <Toaster position="top-right" />
    </div>
  );
}
