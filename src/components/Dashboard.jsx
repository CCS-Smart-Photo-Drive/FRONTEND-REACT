import React, { useState, useEffect } from "react";
import { LogOut, Upload, Image as ImageIcon } from "lucide-react";
import { API_URL } from "../config";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      const response = await fetch(`${API_URL}/images`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setImages(data.images);
      }
    } catch (err) {
      setError("Failed to fetch images");
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImages([...images, data.image]);
        setSelectedFile(null);
        setPreview(null);
      } else {
        const error = await response.json();
        setError(error.message);
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              Social Media Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Upload New Image
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 object-contain mb-4"
                    />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
            )}

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Images</h2>
          {images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-400">
                No images found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload an image to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group bg-gray-700 rounded-lg overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.title || `Image ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <p className="text-sm font-medium truncate">
                        {image.title || `Image ${index + 1}`}
                      </p>
                      {image.socialMediaLinks && (
                        <div className="mt-2 space-y-1">
                          {image.socialMediaLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-blue-300 hover:text-blue-400"
                            >
                              {link.platform}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
