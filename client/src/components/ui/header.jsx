// components/Header.js
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, User, Cat } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth"); // Add navigation after logout
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-2">
        <Cat className="h-8 w-8 text-blue-500" />
        <span className="font-bold text-xl text-gray-900">LeOn</span>
      </Link>
      <div className="flex items-center space-x-6">
        <Link to="/courses" className="text-gray-700 hover:text-blue-500">
          Khóa học
        </Link>
        <Link to="/" className="text-gray-700 hover:text-blue-500">
          Giới thiệu
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-blue-500">
          Liên hệ
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {user ? (
              <>
                <DropdownMenuItem asChild>
                  <Link to={`/userprofile/${user._id}`} className="w-full">
                    Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Đăng xuất
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link to="/auth" className="w-full">
                  Đăng nhập
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Header;
