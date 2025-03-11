// components/ui/lessoncard.js
import React, { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LessonCard = ({ lesson, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content);
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl);
  const [resources, setResources] = useState(lesson.resources || [""]);
  const [order, setOrder] = useState(lesson.order);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedLesson = {
      ...lesson,
      title,
      content,
      videoUrl,
      resources,
      order,
    };
    onUpdate(updatedLesson);
    setIsEditing(false);
  };

  const addResource = () => {
    setResources([...resources, ""]);
  };

  const removeResource = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const updateResource = (index, value) => {
    const newResources = [...resources];
    newResources[index] = value;
    setResources(newResources);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md">
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tiêu đề:
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          readOnly={!isEditing}
          placeholder="Nhập tiêu đề..."
          className={`border rounded-lg p-2 w-full ${
            isEditing ? "border-blue-500" : "border-gray-300"
          }`}
          key="title"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Nội dung:
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          readOnly={!isEditing}
          placeholder="Nhập nội dung..."
          className={`border rounded-lg p-2 w-full ${
            isEditing ? "border-blue-500" : "border-gray-300"
          }`}
          key="content"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Video URL:
        </label>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          readOnly={!isEditing}
          placeholder="Nhập URL video..."
          className={`border rounded-lg p-2 w-full ${
            isEditing ? "border-blue-500" : "border-gray-300"
          }`}
          key="videoUrl"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tài liệu:
        </label>
        {resources.map((resource, index) => (
          <div key={index} className="flex items-center mb-1">
            <input
              type="text"
              value={resource}
              onChange={(e) => updateResource(index, e.target.value)}
              readOnly={!isEditing}
              placeholder="Nhập tài liệu..."
              className={`border rounded-lg p-2 w-full ${
                isEditing ? "border-blue-500" : "border-gray-300"
              }`}
            />
            {isEditing && (
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
            )}
          </div>
        ))}
        {isEditing && (
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
        )}
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Thứ tự:
        </label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value))}
          readOnly={!isEditing}
          placeholder="Nhập thứ tự..."
          className={`border rounded-lg p-2 w-full ${
            isEditing ? "border-blue-500" : "border-gray-300"
          }`}
          key="order"
        />
      </div>
      <div className="flex justify-end mt-4">
        {isEditing ? (
          <>
            <Button onClick={handleSave} className="mr-2 rounded-md">
              Save
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="rounded-md"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleEdit}
              variant="ghost"
              size="icon"
              className="p-0 mr-2"
              aria-label="Chỉnh sửa bài học"
            >
              <Pencil size={20} />
            </Button>
            <Button
              onClick={() => onDelete(lesson._id)}
              variant="ghost"
              size="icon"
              className="p-0"
              aria-label="Xóa bài học"
            >
              <Trash2 size={20} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default LessonCard;
