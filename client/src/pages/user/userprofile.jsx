import React, { useState, useEffect } from "react";
import Header from "../../components/ui/header";
import Footer from "../../components/ui/footer";
import axios from "../../lib/axios";
import { useParams } from "react-router-dom";
import { Pencil, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`http://localhost:5000/api/user/${id}`);
        const enrolledRes = await axios.get(
          `http://localhost:5000/api/enroll/check/${id}`
        );
        const allCoursesRes = await axios.get(
          "http://localhost:5000/api/course"
        );

        console.log("User Data:", userRes.data);
        console.log("Enrolled Courses:", enrolledRes.data);
        console.log("All Courses:", allCoursesRes.data);

        setUser(userRes.data);
        setEnrolledCourses(enrolledRes.data);
        setAllCourses(allCoursesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
        setError(
          `Error: ${error.response?.status} - ${error.response?.statusText}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      console.error("Tên mới không được để trống");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/user/${id}/name`, {
        newName,
      });

      // Cập nhật user trong state
      setUser((prevUser) => ({ ...prevUser, name: newName }));

      // Cập nhật user trong localStorage
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && currentUser._id === id) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            name: newName,
          })
        );
      }

      // Emit custom event để các component khác có thể lắng nghe
      const event = new CustomEvent("userUpdated", {
        detail: { userId: id, newName },
      });
      window.dispatchEvent(event);

      setEditName(false);
    } catch (error) {
      console.error("Error updating name:", error.response || error.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/user/${id}/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }
      );

      toast.success("Đổi mật khẩu thành công");
      setShowPasswordForm(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.put(
        `http://localhost:5000/api/user/${id}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Cập nhật state và localStorage
      setUser(response.data);
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && currentUser._id === id) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            avatar: response.data.avatar,
          })
        );
      }

      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật ảnh đại diện");
      console.error("Error updating avatar:", error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (loading)
    return <p className="text-center text-blue-500">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!user) return <p className="text-center text-red-500">User not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <Card>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center mb-4 ">
                  <div className="relative">
                    <img
                      src={user.avatar || ""}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full mb-2 mt-70"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100"
                    >
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        disabled={isUploadingAvatar}
                      />
                    </label>
                  </div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <label className="font-medium">Tên:</label>
                    {editName ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="bg-gray-100"
                        />
                        <button
                          onClick={handleUpdateName}
                          className="bg-black text-white p-2 rounded"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          value={user.name}
                          readOnly
                          className="bg-gray-100"
                        />
                        <button
                          onClick={() => {
                            setEditName(true);
                            setNewName(user.name);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <label className="font-medium">Email:</label>
                    <Input
                      type="text"
                      value={user.email}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <label className="font-medium">ID:</label>
                    <Input
                      type="text"
                      value={user._id}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <label className="font-medium">Ngày tạo:</label>
                    <Input
                      type="text"
                      value={user.createdAt}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="mt-6">
                    <Button
                      type="button"
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      variant="outline"
                    >
                      {showPasswordForm ? "Hủy đổi mật khẩu" : "Đổi mật khẩu"}
                    </Button>

                    {showPasswordForm && (
                      <form
                        onSubmit={handlePasswordChange}
                        className="mt-4 space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-2 items-center">
                          <label className="font-medium">
                            Mật khẩu hiện tại:
                          </label>
                          <Input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 items-center">
                          <label className="font-medium">Mật khẩu mới:</label>
                          <Input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 items-center">
                          <label className="font-medium">
                            Xác nhận mật khẩu mới:
                          </label>
                          <Input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit">Lưu mật khẩu mới</Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 space-y-4">
            <Card>
              <CardContent>
                <h2 className="text-xl mt-5 font-semibold mb-4">
                  Khóa học đã đăng ký
                </h2>
                <ul className="space-y-2">
                  {enrolledCourses.map((enrollmentId) => {
                    const course = allCourses.find(
                      (c) => String(c._id) === String(enrollmentId)
                    );
                    if (course) {
                      return (
                        <li key={enrollmentId} className="flex items-center">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-10 h-10 rounded-full mr-2"
                          />
                          <a
                            href={`/enrolled/${course._id}`}
                            className="text-black hover:underline"
                          >
                            {course.title}
                          </a>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
