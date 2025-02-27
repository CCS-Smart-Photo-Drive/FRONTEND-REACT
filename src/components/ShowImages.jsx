import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import NavbarAdmin from "./NavbarAdmin";
import NavbarUser from "./NavbarUser";

const ShowImages = () => {
  const location = useLocation();
  const { imageUrls = [] } = location.state || {};
  const [loggedIn, setLoggedIn] = useState("none");

  const [loading, setLoading] = useState(false);
  const [zipReady, setZipReady] = useState(false);
  const [zipBlob, setZipBlob] = useState(null);
  const [showPreparing, setShowPreparing] = useState(false);
  const [imageBlobs, setImageBlobs] = useState([]); // Store fetched image blobs

  useEffect(() => {
    if (imageUrls.length > 0) {
      fetchAllImages();
    }
  }, [imageUrls]);
  
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

  const fetchAllImages = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        imageUrls.map(async (url, index) => {
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            const blob = await response.blob();
            const filename = url.split("/").pop() || `image_${index + 1}.jpg`;
            return { blob, filename, url };
          } catch (error) {
            console.error(`Failed to fetch image: ${url}`, error);
            return null;
          }
        })
      );
      
      // Store the fetched blobs
      setImageBlobs(results.filter(result => result !== null));
      
      // Create the ZIP file from the same fetched blobs
      createZipFromBlobs(results.filter(result => result !== null));
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("Failed to prepare images. Please try again.");
    } finally {
      setLoading(false);
      setShowPreparing(false);
    }
  };

  const createZipFromBlobs = async (blobResults) => {
    try {
      const zip = new JSZip();
      const folder = zip.folder("HackTU 6.0 photos");

      blobResults.forEach((result) => {
        if (result) folder.file(result.filename, result.blob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      setZipBlob(zipBlob);
      setZipReady(true);
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      alert("Failed to prepare ZIP file. Please try again.");
    }
  };

  const handleDownloadZip = () => {
    if (zipReady && zipBlob) {
      saveAs(zipBlob, "hacktu6.zip");
    } else {
      setShowPreparing(true);
    }
  };
  
  const handleDownloadSingleImage = (url, index) => {
    // Find the already fetched blob for this URL
    const imageData = imageBlobs.find(item => item.url === url);
    
    if (imageData) {
      // Use the already fetched blob
      saveAs(imageData.blob, imageData.filename);
    } else {
      // Fallback in case the blob isn't found (shouldn't happen normally)
      console.warn("Image blob not found, fetching again:", url);
      fetchAndDownloadSingleImage(url, index);
    }
  };
  
  const fetchAndDownloadSingleImage = async (url, index) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      const blob = await response.blob();
      const filename = url.split("/").pop() || `image_${index + 1}.jpg`;
      saveAs(blob, filename);
    } catch (error) {
      console.error(`Failed to download image: ${url}`, error);
      alert("Failed to download image. Please try again.");
    }
  };

  let navbar;
  if (loggedIn === "admin") {
    navbar = <NavbarAdmin onLogout={() => setLoggedIn("none")} />;
  } else if (loggedIn === "user") {
    navbar = <NavbarUser onLogout={() => setLoggedIn("none")} />;}
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {navbar}
      <div className="max-w-7xl mx-auto px-4 py-16 pt-24">
        <div className="flex justify-between items-center mb-8 mt-2">
          <h1 className="text-4xl font-bold">HackTU 6.0 Photo Gallery</h1>

          {imageUrls.length > 0 && (
            <button
              onClick={handleDownloadZip}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {loading && showPreparing ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Preparing ZIP...
                </span>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
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
              <div key={index} className="relative bg-gray-800 p-4 rounded-lg shadow-md">
                <img
                  src={url}
                  alt={`Event Image ${index + 1}`}
                  className="w-full h-64 rounded-lg shadow-lg object-cover"
                />
                <div className="absolute bottom-6 right-6">
                  <button
                    onClick={() => handleDownloadSingleImage(url, index)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                    title="Download Image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowImages;