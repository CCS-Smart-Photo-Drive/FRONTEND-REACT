import { useLocation } from "react-router-dom";
import NavbarAdmin from "./NavbarAdmin";
import NavbarUser from "./NavbarUser";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ShowImages = () => {
  const location = useLocation();
  const { imageUrls = [] } = location.state || {}; // Default to empty array
  const [loggedIn, setLoggedIn] = useState("none");
  
  useEffect(() => {
    (async () => {
      const response = await fetch("https://api-smartdrive.ccstiet.com/get_user_status", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
      });
      
      if (!response.ok) {
        setLoggedIn("none");
        return;
      }
      
      const data = await response.json();
      setLoggedIn(data.status ? "admin" : "user");
    })();
  }, []);

  let navbar;
  if (loggedIn === "admin") {
    navbar = <NavbarAdmin onLogout={() => setLoggedIn("none")} />;
  } else if (loggedIn === "user") {
    navbar = <NavbarUser onLogout={() => setLoggedIn("none")} />;
  } else {
    navbar = (
      <nav className="fixed top-0 w-full bg-opacity-30 backdrop-blur-md shadow-xl z-50 py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center space-x-3">
            <img src="/logo.png" alt="SmartPhotoDrive" className="w-12 h-12" />
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              SmartPhotoDrive
            </span>
          </motion.div>
          <motion.a whileHover={{ scale: 1.1 }} href="/about-us" className="text-gray-300 hover:text-white transition duration-200 font-medium">
            About Us
          </motion.a>
        </div>
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {navbar}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8"></h1>

        {imageUrls.length === 0 ? (
          <p className="text-gray-400 text-center">No images available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
                <a href={url} target="_blank" rel="noopener noreferrer" className="absolute top-2 left-2 bg-green-700 p-2 rounded-full hover:bg-gray-600 transition">
                  ⬇️
                </a>
                <img src={url} alt={`Event Image ${index + 1}`} className="w-full h-auto rounded-lg shadow-lg object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowImages;
