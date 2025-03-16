import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Header from "../../components/ui/header";
import Footer from "../../components/ui/footer";
import axios from "../../lib/axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/course", {
          params: { status: "approved" },
        });
        setCourses(response.data);
      } catch (error) {
        console.error(
          "Error fetching courses:",
          error.response || error.message
        );
        setError("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };

    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/contact/approved",
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token") || sessionStorage.getItem("token")
              }`,
            },
          }
        );
        const contactsData = response.data.data || response.data || [];
        setContacts(contactsData);
      } catch (error) {
        console.error(
          "Error fetching contacts:",
          error.response || error.message
        );
        setError("Error fetching contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    fetchContacts();
  }, []);

  if (loading)
    return <p className="text-center text-blue-500">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const courseSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const reviewSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Banner */}
      <header className="relative bg-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Học tập mọi lúc, mọi nơi</h1>
        <p className="mt-3 text-lg">
          Truy cập hàng ngàn khóa học chất lượng từ các giảng viên hàng đầu.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition duration-300"
        >
          Bắt đầu học ngay
        </Link>
      </header>

      {/* Danh sách khóa học phổ biến */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Khóa học phổ biến
        </h2>
        <Slider {...courseSettings} className="mt-8">
          {courses.map((course) => (
            <div key={course._id} className="px-2">
              <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col justify-between min-h-[400px] transform transition-transform duration-300 hover:scale-105">
                <div>
                  <img
                    src={course.image}
                    alt={course.title}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mt-2 line-clamp-1">
                    {course.description}
                  </p>
                </div>
                <Link
                  to={`/courses/detail/${course._id}`}
                  className="block mt-4 text-blue-600 font-medium hover:underline"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Giới thiệu về nền tảng */}
      <section className="bg-gray-200 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Về LMS Learning</h2>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          Chúng tôi mang đến các khóa học chất lượng cao từ các chuyên gia trong
          nhiều lĩnh vực khác nhau, giúp bạn phát triển kỹ năng và kiến thức
          nhanh chóng.
        </p>
      </section>

      {/* Đánh giá từ học viên */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Học viên nói gì về chúng tôi?
        </h2>
        <Slider {...reviewSettings} className="mt-8">
          {contacts.map((contact) => (
            <div key={contact._id} className="px-2">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <p className="text-gray-700 text-center mb-4">
                  "{contact.message}"
                </p>
                <div className="flex items-center">
                  <img
                    src={contact.userId?.avatar || ""}
                    alt={contact.userId?.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="ml-3 text-center">
                    <p className="font-semibold">{contact.userId?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
