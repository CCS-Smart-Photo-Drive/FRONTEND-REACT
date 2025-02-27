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
  // New state for the single image view
  const [selectedImage, setSelectedImage] = useState(null);
  
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

  const handleDownloadSingleImage = async (imageData, event) => {
    // Prevent opening the image when clicking download
    if (event) {
      event.stopPropagation();
    }
    
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

  // Function to open the single image view
  const openImageView = (imageData) => {
    setSelectedImage(imageData);
    // Lock scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Function to close the single image view
  const closeImageView = () => {
    setSelectedImage(null);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  // Navigate to next/previous image
  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const currentIndex = visibleImages.findIndex(img => img.id === selectedImage.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % visibleImages.length;
    } else {
      newIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
    }
    
    setSelectedImage(visibleImages[newIndex]);
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
                  className="relative bg-gray-800 p-4 rounded-lg shadow-md group cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => openImageView(imageData)}
                >
                  <img
                    src={imageData.url}
                    alt={`HackTu Image ${imageData.id}`}
                    className="w-full h-64 rounded-lg shadow-lg object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all duration-300">
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => handleDownloadSingleImage(imageData, e)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors mr-2"
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
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                        title="View Image"
                        aria-label="View Image"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>
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

      {/* Single Image View Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 md:p-10"
          onClick={closeImageView}
        >
          <div 
            className="relative max-w-6xl w-full max-h-screen"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gray-800 rounded-lg p-2 md:p-4 shadow-2xl relative">
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadSingleImage(selectedImage);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors flex items-center justify-center"
                  title="Download Image"
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeImageView();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors flex items-center justify-center"
                  title="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* <div className="text-center text-lg font-semibold mt-1 mb-2">
                HackTu Image {selectedImage.id} of {totalImages}
              </div> */}
              <img
                src={selectedImage.url}
                alt={`HackTu Image ${selectedImage.id}`}
                className="max-h-[80vh] mx-auto rounded-lg object-contain"
              />
            </div>

            {/* Navigation buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-100 text-white p-3 rounded-full shadow-lg transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-100 text-white p-3 rounded-full shadow-lg transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Image counter - optional */}
            {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-70 px-4 py-2 rounded-full text-white text-sm">
              {selectedImage.id} / {totalImages}
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAllImages;