import React, { useState, useCallback, useRef, useEffect } from "react";
import { User, Camera, Upload, Edit, Save, LogOut } from "lucide-react";
import NavbarUser from "../components/NavbarUser";
import { API_URL } from "../config"

const ProfilePage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setImagePreview(localStorage.getItem("profile_picture"));
  }, [])

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  }, []);

  const handleImageUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("user_name", localStorage.getItem("user_name"));
      formData.append("user_email", localStorage.getItem("email"));
      formData.append("user_file", file);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL(window.location.href)}/my_dashboard`,
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

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        localStorage.setItem("profile_picture", reader.result);
        setImagePreview(reader.result);
        setSuccess("Profile picture updated successfully!");
      };

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.log(err);
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      handleImageUpload(file);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL(window.location.href)}/update-password`, {
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

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      setSuccess("Password updated successfully!");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarUser onLogout={() => {}} />
      <div className="pt-24 px-4 pb-8 lg:w-[400px] m-auto">
        {/* Profile Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-teal-500">User Profile</h1>
          <p className="text-gray-400 mt-2">Manage your profile and settings</p>
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="relative group cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div
              className={`w-32 h-32 rounded-full overflow-hidden bg-gray-700 
              ${isDragging ? "ring-2 ring-blue-500" : ""}`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-full h-full p-4 text-gray-400" />
              )}
            </div>

            {/* Upload Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>

            {/* Loading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-gray-900/50 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <p className="mt-2 text-sm text-gray-400">
            Click or drag and drop to update profile picture
          </p>
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
            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
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
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 mt-2">{error}</div>
              )}

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className={`px-6 py-2 bg-blue-500 text-white rounded-md transition-colors
                  ${isUpdatingPassword ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                >
                  {isUpdatingPassword ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="mt-4 text-sm text-green-500">{success}</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
