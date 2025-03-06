import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function VideoCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [courseTitle, setCourseTitle] = useState("Đang tải...");
  const [darkMode, setDarkMode] = useState(false);

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
          variant="outline"
          onClick={() => navigate(`/courses`)}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* Course Title */}
        <h1 className="text-2xl font-bold text-center">{courseTitle}</h1>

        {/* Toggle Theme Button (Chỉ hiển thị nếu đang ở trang enrolled) */}
        {window.location.pathname.includes("/enrolled/") && (
          <Button
            variant="outline"
            onClick={toggleDarkMode}
            className="flex items-center"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 mr-2" />
            ) : (
              <Moon className="w-5 h-5 mr-2" />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        )}
      </div>

      {/* Cột trái - Video + Nội dung */}
      <div className="col-span-8 flex flex-col gap-4">
        {/* Video */}
        <ScrollArea className="flex-1 border rounded-lg p-2 max-h-[calc(100vh-100px)] overflow-y-auto">
          <Card className="flex-1">
            <CardContent className="p-4 h-full flex items-center">
              {selectedLesson ? (
                <iframe
                  className="w-full rounded-lg aspect-video"
                  src={`${selectedLesson.videoUrl.replace(
                    "watch?v=",
                    "embed/"
                  )}?autoplay=1`}
                  title={selectedLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <p className="text-center w-full">
                  Chưa có video nào được chọn
                </p>
              )}
            </CardContent>
          </Card>

          {/* Nội dung bài học + Resources */}
          <Card className="flex-1">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">
                {selectedLesson ? selectedLesson.title : "Chưa chọn bài học"}
              </h2>
              <p>{selectedLesson ? selectedLesson.content : "Chưa có mô tả"}</p>

              {/* Resources */}
              {selectedLesson?.resources &&
                selectedLesson.resources.length > 0 && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">
                      Tài liệu tham khảo
                    </h2>
                    <ul className="list-disc list-inside text-sm">
                      {selectedLesson.resources.map((url, index) => (
                        <li key={index}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>
        </ScrollArea>
      </div>

      {/* Cột phải - Danh sách bài học */}
      <div className="col-span-4 border-l pl-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-2">Danh sách bài học</h2>
        <ScrollArea className="flex-1 border rounded-lg p-2 max-h-[calc(100vh-290px)] overflow-y-auto">
          {lessons.map((lesson) => (
            <Button
              key={lesson._id}
              variant={
                selectedLesson?._id === lesson._id ? "default" : "outline"
              }
              className="w-full text-left mb-2 rounded-lg"
              onClick={() => setSelectedLesson(lesson)}
            >
              {lesson.title}
            </Button>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
