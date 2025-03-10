import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import { PlayCircle, Lock, CheckCircle } from "lucide-react";

const CoursePage = () => {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [showAllLessons, setShowAllLessons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id; // Lấy userId từ localStorage

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
  }, [id]);

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

  if (loading)
    return <p className="text-center text-blue-500">Loading course...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!course)
    return <p className="text-center text-red-500">Course not found</p>;

  const visibleLessons = showAllLessons ? lessons : lessons.slice(0, 7);
  const firstLesson = lessons.find((lesson) => lesson.order === 1);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-gray-900 text-white p-6 rounded-lg flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-lg">{course.content}</p>
          <p className="text-sm text-gray-400">
            Created On {new Date(course.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.description}</p>
            </CardContent>
          </Card>

          {lessons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {visibleLessons.map((lesson, index) => (
                    <li
                      key={lesson._id}
                      className="p-4 bg-gray-100 rounded-lg flex items-center space-x-2"
                    >
                      {index !== 0 ? (
                        <Lock className="w-6 h-6 text-black" />
                      ) : (
                        <PlayCircle className="w-7 h-7 text-green-500" />
                      )}
                      <h3 className="text-lg font-semibold">{lesson.title}</h3>
                    </li>
                  ))}
                </ul>
                {lessons.length > 7 && (
                  <Button
                    onClick={() => setShowAllLessons(!showAllLessons)}
                    className="mt-4 w-full"
                  >
                    {showAllLessons ? "Thu gọn" : "Xem thêm"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4">
              {firstLesson?.videoUrl &&
                (firstLesson.videoUrl.includes("youtube.com") ||
                firstLesson.videoUrl.includes("youtu.be") ? (
                  <iframe
                    className="w-full rounded-lg"
                    width="560"
                    height="315"
                    src={firstLesson.videoUrl.replace("watch?v=", "embed/")}
                    title="Lesson Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video controls className="w-full rounded-lg">
                    <source src={firstLesson.videoUrl} type="video/mp4" />
                  </video>
                ))}
              <Separator className="my-4" />

              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Objectives</h3>
                <ul className="space-y-2">
                  {course.objectives?.map((objective, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {!isEnrolled ? (
                <Button className="w-full mt-2" onClick={handleEnroll}>
                  Enroll Now
                </Button>
              ) : (
                <p className="text-center text-green-500 font-semibold">
                  You are enrolled in this course
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
