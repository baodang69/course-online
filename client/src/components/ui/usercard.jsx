import { Button } from "@/components/ui/button";

const UserCard = ({ user, onBan, openUserDetails }) => {
  return (
    <div
      className="border rounded-lg p-4 flex items-center w-full cursor-pointer"
      onClick={() => openUserDetails(user)} // Gọi openUserDetails từ props
    >
      {user.avatar && (
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="w-20 h-20 rounded-full mr-4"
        />
      )}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold">{user.name}</h3>
        <p>{user.email}</p>
        <p
          className={`font-semibold ${
            user.isBanned ? "text-red-500" : "text-green-500"
          }`}
        >
          {user.isBanned ? "Banned" : "Normal"}
        </p>
        <Button
          variant={user.isBanned ? "default" : "destructive"}
          onClick={() => onBan(user._id, user.isBanned)}
          className="mt-2 w-fit"
        >
          {user.isBanned ? "Mở khóa" : "Khóa"}
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
