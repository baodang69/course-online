import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Users,
  Book, // Change Notebook to Book
  LogOut,
  MessageSquare,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col justify-between shadow-lg sticky top-0">
        <div>
          <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
          <nav className="space-y-2">
            <NavItem to="/admin" icon={Home} text="Dashboard" />
            <NavItem to="/admin/users" icon={Users} text="Người dùng" />
            <NavItem to="/admin/courses" icon={BookOpen} text="Khóa học" />
            <NavItem to="/admin/lessons" icon={Book} text="Bài học" />{" "}
            {/* Update this line */}
            <NavItem
              to="/admin/contacts"
              icon={MessageSquare}
              text="Phản hồi"
            />
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="mt-auto border-t border-gray-700 pt-4 sticky bottom-0">
          {" "}
          {/* Thêm sticky bottom-0 */}
          <p className="text-gray-400 mb-2">Xin chào, Admin</p>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-gray-300 w-full text-left"
          >
            <LogOut size={20} /> <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

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
