import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../store/slices/chatSlice";

export const ChatHeader = () => {
  const { selectedUser } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setSelectedUser(null));
  };

  const isOnline = onlineUsers.includes(selectedUser?._id);

  return (
    <header className="h-16 w-full border-b border-gray-200 px-4 flex items-center justify-between bg-white">
      {/* Left: User Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden border">
          <img
            src={selectedUser?.avatar?.url || "/avatar-holder.avif"}
            alt="avatar"
            className="w-full h-full object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">{selectedUser?.fullName}</h2>
          <p className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      {/* Right: Close button (for mobile/small screens) */}
      <button className="lg:hidden" onClick={handleClose}>
        <X className="w-5 h-5 text-gray-600" />
      </button>
    </header>
  );
};
