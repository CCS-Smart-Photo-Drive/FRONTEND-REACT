import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "../config";

export const NavbarUser = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("email");
    localStorage.removeItem("profile_picture");
    onLogout();
    fetch(`${API_URL(window.location.href)}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      mode: "cors",
      
    });
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black bg-opacity-80 shadow-lg z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img
              src="../logo.png" // Replace with the actual path to your logo
              alt="Creating Computing Society Logo"
              className="w-20 h-20" // Adjust size as needed
            />
            <a 
              href="https://smartdrive.ccstiet.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 hover:underline"
            >
              SmartPhotoDrive
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-8">
          <motion.a whileHover={{ scale: 1.1 }} href={`/about-us`} className="text-gray-300 hover:text-white transition duration-200 font-medium">
            About Us
          </motion.a>
        </div>
            <button
              onClick={() => navigate("/events")}
              className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150 rounded-md"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Events
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150 rounded-md"
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-red-400 hover:text-white hover:bg-red-600 transition duration-150 rounded-md"
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
