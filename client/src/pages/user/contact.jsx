import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "../../components/ui/header";
import Footer from "../../components/ui/footer";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 shadow-lg">
            <div className="text-center mb-8">
              <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800">
                Phản Hồi & Đánh Giá
              </h1>
              <p className="text-gray-600 mt-2">
                Chia sẻ trải nghiệm học tập của bạn để chúng tôi có thể cải
                thiện tốt hơn
              </p>
            </div>

            {nextAvailableDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-yellow-50 rounded-lg flex items-center gap-3"
              >
                <Clock className="w-5 h-5 text-yellow-600" />
                <p className="text-yellow-700">
                  Bạn có thể gửi phản hồi tiếp theo vào ngày{" "}
                  {new Date(nextAvailableDate).toLocaleDateString()}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Chia sẻ cảm nghĩ của bạn về khóa học..."
                  required
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-none"
                  style={{ transition: "all 0.3s ease" }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                }`}
              >
                <Send className={`w-5 h-5 ${loading ? "animate-pulse" : ""}`} />
                {loading ? "Đang gửi..." : "Gửi phản hồi"}
              </motion.button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              * Mỗi học viên chỉ có thể gửi một phản hồi trong vòng 3 tháng
            </p>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
