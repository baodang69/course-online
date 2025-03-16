import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "../../components/ui/header";
import Footer from "../../components/ui/footer";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextAvailableDate, setNextAvailableDate] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      console.log("Raw user data from localStorage:", userData); // Debug log

      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user data:", parsedUser); // Debug log

        if (parsedUser && parsedUser._id) {
          setUser(parsedUser);
          console.log("User state updated:", parsedUser);
        } else {
          console.error("Missing required user data. User data:", parsedUser);
        }
      } else {
        console.log("No user data found in localStorage");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("Current user state:", user); // Debug log

      if (!user || !user._id) {
        alert("Vui lòng đăng nhập để gửi tin nhắn.");
        return;
      }

      const token = localStorage.getItem("token"); // Get token separately
      if (!token) {
        alert("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/contact",
          { userId: user._id, message },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("");
        alert("Tin nhắn đã được gửi thành công!");
      } catch (error) {
        if (error.response?.data?.nextAvailableDate) {
          const nextDate = new Date(error.response.data.nextAvailableDate);
          setNextAvailableDate(nextDate);
          alert(
            `Bạn chỉ có thể gửi phản hồi một lần trong 3 tháng. Bạn có thể gửi lại vào ngày ${nextDate.toLocaleDateString()}`
          );
        } else {
          alert(error.response?.data?.message || "Gửi tin nhắn thất bại.");
        }
      } finally {
        setLoading(false);
      }
    },
    [user, message]
  );

  return (
    <>
      <Header></Header>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Để lại cảm nghĩ của bạn
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              required
              className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-400"
              rows="4"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 text-white rounded-md transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Đang gửi..." : "Gửi tin nhắn"}
            </button>
          </form>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Contact;
