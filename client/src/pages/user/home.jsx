import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import Header from "../../components/ui/header";
import Footer from "../../components/ui/footer";
import axios from "../../lib/axios";
import { GraduationCap, Users, BookOpen, Award } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const features = [
    {
      title: "Lộ trình học tập rõ ràng",
      description:
        "Từ người mới bắt đầu đến chuyên gia với lộ trình được thiết kế chi tiết và khoa học",
    },
    {
      title: "Kỹ năng toàn diện",
      description:
        "Trang bị đầy đủ các kỹ năng từ cơ bản đến nâng cao của một lập trình viên chuyên nghiệp",
    },
    {
      title: "Thực hành thực tế",
      description:
        "Học thông qua các dự án thực tế, giúp bạn nắm vững kiến thức và có sản phẩm thực tế",
    },
    {
      title: "Cộng đồng hỗ trợ",
      description:
        "Tham gia cộng đồng học tập sôi nổi, nhận được sự hỗ trợ từ giảng viên và học viên khác",
    },
    {
      title: "Chứng chỉ giá trị",
      description:
        "Nhận chứng chỉ có giá trị sau khi hoàn thành khóa học, tăng cơ hội việc làm",
    },
    {
      title: "Học mọi lúc mọi nơi",
      description:
        "Nội dung học tập đa dạng, có thể truy cập mọi lúc mọi nơi trên mọi thiết bị",
    },
  ];

  if (loading)
    return <p className="text-center text-blue-500">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const courseSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
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
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const stats = [
    { icon: <Users size={40} />, count: "5+", label: "Học viên" },
    { icon: <BookOpen size={40} />, count: "10+", label: "Khóa học" },
    { icon: <GraduationCap size={40} />, count: "1+", label: "Giảng viên" },
    { icon: <Award size={40} />, count: "90%", label: "Học viên hài lòng" },
  ];

  const handleCourseClick = (courseId) => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Vui lòng đăng nhập để xem chi tiết khóa học");
      navigate("/auth");
      return;
    }
    navigate(`/courses/detail/${courseId}`);
  };
  const handleStartClick = (courseId) => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Vui lòng đăng nhập để xem chi tiết khóa học");
      navigate("/auth");
      return;
    }
    navigate(`/courses`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('/path/to/pattern.svg')] opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Khám Phá Tri Thức Không Giới Hạn
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Nền tảng học tập trực tuyến hàng đầu với các khóa học chất lượng từ
            các chuyên gia
          </p>
          <div className="flex justify-center">
            {" "}
            {/* Thêm div để căn giữa */}
            <Button
              onClick={handleStartClick}
              className="text-2xl bg-white text-blue-600 px-16 py-8 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Bắt đầu học ngay
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4 text-blue-600">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.count}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Thêm phần này sau Stats Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Tại sao chọn LeOn?
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Nền tảng học tập trực tuyến hàng đầu giúp bạn phát triển sự nghiệp
            trong lĩnh vực công nghệ
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Thêm section Why Choose Us */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Đào tạo lập trình viên chuyên nghiệp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-semibold">Phát triển toàn diện</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Nắm vững kiến thức nền tảng lập trình</li>
                <li>• Thành thạo các công nghệ hot nhất hiện nay</li>
                <li>• Rèn luyện tư duy giải quyết vấn đề</li>
                <li>• Phát triển kỹ năng làm việc nhóm</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-semibold">Sẵn sàng để đi làm</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Xây dựng portfolio cá nhân ấn tượng</li>
                <li>• Thực hành với dự án thực tế</li>
                <li>• Được định hướng nghề nghiệp rõ ràng</li>
                <li>• Cơ hội việc làm hấp dẫn</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Khóa Học Nổi Bật
          </h2>
          <Slider {...courseSettings} className="course-slider">
            {courses.map((course) => (
              <div key={course._id} className="px-3">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-semibold">
                        {course.price === 0
                          ? "Miễn phí"
                          : `${course.price.toLocaleString()} VND`}
                      </span>
                      <Button
                        onClick={() => handleCourseClick(course._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Học Viên Nói Gì Về Chúng Tôi?
          </h2>
          <Slider {...reviewSettings}>
            {contacts.map((contact) => (
              <div key={contact._id} className="px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center mb-6">
                    <img
                      src={contact.userId?.avatar || "/default-avatar.png"}
                      alt={contact.userId?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="text-xl font-semibold">
                        {contact.userId?.name}
                      </h4>
                      <p className="text-gray-600">Học viên</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg italic">
                    "{contact.message}"
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
