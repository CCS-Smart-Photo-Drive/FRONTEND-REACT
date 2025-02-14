import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Calendar, User } from "lucide-react";
import { API_URL } from "../config";

export const NavbarAdmin = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("email");
    localStorage.removeItem("profile_picture");
    onLogout();
    fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      mode: "cors",
      
    });
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black bg-opacity-80 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-white">SmartPhotoDrive</span>
            </div>
            <div className="flex items-center space-x-6">
{/* Navigation Links */}
<button
                onClick={() => navigate("/manager_dashboard")}
                className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150 rounded-md"
              >
                <User className="w-5 h-5 mr-2" />
                Dashboard
              </button>
              <div className="hidden md:flex space-x-8">
          <motion.a whileHover={{ scale: 1.1 }} href={`/about-us`} className="text-gray-300 hover:text-white transition duration-200 font-medium">
            About Us
          </motion.a>
        </div>
            <div className="flex items-center space-x-4">
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
        </div>
      </nav>
  );
};

export default NavbarAdmin;
