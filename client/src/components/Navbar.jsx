import { LogOut, MessageSquare, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { useEffect, useState } from "react";
import { getUsers, setSelectedUser } from "../store/slices/chatSlice";

export const Navbar = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.chat);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (authUser) {
      dispatch(getUsers());
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const filtered = users.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user));
    setSearchTerm("");
    setFilteredUsers([]);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full gap-2">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">Talkie</h1>
            </Link>
          </div>

          {/* 🔍 Search */}
          <div className="relative flex items-center w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Search className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-3 py-1.5 w-full rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Dropdown */}
            {filteredUsers.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-md rounded-md mt-1 max-h-60 overflow-y-auto z-50">
                {filteredUsers.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2 items-center"
                  >
                    <img
                      src={user?.avatar?.url || "/avatar-holder.avif"}
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover border"
                    />
                    <span className="text-sm text-gray-800">{user.fullName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Info + Logout (always visible) */}
          {authUser && (
            <div className="flex items-center gap-4 ml-2"><Link to='/profile'>

              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <img
                  src={authUser?.avatar?.url || "/avatar-holder.avif"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span className="block truncate max-w-[100px]">{authUser.fullName}</span>
              </div>
            </Link>
              <button
                onClick={handleLogout}
                className="text-red-700 hover:bg-red-100 transition inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};