import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import { Camera, Image, Globe } from "lucide-react";
import { NavbarUser } from "./NavbarUser";
import { NavbarAdmin } from "./NavbarAdmin";

import { API_URL } from "../config";

const FuturisticHome = () => {
  const [loggedIn, setLoggedIn] = useState("none");

  const clientId = '679a6500b3cee642388a3e77'; 
  const handleLogin = () => {
    const authUrl = `https://auth.ccstiet.com/auth/google?clientid=${clientId}&callback=${window.location.href}verify_login`;
    window.location.href = authUrl;
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_URL(window.location.href)}/get_user_status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
      });
      console.log(await response.clone().text())
      if (!response.ok) {
        console.log('set: none');
        setLoggedIn("none");
        return;
      }
      const data = await response.json();
      if (data.status) {
        console.log('set: admin');
        setLoggedIn("admin");
      } else {
        console.log('set: user');
        setLoggedIn("user");
      }
    })();
  }, []);

  let navbar;
  console.log(loggedIn);
  if (loggedIn == "admin") {
    navbar = <NavbarAdmin onLogout={() => setLoggedIn("none")} />;
  } else if (loggedIn == "user") {
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
        <div className="flex space-x-4">
          <motion.a whileHover={{ scale: 1.1 }} href={`/about-us`} className="text-gray-300 hover:text-white transition duration-200 font-medium">
            About Us
          </motion.a>
        </div>
        <div className="flex space-x-4">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleLogin()} className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            Login
          </motion.button>
        </div>
      </div>
    </nav>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative">
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black"></div>
      {navbar}
      <header className="relative pt-40 pb-24 text-center z-10">
        <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600">
          Capture. Organize. Share.
        </motion.h1>
        <p className="text-xl text-gray-300 mt-4 max-w-2xl mx-auto">
          AI-driven photo retrieval and management, built for seamless experiences.
        </p>
        {/* <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mt-8 px-12 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition duration-300">
          Get Started
        </motion.button> */}
      </header>

      <section id="features" className="py-16 text-center z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-4xl font-bold text-white mb-12">
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[ 
              { icon: Camera, title: "Capture", description: "Upload event photos seamlessly." },
              { icon: Image, title: "Organize", description: "AI-powered matching for instant retrieval." },
              { icon: Globe, title: "Share", description: "Download and share your memories." }
            ].map((item, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-teal-600 to-cyan-500 p-10 rounded-lg shadow-xl hover:shadow-2xl">
                <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-lg text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Computing Society Showcase */}
      <section id="society-showcase" className="py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl font-bold text-white mb-12">
            Meet Our Computing Society
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div whileHover={{ scale: 1.05 }} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img src="../photo4.png" alt="Computing Society Event 1" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-0 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xl font-semibold"></p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img src="../photo1.jpeg" alt="Computing Society Event 2" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-0 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xl font-semibold"></p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img src="../logo.png" alt="Computing Society Event 3" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-0 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xl font-semibold"></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black text-center text-gray-400">
        <p>&copy; Team CCS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FuturisticHome;
