import React from "react";
import { motion } from "framer-motion";
import { Camera, Image, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
const SmartPhotoDriveHome = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate("/user/login");
  };

  const handleUserLogin = () => {
    navigate("/user/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      {/* Navigation */}

      <nav className="fixed top-0 w-full bg-black bg-opacity-80 shadow-xl z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500"
            >
              SmartPhotoDrive
            </motion.div>

            <div className="hidden md:flex space-x-8">
              {["About Us"].map((item, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  href={`/about-us`}
                  className="text-gray-300 hover:text-white transition duration-200 font-medium"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleUserLogin}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
              >
                User Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAdminLogin}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
              >
                Admin Login
              </motion.button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <header className="relative pt-24 pb-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 opacity-20 blur-3xl -z-10"></div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
        >
          Create. Curate. Share.
        </motion.h1>
        <p className="text-lg text-gray-300 mt-4">
          Revolutionize the way you store and showcase your memories.
        </p>
        <motion.button
          whileHover={{
            backgroundColor: ["#4f46e5", "#22d3ee", "#4f46e5"],
            transition: { duration: 0.5, repeat: Infinity },
          }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          Get Started
        </motion.button>
      </header>

      {/* How It Works Section */}
      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-12"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "Capture",
                description: "Upload your stunning photos seamlessly.",
              },
              {
                icon: Image,
                title: "Organize",
                description: "Smart AI tools to keep your gallery tidy.",
              },
              {
                icon: Globe,
                title: "Share",
                description: "Broadcast your creativity to the world.",
              },
            ].map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <Icon className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {title}
                </h3>
                <p className="text-gray-200">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-12"
          >
            Featured Gallery
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-tr from-teal-400 to-purple-500 rounded-lg aspect-video shadow-lg"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white text-lg font-medium">Photo {item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SmartPhotoDriveHome;
