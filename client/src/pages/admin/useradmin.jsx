import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import UserCard from "@/components/ui/usercard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách người dùng");
    }
  };

  const handleBan = async (id, isBanned) => {
    const confirmMessage = isBanned
      ? "Bạn có chắc chắn muốn mở khóa người dùng này?"
      : "Bạn có chắc chắn muốn khóa người dùng này?";

    if (window.confirm(confirmMessage)) {
      try {
        await axios.put(`http://localhost:5000/api/ban-user/${id}`);
        toast.success("Thay đổi trạng thái người dùng thành công");
        fetchUsers();
      } catch (error) {
        toast.error("Lỗi khi thay đổi trạng thái người dùng");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    if (user.role && user.role.roleName === "User") {
      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, "i");
        return searchRegex.test(user.name) || searchRegex.test(user.email);
      }
      return true;
    }
    return false;
  });

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Quản lý Người dùng</h2>
      <Input
        type="text"
        placeholder="Tìm kiếm người dùng..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onBan={handleBan}
            openUserDetails={openUserDetails}
          />
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thông tin người dùng</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div>
              <img
                src={selectedUser.avatar}
                alt={`${selectedUser.name}'s avatar`}
                className="w-20 h-20 rounded-full mb-4"
              />
              <p>Tên: {selectedUser.name}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Vai trò: {selectedUser.role?.roleName}</p>
              <p>Trạng thái: {selectedUser.isBanned ? "Banned" : "Normal"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAdmin;
