// // import { useLocation } from "react-router-dom";
// // import NavbarAdmin from "./NavbarAdmin";
// // import NavbarUser from "./NavbarUser";
// // import { motion } from "framer-motion";
// // import { useEffect, useState } from "react";

// // const ShowImages = () => {
// //   const location = useLocation();
// //   const { imageUrls = [] } = location.state || {}; // Default to empty array
// //   const [loggedIn, setLoggedIn] = useState("none");
  
// //   useEffect(() => {
// //     (async () => {
// //       const response = await fetch("https://api-smartdrive.ccstiet.com/get_user_status", {
// //         method: "GET",
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //         mode: "cors",
// //       });
      
// //       if (!response.ok) {
// //         setLoggedIn("none");
// //         return;
// //       }
      
// //       const data = await response.json();
// //       setLoggedIn(data.status ? "admin" : "user");
// //     })();
// //   }, []);

// //   let navbar;
// //   if (loggedIn === "admin") {
// //     navbar = <NavbarAdmin onLogout={() => setLoggedIn("none")} />;
// //   } else if (loggedIn === "user") {
// //     navbar = <NavbarUser onLogout={() => setLoggedIn("none")} />;
// //   } else {
// //     navbar = (
// //       <nav className="fixed top-0 w-full bg-opacity-30 backdrop-blur-md shadow-xl z-50 py-4 border-b border-gray-800">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
// //           <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center space-x-3">
// //             <img src="/logo.png" alt="SmartPhotoDrive" className="w-12 h-12" />
// //             <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
// //               SmartPhotoDrive
// //             </span>
// //           </motion.div>
// //           <motion.a whileHover={{ scale: 1.1 }} href="/about-us" className="text-gray-300 hover:text-white transition duration-200 font-medium">
// //             About Us
// //           </motion.a>
// //         </div>
// //       </nav>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-900 text-white">
// //       {navbar}
// //       <div className="max-w-7xl mx-auto px-4 py-16">
// //         <h1 className="text-4xl font-bold text-center mb-8"></h1>

// //         {imageUrls.length === 0 ? (
// //           <p className="text-gray-400 text-center">No images available.</p>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
// //             {imageUrls.map((url, index) => (
// //               <div key={index} className="relative bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
// //                 <a href={url} target="_blank" rel="noopener noreferrer" className="absolute top-2 left-2 bg-green-700 p-2 rounded-full hover:bg-gray-600 transition">
// //                   ⬇️
// //                 </a>
// //                 <img src={url} alt={`Event Image ${index + 1}`} className="w-full h-auto rounded-lg shadow-lg object-cover" />
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ShowImages;
// import { useLocation } from "react-router-dom";
// import NavbarAdmin from "./NavbarAdmin";
// import NavbarUser from "./NavbarUser";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// const ShowImages = () => {
//   const location = useLocation();
//   const { imageUrls = [] } = location.state || {}; // Default to empty array
//   const [loggedIn, setLoggedIn] = useState("none");
//   const [expandedImage, setExpandedImage] = useState(null);
//   const [loading, setLoading] = useState(false);
  
//   useEffect(() => {
//     (async () => {
//       const response = await fetch("https://api-smartdrive.ccstiet.com/get_user_status", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         mode: "cors",
//       });
      
//       if (!response.ok) {
//         setLoggedIn("none");
//         return;
//       }
      
//       const data = await response.json();
//       setLoggedIn(data.status ? "admin" : "user");
//     })();
//   }, []);

//   // Function to expand an image
//   const handleExpandImage = (url) => {
//     setExpandedImage(url);
//     // Prevent scrolling while image is expanded
//     document.body.style.overflow = 'hidden';
//   };

//   // Function to close expanded image
//   const handleCloseExpanded = () => {
//     setExpandedImage(null);
//     // Restore scrolling
//     document.body.style.overflow = 'auto';
//   };

//   // Function to download a single image
//   const handleDownloadImage = async (url) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
      
//       // Extract filename from URL or use default
//       const filename = url.substring(url.lastIndexOf('/') + 1) || 'image.jpg';
      
//       // Create download link
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(link.href);
//     } catch (error) {
//       console.error("Error downloading image:", error);
//       alert("Failed to download image. Please try again.");
//     }
//   };

//   // Function to download all images as ZIP
//   const handleDownloadAllImages = async () => {
//     if (imageUrls.length === 0) return;
    
//     setLoading(true);
//     try {
//       const zip = new JSZip();
//       const folder = zip.folder("photos");
      
//       // Fetch all images and add to zip
//       const promises = imageUrls.map(async (url, index) => {
//         const response = await fetch(url);
//         const blob = await response.blob();
//         const filename = url.substring(url.lastIndexOf('/') + 1) || `image_${index + 1}.jpg`;
//         folder.file(filename, blob);
//       });
      
//       await Promise.all(promises);
      
//       // Generate and save the zip file
//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, "all_photos.zip");
//     } catch (error) {
//       console.error("Error creating ZIP file:", error);
//       alert("Failed to download images. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

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
//           <motion.a whileHover={{ scale: 1.1 }} href="/about-us" className="text-gray-300 hover:text-white transition duration-200 font-medium">
//             About Us
//           </motion.a>
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {navbar}
//       <div className="max-w-7xl mx-auto px-4 py-16 pt-24">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold">Photo Gallery</h1>
          
//           {imageUrls.length > 0 && (
//             <button 
//               onClick={handleDownloadAllImages}
//               disabled={loading}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span>Processing...</span>
//               ) : (
//                 <>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                   </svg>
//                   <span>Download All Photos (ZIP)</span>
//                 </>
//               )}
//             </button>
//           )}
//         </div>

//         {imageUrls.length === 0 ? (
//           <p className="text-gray-400 text-center">No images available.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {imageUrls.map((url, index) => (
//               <div key={index} className="relative bg-gray-800 p-4 rounded-lg shadow-md group overflow-hidden">
//                 <img 
//                   src={url} 
//                   alt={`Event Image ${index + 1}`} 
//                   className="w-full h-64 rounded-lg shadow-lg object-cover cursor-pointer transition-transform hover:scale-105" 
//                   onClick={() => handleExpandImage(url)}
//                 />
//                 <button 
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDownloadImage(url);
//                   }}
//                   className="absolute bottom-6 right-6 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
//                   title="Download image"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                   </svg>
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Expanded Image Modal */}
//       {expandedImage && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
//           onClick={handleCloseExpanded}
//         >
//           <div className="relative max-w-6xl max-h-screen w-full flex items-center justify-center">
//             <button 
//               className="absolute top-4 right-4 z-10 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
//               onClick={handleCloseExpanded}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//             <img 
//               src={expandedImage} 
//               alt="Expanded view" 
//               className="max-h-screen max-w-full object-contain"
//               onClick={(e) => e.stopPropagation()}
//             />
//             <button 
//               className="absolute bottom-4 right-4 bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleDownloadImage(expandedImage);
//               }}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowImages;

import { useLocation } from "react-router-dom";
import NavbarAdmin from "./NavbarAdmin";
import NavbarUser from "./NavbarUser";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const ShowImages = () => {
  const location = useLocation();
  const { imageUrls = [] } = location.state || {}; // Default to empty array
  const [loggedIn, setLoggedIn] = useState("none");
  const [expandedImage, setExpandedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
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

  // Function to expand an image
  const handleExpandImage = (url) => {
    setExpandedImage(url);
    // Prevent scrolling while image is expanded
    document.body.style.overflow = 'hidden';
  };

  // Function to close expanded image
  const handleCloseExpanded = () => {
    setExpandedImage(null);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  // Function to properly download image to user's file system
  const handleDownloadImage = async (url) => {
    try {
      const filename = url.substring(url.lastIndexOf('/') + 1) || 'image.jpg';
      
      // Create a hidden iframe to handle the download
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Write a form to the iframe that will submit and download the file
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const form = iframeDoc.createElement('form');
      form.method = 'GET';
      form.action = url;
      
      // Create a hidden input for the download attribute
      const downloadInput = iframeDoc.createElement('input');
      downloadInput.type = 'hidden';
      downloadInput.name = 'download';
      downloadInput.value = filename;
      form.appendChild(downloadInput);
      
      iframeDoc.body.appendChild(form);
      form.submit();
      
      // Clean up the iframe after a delay
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    } catch (error) {
      console.error("Error downloading image:", error);
      
      // Fallback method using fetch with proxy URL if available
      try {
        // You can replace this with your own proxy URL if needed
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
        const response = await fetch(proxyUrl);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = url.substring(url.lastIndexOf('/') + 1) || 'image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (proxyError) {
        console.error("Proxy download failed:", proxyError);
        alert("Failed to download image. Please try right-clicking the image and select 'Save image as...'");
      }
    }
  };

  // Function to download all images as ZIP with proper handling
  // const handleDownloadAllImages = async () => {
  //   if (imageUrls.length === 0) return;
    
  //   setLoading(true);
  //   try {
  //     const zip = new JSZip();
  //     const folder = zip.folder("photos");
      
  //     // Function to fetch a single image with various methods
  //     const fetchImage = async (url, index) => {
  //       try {
  //         // Try direct fetch first (will fail with CORS)
  //         const response = await fetch(url, { mode: 'no-cors' })
  //           .then(r => {
  //             // This will likely not be reached due to CORS
  //             return r.blob();
  //           })
  //           .catch(async () => {
  //             // If direct fetch fails, try using XHR which can sometimes work better
  //             return new Promise((resolve, reject) => {
  //               const xhr = new XMLHttpRequest();
  //               xhr.open('GET', url, true);
  //               xhr.responseType = 'blob';
  //               xhr.onload = function() {
  //                 if (this.status === 200) {
  //                   resolve(this.response);
  //                 } else {
  //                   reject(new Error(`Status: ${this.status}`));
  //                 }
  //               };
  //               xhr.onerror = function() {
  //                 reject(new Error('XHR request failed'));
  //               };
  //               xhr.send();
  //             });
  //           });
          
  //         const filename = url.substring(url.lastIndexOf('/') + 1) || `image_${index + 1}.jpg`;
  //         return { blob: response, filename };
  //       } catch (error) {
  //         console.error(`Failed to fetch image ${url}:`, error);
          
  //         // Create a text file noting the error as a fallback
  //         const errorText = `Failed to download image: ${url}\nError: ${error.message}`;
  //         return {
  //           blob: new Blob([errorText], { type: 'text/plain' }),
  //           filename: `failed_image_${index + 1}.txt`
  //         };
  //       }
  //     };
      
  //     // Process all images
  //     const results = await Promise.all(imageUrls.map((url, index) => fetchImage(url, index)));
      
  //     // Add successfully fetched images to the ZIP
  //     results.forEach(({ blob, filename }) => {
  //       folder.file(filename, blob);
  //     });
      
  //     // Generate and save the ZIP file
  //     const content = await zip.generateAsync({ type: "blob" });
  //     saveAs(content, "all_photos.zip");
  //   } catch (error) {
  //     console.error("Error creating ZIP file:", error);
  //     alert("Failed to download images. Please try downloading them individually.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleDownloadAllImages = async () => {
    if (imageUrls.length === 0) return;
  
    setLoading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("photos");
  
      // Function to fetch a single image
      const fetchImage = async (url, index) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP status ${response.status}`);
          const blob = await response.blob();
          const filename = url.split("/").pop() || `image_${index + 1}.jpg`;
          return { blob, filename };
        } catch (error) {
          console.error(`Failed to fetch image: ${url}`, error);
          return null;
        }
      };
  
      // Fetch all images
      const results = await Promise.all(imageUrls.map(fetchImage));
  
      // Add valid images to the ZIP
      results.forEach((result) => {
        if (result) folder.file(result.filename, result.blob);
      });
  
      // Generate and download the ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "all_photos.zip");
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      alert("Failed to download images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Alternative approach to download single images properly
  const downloadImageToDevice = (url) => {
    // Extract filename from URL
    const filename = url.substring(url.lastIndexOf('/') + 1) || 'image.jpg';
    
    // Create temporary link for download
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = filename; // This is the key attribute for saving rather than opening
    link.setAttribute('download', filename); // For older browsers
    link.target = '_blank'; // Prevents opening in same window
    
    // Add to DOM, trigger click, remove
    document.body.appendChild(link);
    link.click();
    
    // Remove after a slight delay
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  };

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
            <a 
              href="https://smartdrive.ccstiet.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 hover:underline flex items-center gap-2"
            >
              SmartPhotoDrive <span className="text-sm font-medium text-gray-300">(Beta)</span>
            </a>
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
      <div className="max-w-7xl mx-auto px-4 py-16 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Photo Gallery</h1>
          
          {imageUrls.length > 0 && (
            <button 
              onClick={handleDownloadAllImages}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download All Photos (ZIP)</span>
                </>
              )}
            </button>
          )}
        </div>

        {imageUrls.length === 0 ? (
          <p className="text-gray-400 text-center">No images available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative bg-gray-800 p-4 rounded-lg shadow-md group overflow-hidden">
                <img 
                  src={url} 
                  alt={`Event Image ${index + 1}`} 
                  className="w-full h-64 rounded-lg shadow-lg object-cover cursor-pointer transition-transform hover:scale-105" 
                  onClick={() => handleExpandImage(url)}
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImageToDevice(url);
                  }}
                  className="absolute bottom-6 right-6 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                  title="Download image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseExpanded}
        >
          <div className="relative max-w-6xl max-h-screen w-full flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 z-10 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
              onClick={handleCloseExpanded}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={expandedImage} 
              alt="Expanded view" 
              className="max-h-screen max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              className="absolute bottom-4 right-4 bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                downloadImageToDevice(expandedImage);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowImages;