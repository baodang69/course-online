import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import { PlayCircle, Lock, CheckCircle, Clock } from "lucide-react";
import Header from "../../components/ui/header"; // Đã sửa đường dẫn import
import Footer from "../../components/ui/footer"; // Đã sửa đường dẫn import
import { motion } from "framer-motion";

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [showAllLessons, setShowAllLessons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, lessonsRes, enrollRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/course/${id}`),
          axios.get(`http://localhost:5000/api/lesson/course/${id}`),
          axios.get(`http://localhost:5000/api/enroll/check/${userId}/${id}`),
        ]);

        setCourse(courseRes.data);
        setLessons(lessonsRes.data);
        setIsEnrolled(enrollRes.data.isEnrolled);
        console.log("User id: " + userId);
        console.log(id);
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
  }, [id, userId]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/enroll", {
        course: id,
        user: userId,
        status: "Studying",
      });

      if (response.status === 201) {
        setIsEnrolled(true);
        navigate(`/enrolled/${id}`);
      }
    } catch (error) {
      console.error("Error enrolling:", error.response || error.message);
    }
  };

  const handleNavigate = async () => {
    navigate(`/enrolled/${id}`);
  };

  if (loading)
    return <p className="text-center text-blue-500">Loading course...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!course)
    return <p className="text-center text-red-500">Course not found</p>;

  const visibleLessons = showAllLessons ? lessons : lessons.slice(0, 7);
  const firstLesson = lessons.find((lesson) => lesson.order === 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {course?.title}
            </h1>
            <p className="text-lg text-blue-100 mb-6">{course?.description}</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {new Date(course?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Overview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-2xl">Course Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-600">{course?.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lessons Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-2xl">Course Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {visibleLessons.map((lesson, index) => (
                      <div
                        key={lesson._id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {index === 0 ? (
                              <PlayCircle className="w-8 h-8 text-green-500" />
                            ) : (
                              <Lock className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-medium">
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {lesson.duration || "45 mins"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-4 space-y-6">
              {/* Preview Video */}
              <Card className="overflow-hidden">
                <div className="aspect-video">
                  {firstLesson?.videoUrl && (
                    <iframe
                      className="w-full h-full"
                      src={firstLesson.videoUrl.replace("watch?v=", "embed/")}
                      title="Course Preview"
                      frameBorder="0"
                      allowFullScreen
                    />
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="text-3xl font-bold">
                      {course?.price === 0
                        ? "Free"
                        : `${course?.price.toLocaleString()} VND`}
                    </div>
                    {!isEnrolled ? (
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={handleEnroll}
                      >
                        Enroll Now
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleNavigate}
                      >
                        Continue Learning
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Course Features */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    What you'll learn
                  </h3>
                  <ul className="space-y-3">
                    {course?.objectives?.map((objective, index) => (
                      <li key={index} className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoursePage;
