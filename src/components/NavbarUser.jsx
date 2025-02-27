import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, User, Menu, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../config";

export const NavbarUser = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              src="../logo.png"
              alt="Creating Computing Society Logo"
              className="w-12 h-12"
            />
            <a
              href="https://smartdrive.ccstiet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 hover:underline"
            >
              SmartPhotoDrive <span className="text-sm font-medium text-gray-300">(Beta)</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.a whileHover={{ scale: 1.1 }} href="/about" className="text-gray-300 hover:text-white transition duration-200 font-medium">
              About Us
            </motion.a>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 focus:outline-none">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black bg-opacity-90 py-4 px-6"
          >
            <div className="flex flex-col space-y-4">
              <button onClick={() => navigate("/about")} className="text-gray-300 hover:text-white transition duration-200 flex items-center">
                <Info className="w-5 h-5 mr-2" /> About Us
              </button>
              <button onClick={() => navigate("/events")} className="text-gray-300 hover:text-white transition duration-200 flex items-center">
                <Calendar className="w-5 h-5 mr-2" /> Events
              </button>
              <button onClick={() => navigate("/profile")} className="text-gray-300 hover:text-white transition duration-200 flex items-center">
                <User className="w-5 h-5 mr-2" /> Profile
              </button>
              <button onClick={handleLogout} className="text-red-400 hover:text-white transition duration-200 flex items-center">
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarUser;
