import React, { useState } from "react";
import { User, Camera } from "lucide-react";

const ProfilePage = () => {
  const [hasUploadedProfilePic, setHasUploadedProfilePic] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any existing error messages when user starts typing
    setError("");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      setError("");

      const response = await fetch("http://localhost:5000/my_dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      // Clear form and show success message
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      setSuccess("Password updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleImageSelect = async (e) => {
    if (hasUploadedProfilePic) {
      setError("Profile picture can only be set once");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("profile_picture", file);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }
      const event_name = ""; //left to be updated
      const response = await fetch(
        `http://localhost:5000/get_photos/${event_name}`, //dynamic routing -->event name should be passed here

        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setImagePreview(URL.createObjectURL(file));
      setHasUploadedProfilePic(true);
      setSuccess("Profile picture updated successfully!");
      localStorage.setItem("profilePicture", data.image_url);
    } catch (err) {
      setError(err.message || "Failed to upload image");
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-full h-full p-4 text-gray-400" />
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {!hasUploadedProfilePic && !isUploading && (
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            )}

            {hasUploadedProfilePic && (
              <div className="absolute bottom-0 right-0 bg-gray-600 rounded-full p-2 cursor-not-allowed">
                <Camera className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>

          {hasUploadedProfilePic && (
            <p className="mt-2 text-sm text-gray-400">
              Profile picture can only be set once
            </p>
          )}
        </div>

        {/* Password Update Section */}
        <div className="border-t border-gray-700 pt-6">
          <button
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
              setError("");
              if (!showPasswordForm) {
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }
            }}
            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
          >
            {showPasswordForm ? "Cancel Password Update" : "Update Password"}
          </button>

          {showPasswordForm && (
            <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={isUpdatingPassword}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={isUpdatingPassword}
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={isUpdatingPassword}
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-md border border-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-900/50 text-green-200 rounded-md border border-green-700">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
