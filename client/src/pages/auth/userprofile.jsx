import React, { useState, useEffect } from "react";
import Header from "../../components/ui/header";
import Footer from "../../components/ui/footer";
import axios from "../../lib/axios";
import { useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");

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
    try {
      await axios.put(`http://localhost:5000/api/user/${id}`, {
        name: newName,
      });
      setUser({ ...user, name: newName });
      setEditName(false);
    } catch (error) {
      console.error("Error updating name:", error.response || error.message);
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
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full mb-2"
                  />
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
                          className="bg-blue-500 text-white p-2 rounded"
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
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 space-y-4">
            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold mb-4">
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
                          <span>{course.title}</span>
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
