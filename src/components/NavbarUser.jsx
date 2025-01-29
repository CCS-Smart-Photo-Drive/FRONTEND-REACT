import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, User } from "lucide-react";

const NavbarUser = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profilePicture");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-white">PhotoDrive</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/events")}
              className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Events
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150"
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-red-400 hover:text-white hover:bg-red-600 transition duration-150"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUser;
