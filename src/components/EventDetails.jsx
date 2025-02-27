import React, { useState, useEffect } from "react";
import { Search, CalendarDays, MapPin, X, Download, User } from "lucide-react";
import NavbarUser from "./NavbarUser";
import { motion } from "framer-motion";
import { API_URL } from "../config";
import JSZip from "jszip";
import { useNavigate } from "react-router-dom";


function formatForFrontEnd(data) {
  /*
  {
    "_id": "6799e8e57be6aff4f018302b",
    "date": "12",
    "description": "yoyo",
    "event_manager_name": "hari22",
    "event_name": "yoyo1234",
    "location": "Thapar",
    "organized_by": "hehe",
    }
    
    to
    
    {
      "id": 1,
      "name": "Tech Conference 2024",
      "description": "Join us for the biggest tech conference of the year featuring leading experts in AI, Web Development, and Cloud Computing.",
      "date": "2024-03-15T09:00:00Z",
      "location": "San Francisco Convention Center",
      }
      ];
      */
     return data.map((event) => ({
       id: event._id,
       name: event.event_name,
       description: event.description,
       date: event.date,
       location: event.location,
       organized_by: event.organized_by,
      }));
    }
    
    const EventsPage = () => {
      if (localStorage.getItem("token") === null) {
        return <Navigate to="/login" replace />;
      }
      
      const [events, setEvents] = useState([]);
      const [searchQuery, setSearchQuery] = useState("");
      const [loading, setLoading] = useState(true);
      const [selectedEvent, setSelectedEvent] = useState(null);
      const [downloadLoading, setDownloadLoading] = useState(false);
      const [downloadError, setDownloadError] = useState("");
      const [image_urls , setImage_urls] = useState("")
      
      const navigate = useNavigate();
  // useEffect(() => {
  //   setLoading(true);
  //   fetch(`${API_URL(window.location.href)}/all_events`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setEvents(data.events);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch events", err);
  //       setLoading(false);
  //     });
  // }, []);
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL(window.location.href)}/all_events`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(formatForFrontEnd(data.events));
        setLoading(false);
        // console.log(data.events);
      })
      .catch((err) => {
        console.error("Failed to fetch events", err);
        setLoading(false);
    })
  }, [])

  const handleDownloadImages = async (eventName) => {
    setDownloadLoading(true);
    setDownloadError("");

    try {
      const body = new FormData();
      body.set("user_email", localStorage.getItem("user_email"));

      const fetchImagesResponse = await fetch(`${API_URL(window.location.href)}/get_photos/${eventName}`, {
        method: "POST",
        body,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Accept": "application/json",
        },
    });

      if (!fetchImagesResponse.ok) {
        const data = await fetchImagesResponse.json();
        throw new Error(data.error);
      }

      const { image_urls } = await fetchImagesResponse.json();
      setImage_urls(image_urls);
      console.log(image_urls)
      if (!image_urls.length) throw new Error("No images found for this event.");

      // Download images and zip them
      const zip = new JSZip();
      const imgFolder = zip.folder(eventName);

      const container = document.getElementById("imageContainer"); // Make sure you have a div with this ID in your HTML

// Promise.all(
//   image_urls.map(async (url) => {
//     const img = document.createElement("img"); // Create an image element
//     img.src = url; // Set image source
//     img.alt = "Loaded Image";
//     img.style.width = "1000px"; // Set size if needed
//     img.style.margin = "10px";
//     container.appendChild(img); // Append image to the container
//   })
// );


      // await Promise.all(
      //   image_urls.map(async (url, index) => {
      //     // const response = await fetch(url , {mode:"no-cors"});

      //     // console.log(response)
      //     // if (!response.ok) throw new Error(`Failed to download image: ${url}`);
      //     // const blob = await response.blob();
      //     // imgFolder.file(`image-${index + 1}.jpg`, blob);

          

      //   })
      // );
      // const zipBlob = await zip.generateAsync({ type: "blob" });
      // const zipUrl = URL.createObjectURL(zipBlob);
      // const a = document.createElement("a");
      // a.href = zipUrl;
      // a.download = `event-${eventName}-images.zip`;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error(err);
      setDownloadError(err.message);
    } finally {
      setDownloadLoading(false);
    }
  };

  const goToImagesPage = (imageUrls) => {
    navigate("/showImages", { state: { imageUrls } });
};


  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 pb-8">
      <NavbarUser onLogout={() => {}} />
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500"
        >
          EVENTS
        </motion.h1>

        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <h3 className="text-xl font-semibold text-gray-100">{event.name}</h3>
                <p className="mt-2 text-gray-300 line-clamp-2">{event.description}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-400">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <User className="w-4 h-4 mr-2" />
                    <span>{event.organized_by}</span>
                  </div>
                </div>
                {!downloadLoading && 
                <button
                  onClick={() => handleDownloadImages(event.name)}
                  disabled={downloadLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none"
                >
                  {downloadLoading ? "Fetching Images..." : "Get Images"}
                  <Download className="w-5 h-5 ml-2 inline" />
                </button>}
              </div>
            ))}

          </div>
          
        )}
      </div>
        {/* <div className="w-1000" id="imageContainer"></div> */}
        {/* {console.log(image_urls)} */}
        <button
        onClick={() => goToImagesPage(image_urls)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        View Images
      </button>
    </div>
  );
};

export default EventsPage;



// import React, { useState, useEffect } from "react";
// import { Search, CalendarDays, MapPin, X, Download, User } from "lucide-react";
// import NavbarUser from "./NavbarUser";
// import { motion } from "framer-motion";
// import { API_URL } from "../config";

// function formatForFrontEnd(data) {
//   /*
//     {
//       "_id": "6799e8e57be6aff4f018302b",
//       "date": "12",
//       "description": "yoyo",
//       "event_manager_name": "hari22",
//       "event_name": "yoyo1234",
//       "location": "Thapar",
//       "organized_by": "hehe",
//     }

//     to

//     {
//       "id": 1,
//       "name": "Tech Conference 2024",
//       "description": "Join us for the biggest tech conference of the year featuring leading experts in AI, Web Development, and Cloud Computing.",
//       "date": "2024-03-15T09:00:00Z",
//       "location": "San Francisco Convention Center",
//     }
//   ];
//   */
//   return data.map((event) => ({
//     id: event._id,
//     name: event.event_name,
//     description: event.description,
//     date: event.date,
//     location: event.location,
//     organized_by: event.organized_by,
//   }));
// }

// const EventsPage = () => {
//   if (localStorage.getItem("token") === null) {
//     return <Navigate to="/login" replace />;
//   }

//   const [events, setEvents] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [downloadLoading, setDownloadLoading] = useState(false);
//   const [downloadError, setDownloadError] = useState("");

//   // Hardcoded events data
//   const hardcodedEvents = [];

  // useEffect(() => {
  //   setLoading(true);
  //   fetch(`${API_URL(window.location.href)}/all_events`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setEvents(formatForFrontEnd(data.events));
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch events", err);
  //       setLoading(false);
  //   })
  // }, [])

//   const handleDownloadImages = async (eventName) => {
//     setDownloadLoading(true);
//     setDownloadError("");

//     try {
//       const body = new FormData();
//       body.set("user_email", localStorage.getItem("user_email"));
//       const fetchDownloadResponse = await fetch(`${API_URL(window.location.href)}/get_photos/${eventName}`, {
//         method: "POST",
//         body,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         mode: "cors",
        
//       });

//       if (!fetchDownloadResponse.ok) {
//         const data = await fetchDownloadResponse.json();
//         console.log(data);
//         throw new Error(data.error);
//       }

//       const downloadTarget = (await fetchDownloadResponse.json()).download;
//       const response = await fetch(`${API_URL(window.location.href)}/get_photos/${eventName}?download=${downloadTarget}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         mode: "cors",
        
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         console.log(data);
//         throw new Error(data.error);
//       }

//       const blob = await response.blob();
//       const blobUrl = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = blobUrl;
//       a.download = `event-${eventName}-images.zip`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(blobUrl);

//     } catch (err) {
//       console.log(err);
//       setDownloadError(err.message);
//     } finally {
//       setDownloadLoading(false);
//     }
//   };

//   const searchLocalEvents = (query) => {
//     if (!query.trim()) {
//       setEvents(hardcodedEvents);
//       return;
//     }

//     const filteredEvents = hardcodedEvents.filter(
//       (event) =>
//         event.name.toLowerCase().includes(query.toLowerCase()) ||
//         event.description.toLowerCase().includes(query.toLowerCase()) ||
//         event.location.toLowerCase().includes(query.toLowerCase())
//     );

//     setEvents(filteredEvents);
//   };

//   const handleSearchChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     searchLocalEvents(query);
//   };

//   useEffect(() => {
//     setEvents(hardcodedEvents);
//     setLoading(false);
//   }, []);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-black text-white pt-24 px-4 pb-8">
//       <NavbarUser onLogout={() => {}} />
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <motion.h1
//           initial={{ opacity: 0, y: -100 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//           className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500"
//         >
//           EVENTS
//         </motion.h1>
//         {/* <p className="text-gray-400 mt-2">Browse and search upcoming events</p> */}

//         {/* Search Bar */}
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search events..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
//                      text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
//                      focus:ring-blue-500 focus:border-transparent"
//           />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center items-center py-12">
//             <div className="w-8 h-8 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
//           </div>
//         )}

//         {/* Events Grid */}
//         {!loading && events.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {events.map((event) => (
//               <div
//                 key={event.id}
//                 className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden 
//                          hover:border-gray-600 transition-colors duration-200"
//               >
//                 <div className="p-4">
//                   <h3 className="text-xl font-semibold text-gray-100">
//                     {event.name}
//                   </h3>
//                   <p className="mt-2 text-gray-300 line-clamp-2">
//                     {event.description}
//                   </p>

//                   <div className="mt-4 space-y-2">
//                     <div className="flex items-center text-gray-400">
//                       <CalendarDays className="w-4 h-4 mr-2" />
//                       <span className="text-sm">
//                         {formatDate(event.date)}
//                       </span>
//                     </div>
//                     <div className="flex items-center text-gray-400">
//                       <MapPin className="w-4 h-4 mr-2" />
//                       <span className="text-sm">{event.location}</span>
//                     </div>
//                     <div className="flex items-center text-gray-400">
//                       <User className="w-4 h-4 mr-2" />
//                       <span className="text-sm">{event.organized_by}</span>
//                     </div>
//                   </div>

//                   <div className="mt-4 flex gap-2">
//                     <button
//                       onClick={() => setSelectedEvent(event)}
//                       className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md 
//                                hover:bg-blue-700 transition-colors duration-200
//                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
//                                focus:ring-offset-gray-800"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* No Events Found */}
//         {!loading && events.length === 0 && (
//           <div className="text-center text-gray-400 py-12">
//             No events found
//           </div>
//         )}
//       </div>

//       {/* Event Details Modal */}
//       {selectedEvent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative">
//             <button
//               onClick={() => setSelectedEvent(null)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             <h2 className="text-2xl font-bold text-gray-100 mb-4">
//               {selectedEvent.name}
//             </h2>
//             <p className="text-gray-300 mb-4">{selectedEvent.description}</p>

//             <div className="space-y-2 mb-6">
//               <div className="flex items-center text-gray-400">
//                 <CalendarDays className="w-4 h-4 mr-2" />
//                 <span>{formatDate(selectedEvent.date)}</span>
//               </div>
//               <div className="flex items-center text-gray-400">
//                 <MapPin className="w-4 h-4 mr-2" />
//                 <span>{selectedEvent.location}</span>
//               </div>
//             </div>

//             {downloadError && (
//               <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md border border-red-700">
//                 {downloadError}
//               </div>
//             )}

//             <button
//               onClick={() => handleDownloadImages(selectedEvent.name)}
//               disabled={downloadLoading}
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md 
//                        hover:bg-blue-700 transition-colors duration-200
//                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
//                        focus:ring-offset-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed
//                        flex items-center justify-center gap-2"
//             >
//               {downloadLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
//                   Fetching Images...
//                 </>
//               ) : (
//                 <>
//                   <Download className="w-5 h-5" />
//                   Get Images
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventsPage;


