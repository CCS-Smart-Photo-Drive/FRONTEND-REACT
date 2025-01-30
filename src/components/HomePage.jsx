// import React from "react";
// import { motion } from "framer-motion";
// import { Camera, Image, Globe } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// const SmartPhotoDriveHome = () => {
//   const navigate = useNavigate();

//   const handleAdminLogin = () => {
//     navigate("/user/login");
//   };

//   const handleUserLogin = () => {
//     navigate("/user/login");
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
//       {/* Navigation */}

//       <nav className="fixed top-0 w-full bg-black bg-opacity-80 shadow-xl z-50">
//         <div className="max-w-7xl mx-auto px-6 sm:px-8">
//           <div className="flex items-center justify-between h-16">
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500"
//             >
//               SmartPhotoDrive
//             </motion.div>

//             <div className="hidden md:flex space-x-8">
//               {["About Us"].map((item, i) => (
//                 <motion.a
//                   key={i}
//                   whileHover={{ scale: 1.1 }}
//                   href={`/about-us`}
//                   className="text-gray-300 hover:text-white transition duration-200 font-medium"
//                 >
//                   {item}
//                 </motion.a>
//               ))}
//             </div>

//             <div className="flex space-x-4">
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={handleUserLogin}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
//               >
//                 User Login
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={handleAdminLogin}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
//               >
//                 Admin Login
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </nav>
//       {/* Hero Section */}
//       <header className="relative pt-24 pb-20 text-center">
//         <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 opacity-20 blur-3xl -z-10"></div>
//         <motion.h1
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1 }}
//           className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
//         >
//           Create. Curate. Share.
//         </motion.h1>
//         <p className="text-lg text-gray-300 mt-4">
//           Revolutionize the way you store and showcase your memories.
//         </p>
//         <motion.button
//           whileHover={{
//             backgroundColor: ["#4f46e5", "#22d3ee", "#4f46e5"],
//             transition: { duration: 0.5, repeat: Infinity },
//           }}
//           whileTap={{ scale: 0.9 }}
//           className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-lg hover:bg-indigo-700 transition duration-300"
//         >
//           Get Started
//         </motion.button>
//       </header>

//       {/* How It Works Section */}
//       <section id="features" className="py-16">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="text-4xl font-bold text-white mb-12"
//           >
//             How It Works
//           </motion.h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Camera,
//                 title: "Capture",
//                 description: "Upload your stunning photos seamlessly.",
//               },
//               {
//                 icon: Image,
//                 title: "Organize",
//                 description: "Smart AI tools to keep your gallery tidy.",
//               },
//               {
//                 icon: Globe,
//                 title: "Share",
//                 description: "Broadcast your creativity to the world.",
//               },
//             ].map(({ icon: Icon, title, description }, i) => (
//               <motion.div
//                 key={i}
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
//               >
//                 <Icon className="w-12 h-12 text-white mx-auto mb-4" />
//                 <h3 className="text-2xl font-semibold text-white mb-2">
//                   {title}
//                 </h3>
//                 <p className="text-gray-200">{description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Gallery Preview */}
//       <section id="gallery" className="py-16 bg-black">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="text-4xl font-bold text-white mb-12"
//           >
//             Featured Gallery
//           </motion.h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6].map((item) => (
//               <motion.div
//                 key={item}
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gradient-to-tr from-teal-400 to-purple-500 rounded-lg aspect-video shadow-lg"
//               >
//                 <div className="w-full h-full flex items-center justify-center">
//                   <p className="text-white text-lg font-medium">Photo {item}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default SmartPhotoDriveHome;


import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Image, Globe } from "lucide-react";

const FuturisticHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative">
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black"></div>
      <nav className="fixed top-0 w-full bg-opacity-30 backdrop-blur-md shadow-xl z-50 py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center space-x-3">
            <img src="/logo.png" alt="SmartPhotoDrive" className="w-12 h-12" />
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              SmartPhotoDrive
            </span>
          </motion.div>
          <div className="hidden md:flex space-x-8">
            <motion.a whileHover={{ scale: 1.1 }} href={`/about-us`} className="text-gray-300 hover:text-white transition duration-200 font-medium">
              About Us
            </motion.a>
          </div>
          <div className="flex space-x-4">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/user/login")} className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              User Login
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/admin/login")} className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              Admin Login
            </motion.button>
          </div>
        </div>
      </nav>

      <header className="relative pt-40 pb-24 text-center z-10">
        <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600">
          Capture. Organize. Share.
        </motion.h1>
        <p className="text-xl text-gray-300 mt-4 max-w-2xl mx-auto">
          AI-driven photo retrieval and management, built for seamless experiences.
        </p>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mt-8 px-12 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition duration-300">
          Get Started
        </motion.button>
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
              <img src="your-image-1.jpg" alt="Computing Society Event 1" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-0 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xl font-semibold">Event 1</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img src="your-image-2.jpg" alt="Computing Society Event 2" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-0 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xl font-semibold">Event 2</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img src="your-image-3.jpg" alt="Computing Society Event 3" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-0 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xl font-semibold">Event 3</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black text-center text-gray-400">
        <p>&copy; 2025 SmartPhotoDrive. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FuturisticHome;
