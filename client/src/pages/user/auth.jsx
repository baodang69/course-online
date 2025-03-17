import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../../lib/axios";
import { GraduationCap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import Header from "@/components/ui/header";

const API_BASE_URL = "http://localhost:5000/api";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const navigate = useNavigate();

  function handleTabChange(value) {
    setActiveTab(value);
    setFormData({ name: "", email: "", password: "", rePassword: "" });
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleRegister() {
    if (formData.password !== formData.rePassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setActiveTab("signin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    }
  }

  async function handleLogin() {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email: formData.email,
        password: formData.password,
      });

      toast.success("Đăng nhập thành công!");
      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      const roleRes = await axios.get(`${API_BASE_URL}/role`);
      const roles = roleRes.data;

      console.log("User Role:", user.role);
      console.log("Roles:", roles);

      const userRoleId = user.role._id;
      const userRoleName = roles.find(
        (role) => role._id === userRoleId
      )?.roleName;
      console.log("User Role Name:", userRoleName);

      if (userRoleName === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại!");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster position="top-right" />
      <Header />

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="shadow-lg border-0">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Đăng nhập
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Đăng ký
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <CardHeader>
                  <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                  <CardDescription>
                    Đăng nhập để truy cập vào tài khoản của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    Đăng nhập
                  </Button>
                </CardFooter>
              </TabsContent>

              <TabsContent value="signup">
                <CardHeader>
                  <CardTitle className="text-2xl">Đăng ký</CardTitle>
                  <CardDescription>
                    Tạo tài khoản mới để bắt đầu học tập
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và Tên</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rePassword">Nhập lại mật khẩu</Label>
                    <Input
                      id="rePassword"
                      type="password"
                      value={formData.rePassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleRegister}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    Đăng ký
                  </Button>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
