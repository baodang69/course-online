import { Link } from "react-router-dom";
import { GraduationCap, Star } from "lucide-react";
import { useState, useEffect } from "react";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-500" />
          <span className="font-bold text-xl text-gray-900">LMS Learning</span>
        </Link>
        <div className="space-x-6 hidden md:flex">
          <Link to="/courses" className="text-gray-700 hover:text-blue-500">
            Khóa học
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-500">
            Giới thiệu
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-500">
            Liên hệ
          </Link>
          {user ? (
            <span className="text-blue-600 font-medium">
              Xin chào, {user.name}!
            </span>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </nav>

      {/* Banner */}
      <header className="relative bg-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Học tập mọi lúc, mọi nơi</h1>
        <p className="mt-3 text-lg">
          Truy cập hàng ngàn khóa học chất lượng từ các giảng viên hàng đầu.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100"
        >
          Bắt đầu học ngay
        </Link>
      </header>

      {/* Danh sách khóa học phổ biến */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Khóa học phổ biến
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map((course) => (
            <div key={course} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={`https://source.unsplash.com/400x250/?learning,education${course}`}
                alt="Khóa học"
                className="rounded-lg"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                Tên khóa học {course}
              </h3>
              <p className="text-gray-600 mt-2">Mô tả ngắn gọn về khóa học.</p>
              <div className="flex items-center mt-3">
                <Star className="text-yellow-500" />
                <span className="ml-2 font-semibold">4.{course}/5</span>
              </div>
              <Link
                to="/courses"
                className="block mt-4 text-blue-600 font-medium hover:underline"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Giới thiệu về nền tảng */}
      <section className="bg-gray-200 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Về LMS Learning</h2>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          Chúng tôi mang đến các khóa học chất lượng cao từ các chuyên gia trong
          nhiều lĩnh vực khác nhau, giúp bạn phát triển kỹ năng và kiến thức
          nhanh chóng.
        </p>
      </section>

      {/* Đánh giá từ học viên */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Học viên nói gì về chúng tôi?
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {[1, 2].map((review) => (
            <div key={review} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700">
                "LMS Learning đã giúp tôi tiếp cận những kiến thức vô cùng hữu
                ích và thực tế."
              </p>
              <div className="mt-4 flex items-center">
                <img
                  src={`https://i.pravatar.cc/40?img=${review}`}
                  alt="Học viên"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="font-semibold">Người dùng {review}</p>
                  <div className="flex">
                    <Star className="text-yellow-500" />
                    <Star className="text-yellow-500" />
                    <Star className="text-yellow-500" />
                    <Star className="text-yellow-500" />
                    <Star className="text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>&copy; 2025 LMS Learning. All rights reserved.</p>
        <div className="mt-3 space-x-4">
          <Link to="/terms" className="text-gray-400 hover:underline">
            Điều khoản
          </Link>
          <Link to="/privacy" className="text-gray-400 hover:underline">
            Chính sách bảo mật
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
