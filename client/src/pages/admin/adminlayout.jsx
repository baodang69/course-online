import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, BookOpen, Users, Notebook, LogOut } from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate(); // Hook để chuyển trang

  const handleLogout = () => {
    // Xóa token hoặc session (tùy vào cách bạn lưu trạng thái đăng nhập)
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Xóa thông tin user nếu có
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user"); // Nếu bạn lưu trong sessionStorage

    // Chuyển hướng về trang đăng nhập
    navigate("/auth");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
          <nav className="space-y-2">
            <NavItem to="/admin" icon={Home} text="Dashboard" />
            <NavItem to="/admin/users" icon={Users} text="Người dùng" />
            <NavItem to="/admin/courses" icon={BookOpen} text="Khóa học" />
            <NavItem to="/admin/lessons" icon={Notebook} text="Bài học" />
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="mt-auto border-t border-gray-700 pt-4">
          <p className="text-gray-400 mb-2">Xin chào, User</p>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-gray-300 w-full text-left"
          >
            <LogOut size={20} /> <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

// Component menu item
const NavItem = ({ to, icon: Icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gray-800 text-white"
            : "hover:bg-gray-700 hover:text-gray-300"
        }`
      }
    >
      <Icon size={20} /> <span>{text}</span>
    </NavLink>
  );
};

export default AdminLayout;
