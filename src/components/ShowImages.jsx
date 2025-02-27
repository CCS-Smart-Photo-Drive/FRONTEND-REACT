// import { useLocation } from "react-router-dom";
// import NavbarAdmin from "./NavbarAdmin";
// import NavbarUser from "./NavbarUser";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// const ShowImages = () => {
//     const location = useLocation();
//     const { imageUrls = [] } = location.state || {}; // Default to empty array

//     // Function to download an image
//     const downloadImage = (url, index) => {
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = `event_image_${index + 1}.jpg`; // Customize filename
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     const [loggedIn, setLoggedIn] = useState("none");
    
//       const clientId = '679a6500b3cee642388a3e77'; 
//       const handleLogin = () => {
//         const authUrl = `https://auth.ccstiet.com/auth/google?clientid=${clientId}&callback=${window.location.href}verify_login`;
//         window.location.href = authUrl;
//       };
    
//       useEffect(() => {
//         (async () => {
//           const response = await fetch(`https://api-smartdrive.ccstiet.com/get_user_status`, {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//             mode: "cors",
//           });
//           console.log(await response.clone().text())
//           if (!response.ok) {
//             console.log('set: none');
//             setLoggedIn("none");
//             return;
//           }
//           const data = await response.json();
//           if (data.status) {
//             console.log('set: admin');
//             setLoggedIn("admin");
//           } else {
//             console.log('set: user');
//             setLoggedIn("user");
//           }
//         })();
//       }, []);
    

//     let navbar;
//     console.log(loggedIn);
//     if (loggedIn == "admin") {
//         navbar = <NavbarAdmin onLogout={() => setLoggedIn("none")} />;
//     } else if (loggedIn == "user") {
//         navbar = <NavbarUser onLogout={() => setLoggedIn("none")} />;
//     } else {
//         navbar = (
//         <nav className="fixed top-0 w-full bg-opacity-30 backdrop-blur-md shadow-xl z-50 py-4 border-b border-gray-800">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
//             <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center space-x-3">
//             <img src="/logo.png" alt="SmartPhotoDrive" className="w-12 h-12" />
//             <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
//                 SmartPhotoDrive
//             </span>
//             </motion.div>
//             <div className="flex space-x-4">
//             <motion.a whileHover={{ scale: 1.1 }} href={`/about-us`} className="text-gray-300 hover:text-white transition duration-200 font-medium">
//                 About Us
//             </motion.a>
//             </div>
//             <div className="flex space-x-4">
//             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleLogin()} className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
//                 Login
//             </motion.button>
//             </div>
//         </div>
//         </nav>
//         )
//   }

//     return (
//         <div className="flex flex-wrap gap-4 p-4">
//             {navbar}
//             {imageUrls.length === 0 ? (
//                 <p className="text-gray-500">No images available.</p>
//             ) : (
                
//                 imageUrls.map((url, index) => (
//                     <div key={index}>
//                       <img
//                         src={url}
//                         alt={`Event Image ${index + 1}`}
//                         className="w-[300px] h-auto rounded-lg shadow-lg"
//                       />
//                       <a href={url} download={`event-image-${index}.jpg`}>
//                         <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
//                           Download
//                         </button>
//                       </a>
//                     </div>
//                   ))
                  
//             )}
//         </div>
//     );
// };

// export default ShowImages;


import { useLocation } from "react-router-dom";
import NavbarAdmin from "./NavbarAdmin";
import NavbarUser from "./NavbarUser";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ShowImages = () => {
  const location = useLocation();
  const { imageUrls = [] } = location.state || {}; // Default to empty array
//   const [loggedIn, setLoggedIn] = useState("none");

//   const clientId = "679a6500b3cee642388a3e77";
//   const handleLogin = () => {
//     const authUrl = `https://auth.ccstiet.com/auth/google?clientid=${clientId}&callback=${window.location.href}verify_login`;
//     window.location.href = authUrl;
//   };

//   useEffect(() => {
//     (async () => {
//       const response = await fetch(`https://api-smartdrive.ccstiet.com/get_user_status`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         mode: "cors",
//       });
//       console.log(await response.clone().text());
//       if (!response.ok) {
//         console.log("set: none");
//         setLoggedIn("none");
//         return;
//       }
//       const data = await response.json();
//       if (data.status) {
//         console.log("set: admin");
//         setLoggedIn("admin");
//       } else {
//         console.log("set: user");
//         setLoggedIn("user");
//       }
//     })();
//   }, []);

//   let navbar;
//   if (loggedIn === "admin") {
//     navbar = <NavbarAdmin onLogout={() => setLoggedIn("none")} />;
//   } else if (loggedIn === "user") {
//     navbar = <NavbarUser onLogout={() => setLoggedIn("none")} />;
//   } else {
//     navbar = (
//       <nav className="fixed top-0 w-full bg-opacity-30 backdrop-blur-md shadow-xl z-50 py-4 border-b border-gray-800">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
//           <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center space-x-3">
//             <img src="/logo.png" alt="SmartPhotoDrive" className="w-12 h-12" />
//             <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
//               SmartPhotoDrive
//             </span>
//           </motion.div>
//           <div className="flex space-x-4">
//             <motion.a whileHover={{ scale: 1.1 }} href={`/about-us`} className="text-gray-300 hover:text-white transition duration-200 font-medium">
//               About Us
//             </motion.a>
//           </div>
//           <div className="flex space-x-4">
//             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleLogin} className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
//               Login
//             </motion.button>
//           </div>
//         </div>
//       </nav>
//     );
//   }


    const [loggedIn, setLoggedIn] = useState("none");
    
      const clientId = '679a6500b3cee642388a3e77'; 
      const handleLogin = () => {
        const authUrl = `https://auth.ccstiet.com/auth/google?clientid=${clientId}&callback=${window.location.href}verify_login`;
        window.location.href = authUrl;
      };
    
      useEffect(() => {
        (async () => {
          const response = await fetch(`https://api-smartdrive.ccstiet.com/get_user_status`, {
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
            {/* <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleLogin()} className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                Login
            </motion.button> */}
            </div>
        </div>
        </nav>
        )
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {navbar}
      <div className="max-w-7xl mx-auto px-4 py-16 ">
        <h1 className="text-4xl font-bold text-center mb-8"></h1>

        {imageUrls.length === 0 ? (
          <p className="text-gray-400 text-center">No images available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {imageUrls.map((url, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
                <img  src={url} alt={`Event Image ${index + 1}`} className="w-full h-auto rounded-lg shadow-lg object-cover object-centre" />
                <a href={url} download={`event-image-${index + 1}.jpg`} className="w-full mt-2">
                  <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
                    Download
                  </button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowImages;
