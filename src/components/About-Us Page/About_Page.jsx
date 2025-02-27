import React, { useEffect, useState } from 'react'
import AboutSection from './AboutSection'
import Contributor from './Contributor'
// import ExecutiveBoard from './ExecutiveBoard'
import Header from './Header'
import Footer from './Footer'
import { NavbarUser } from "../NavbarUser";
import { NavbarAdmin } from "../NavbarAdmin";
import { API_URL } from '../../config'
import { motion } from "framer-motion";


function About_Page() {

    const [loggedIn, setLoggedIn] = useState("none");
  
    const clientId = '679a6500b3cee642388a3e77'; 
    const handleLogin = () => {
      const authUrl = `https://auth.ccstiet.com/auth/google?clientid=${clientId}&callback=https://smartdrive.ccstiet.com/verify_login`;
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
          <a 
            href="/"
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 hover:underline"
          >
            SmartPhotoDrive
          </a>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <motion.a whileHover={{ scale: 1.1 }} href={`/`} className="text-gray-300 hover:text-white transition duration-200 font-medium mr-2">
            Home
          </motion.a>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleLogin} className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            Login
          </motion.button>
        </div>
      </div>
    </nav>
    )
  }

  return (
    <>
    <div>
      {navbar}
      <Header/>
      <AboutSection/> 
      <Contributor/>
      {/* <ExecutiveBoa9rd/> */}
      <Footer/>
    </div>
    </>
  )
}

export default About_Page
