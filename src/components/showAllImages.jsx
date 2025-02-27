import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import NavbarAdmin from "./NavbarAdmin";
import NavbarUser from "./NavbarUser";

const ShowAllImages = () => {
  const [loggedIn, setLoggedIn] = useState("none");
  const [images, setImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preparingZip, setPreparingZip] = useState(false);
  const [loadedImageBlobs, setLoadedImageBlobs] = useState({});
  const imagesPerPage = 12;
  const totalImages = 491;
  const observer = useRef();
  const lastImageElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleImages.length < totalImages) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, visibleImages.length]);

  // Generate all image URLs
  useEffect(() => {
    const urls = Array.from({ length: totalImages }, (_, i) => ({
      url: `https://storage.googleapis.com/ccs-host.appspot.com/upload_folder/HackTu/HackTu${i + 1}.jpg`,
      id: i + 1,
      loaded: false
    }));
    setImages(urls);
  }, []);

  // Load more images when page changes
  useEffect(() => {
    const loadMoreImages = () => {
      const start = (page - 1) * imagesPerPage;
      const end = page * imagesPerPage;
      const newImages = images.slice(0, end);
      setVisibleImages(newImages);
    };

    if (images.length > 0) {
      loadMoreImages();
    }
  }, [page, images]);

  // Check user status
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`https://api-smartdrive.ccstiet.com/get_user_status`, {
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
      } catch (error) {
        console.error("Error checking user status:", error);
        setLoggedIn("none");
      }
    })();
  }, []);

  // Fetch a single image and cache it
  const fetchImageBlob = async (imageData) => {
    // If already loaded, return from cache
    if (loadedImageBlobs[imageData.id]) {
      return loadedImageBlobs[imageData.id];
    }
    
    try {
      const response = await fetch(imageData.url);
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      
      const blob = await response.blob();
      const filename = `HackTu${imageData.id}.jpg`;
      
      // Cache the blob
      setLoadedImageBlobs(prev => ({
        ...prev,
        [imageData.id]: { blob, filename, url: imageData.url }
      }));
      
      return { blob, filename, url: imageData.url };
    } catch (error) {
      console.error(`Failed to fetch image: ${imageData.url}`, error);
      return null;
    }
  };

  const handleDownloadSingleImage = async (imageData) => {
    setLoading(true);
    try {
      const result = await fetchImageBlob(imageData);
      if (result) {
        saveAs(result.blob, result.filename);
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = async () => {
    if (preparingZip) return;
    
    setPreparingZip(true);
    
    try {
      const zip = new JSZip();
      const folder = zip.folder("HackTU 6.0 photos");
      
      // Use a batch approach to not overwhelm the browser
      const batchSize = 20;
      const totalBatches = Math.ceil(visibleImages.length / batchSize);
      
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const startIdx = batchIndex * batchSize;
        const endIdx = Math.min(startIdx + batchSize, visibleImages.length);
        const currentBatch = visibleImages.slice(startIdx, endIdx);
        
        // Process batch
        const batchResults = await Promise.all(
          currentBatch.map(imageData => fetchImageBlob(imageData))
        );
        
        // Add successful results to zip
        batchResults.forEach(result => {
          if (result) folder.file(result.filename, result.blob);
        });
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "hacktu6.zip");
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      alert("Failed to prepare ZIP file. Please try again.");
    } finally {
      setPreparingZip(false);
    }
  };

  let navbar;
  if (loggedIn === "admin") {
    navbar = <NavbarAdmin onLogout={() => setLoggedIn("none")} />;
  } else if (loggedIn === "user") {
    navbar = <NavbarUser onLogout={() => setLoggedIn("none")} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {navbar}
      <div className="max-w-7xl mx-auto px-4 py-16 pt-24">
        <div className="flex justify-between items-center mb-8 mt-2">
          <h1 className="text-4xl font-bold">HackTU 6.0 Photo Gallery</h1>

          {visibleImages.length > 0 && (
            <button
              onClick={handleDownloadZip}
              disabled={preparingZip}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                preparingZip ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {preparingZip ? (
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
                  <span>Download Visible Photos (ZIP)</span>
                </>
              )}
            </button>
          )}
        </div>

        {visibleImages.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
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
            <span className="ml-2 text-gray-400">Loading images...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visibleImages.map((imageData, index) => {
              const isLastElement = index === visibleImages.length - 1;
              return (
                <div 
                  key={imageData.id} 
                  ref={isLastElement ? lastImageElementRef : null}
                  className="relative bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <img
                    src={imageData.url}
                    alt={`HackTu Image ${imageData.id}`}
                    className="w-full h-64 rounded-lg shadow-lg object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-6 right-6">
                    <button
                      onClick={() => handleDownloadSingleImage(imageData)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                      title="Download Image"
                      disabled={loading}
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
              );
            })}
          </div>
        )}
        
        {visibleImages.length > 0 && visibleImages.length < totalImages && (
          <div className="flex justify-center mt-8">
            <div className="loader">
              <div className="animate-pulse flex space-x-1">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-gray-400 mt-2">Loading more images...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllImages;