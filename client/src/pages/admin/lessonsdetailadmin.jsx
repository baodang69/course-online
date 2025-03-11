// pages/admin/lessonsdetailadmin.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LessonCard from "../../components/ui/lessoncard";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const LessonDetail = () => {
  const { courseid } = useParams();
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    videoUrl: "",
    resources: [""],
    order: 1,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/lesson/course/${courseid}`
        );
        setLessons(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài học:", error);
      }
    };

    fetchLessons();
  }, [courseid]);

  const handleUpdate = async (updatedLesson) => {
    try {
      await axios.put(
        `http://localhost:5000/api/lesson/${updatedLesson._id}`,
        updatedLesson
      );
      setLessons(
        lessons.map((lesson) =>
          lesson._id === updatedLesson._id ? updatedLesson : lesson
        )
      );
      console.log("Update lesson:", updatedLesson._id);
    } catch (error) {
      console.error("Lỗi khi cập nhật bài học:", error);
    }
  };

  const handleDelete = async (lessonId) => {
    try {
      await axios.delete(`http://localhost:5000/api/lesson/${lessonId}`);
      setLessons(lessons.filter((lesson) => lesson._id !== lessonId));
      console.log("Delete lesson:", lessonId);
    } catch (error) {
      console.error("Lỗi khi xóa bài học:", error);
    }
  };

  const handleAddLesson = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/lesson", {
        ...newLesson,
        course: courseid,
        resources: newLesson.resources,
      });
      setLessons([...lessons, res.data]);
      setNewLesson({
        title: "",
        content: "",
        videoUrl: "",
        resources: [""],
        order: 1,
      });
      setIsDialogOpen(false);
      console.log("Add lesson:", res.data._id);
    } catch (error) {
      console.error("Lỗi khi thêm bài học:", error);
    }
  };

  const addResource = () => {
    setNewLesson({
      ...newLesson,
      resources: [...newLesson.resources, ""],
    });
  };

  const removeResource = (index) => {
    setNewLesson({
      ...newLesson,
      resources: newLesson.resources.filter((_, i) => i !== index),
    });
  };

  const updateResource = (index, value) => {
    const newResources = [...newLesson.resources];
    newResources[index] = value;
    setNewLesson({
      ...newLesson,
      resources: newResources,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Quản lý Bài học</h2>
      <Button onClick={() => setIsDialogOpen(true)}>Thêm mới</Button>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-lg font-semibold mb-4">Thêm bài học mới</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tiêu đề:
                </label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, title: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nội dung:
                </label>
                <textarea
                  value={newLesson.content}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, content: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Video URL:
                </label>
                <input
                  type="text"
                  value={newLesson.videoUrl}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, videoUrl: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tài liệu:
                </label>
                {newLesson.resources.map((resource, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <input
                      type="text"
                      value={resource}
                      onChange={(e) => updateResource(index, e.target.value)}
                      placeholder="Nhập tài liệu..."
                      className="border rounded-lg p-2 w-full"
                    />
                    <Button
                      type="button"
                      onClick={() => removeResource(index)}
                      variant="ghost"
                      size="icon"
                      className="p-0 ml-1 text-red-500 hover:text-red-700"
                      aria-label="Xóa tài liệu"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addResource}
                  variant="ghost"
                  size="icon"
                  className="p-0 text-green-500 hover:text-green-700 mt-1"
                  aria-label="Thêm tài liệu"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Thứ tự:
                </label>
                <input
                  type="number"
                  value={newLesson.order}
                  onChange={(e) =>
                    setNewLesson({
                      ...newLesson,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleAddLesson} className="mr-2">
                  Thêm
                </Button>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="secondary"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson._id}
            lesson={lesson}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default LessonDetail;
