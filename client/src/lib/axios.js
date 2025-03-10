import axios from "axios";

// ✅ Lấy token từ cookie hoặc localStorage
const getToken = () => {
  return localStorage.getItem("token") || ""; // Hoặc lấy từ cookies nếu dùng cookies
};

// 📌 Cấu hình Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Thay URL API của bạn
  withCredentials: true, // 🔥 Cho phép gửi cookie
});

// 📌 Thêm token vào headers cho mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
