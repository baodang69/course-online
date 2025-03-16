import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sun, Moon, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import axios from "../../lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  // Submit comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/comments", {
        content: newComment,
        courseId,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Lỗi khi gửi comment:", error);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
        setComments(comments.filter((comment) => comment._id !== commentId));
      } catch (error) {
        console.error("Lỗi khi xóa comment:", error);
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
      className={`grid grid-cols-12 h-screen p-4 gap-4 ${
        darkMode ? "dark bg-gray-900 text-white" : ""
      }`}
    >
      {/* Header */}
      <div className="col-span-12 flex justify-between items-center mb-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/courses`)}
          className="flex items-center hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* Course Title */}
        <h1 className="text-2xl font-bold">{courseTitle}</h1>

        {/* Toggle Theme Button */}
        {window.location.pathname.includes("/enrolled/") && (
          <Button
            variant="ghost"
            onClick={toggleDarkMode}
            className="flex items-center"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        )}
      </div>

      {/* Cột trái - Video + Nội dung */}
      <div className="col-span-8">
        <div className="space-y-4">
          {/* Video Card */}
          <div className="aspect-video">
            {selectedLesson ? (
              <iframe
                className="w-full h-full"
                src={`${selectedLesson.videoUrl.replace(
                  "watch?v=",
                  "embed/"
                )}?autoplay=1`}
                title={selectedLesson.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                Chưa có video nào được chọn
              </div>
            )}
          </div>

          {/* Nội dung bài học */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">
              {selectedLesson ? selectedLesson.title : "Chưa chọn bài học"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {selectedLesson ? selectedLesson.content : "Chưa có mô tả"}
            </p>
          </div>
        </div>
      </div>

      {/* Cột phải - Danh sách bài học và Comments */}
      <div className="col-span-4">
        <ScrollArea className="h-[calc(100vh-100px)]">
          {/* Danh sách bài học */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Danh sách bài học</h2>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <button
                  key={lesson._id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full p-2 text-left rounded transition ${
                    selectedLesson?._id === lesson._id
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {lesson.title}
                </button>
              ))}
            </div>
          </div>

          {/* Comments section */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold mb-4">Danh sách comment</h2>
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800"
                placeholder="Viết bình luận của bạn..."
                rows="3"
              />
              <Button type="submit" className="w-full mt-2">
                Gửi bình luận
              </Button>
            </form>

            <div className="space-y-4">
              {comments.map((comment) => {
                // Debug logs
                console.log("Comment:", {
                  commentId: comment._id,
                  commentUserId: comment.userId._id,
                  commentUserName: comment.userId.name,
                  currentUserId: currentUser?._id,
                });

                return (
                  <div
                    key={comment._id}
                    className="bg-gray-50 dark:bg-gray-800 p-3 rounded"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.userId.avatar || "/default-avatar.png"}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{comment.userId.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Debug visible condition */}
                      {console.log(
                        "Should show buttons:",
                        currentUser?._id === comment.userId._id
                      )}

                      {/* Show edit/delete buttons với điều kiện đã sửa */}
                      {currentUser &&
                        currentUser._id === comment.userId._id && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                console.log(
                                  "Edit clicked for comment:",
                                  comment._id
                                ); // Debug edit click
                                setEditingComment(comment);
                                setEditContent(comment.content);
                              }}
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Sửa
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                console.log(
                                  "Delete clicked for comment:",
                                  comment._id
                                ); // Debug delete click
                                handleDeleteComment(comment._id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa
                            </Button>
                          </div>
                        )}
                    </div>
                    <p className="mt-2">{comment.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Edit Comment Dialog */}
      <Dialog
        open={!!editingComment}
        onOpenChange={() => setEditingComment(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateComment} className="space-y-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800"
              rows="3"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingComment(null)}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
