import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Grid,
  Settings,
  Image as ImageIcon,
} from "lucide-react";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("grid"); // 'grid' or 'list'

  // Check authentication
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchUserData();
    fetchUserImages();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (err) {
      setError("Failed to load user profile");
    }
  };

  const fetchUserImages = async () => {
    try {
      const response = await fetch("/api/user/images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserImages(data.images);
      } else {
        throw new Error("Failed to fetch images");
      }
    } catch (err) {
      setError("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Profile Header */}
      <div className="bg-gray-800 shadow-lg pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col items-center">
            {/* Profile Avatar */}
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <User className="w-16 h-16 text-gray-400" />
            </div>

            {/* User Info */}
            {userData && (
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {userData.username}
                </h1>
                <div className="flex items-center justify-center text-gray-400 mb-4">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center justify-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {formatDate(userData.joinedDate)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle and Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-md ${
                view === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-md ${
                view === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <div className="text-gray-400">
            {userImages.length} {userImages.length === 1 ? "image" : "images"}{" "}
            uploaded
          </div>
        </div>

        {/* Error State */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your profile...</p>
          </div>
        ) : (
          /* Image Gallery */
          <>
            {userImages.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  No images yet
                </h3>
                <p className="text-gray-400">
                  Start by uploading your first image!
                </p>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {userImages.map((image, index) => (
                  <div
                    key={index}
                    className={`${
                      view === "grid"
                        ? "bg-gray-800 rounded-lg overflow-hidden"
                        : "bg-gray-800 rounded-lg p-4 flex items-center space-x-4"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className={`${
                        view === "grid"
                          ? "w-full h-48 object-cover"
                          : "w-24 h-24 object-cover rounded"
                      }`}
                    />
                    <div className={`${view === "grid" ? "p-4" : "flex-1"}`}>
                      <h3 className="text-white font-medium mb-2">
                        {image.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Uploaded on {formatDate(image.uploadDate)}
                      </p>
                      {image.socialMediaLinks && (
                        <div className="mt-2 space-y-1">
                          {image.socialMediaLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-400 hover:text-blue-300 text-sm"
                            >
                              {link.platform}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
