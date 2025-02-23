import React, { useState, useCallback, useRef } from "react";
import { CalendarIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

const EventForm = ({ onSubmit, onClose }) => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    organizedBy: "",
    date: "",
    images: [],
    zipFile: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleFileUpload = (files) => {
    const imageFiles = [];
    let zipFile = null;
    let zipFileName = "";
  
    Array.from(files).forEach((file) => {
      if (file.type === "application/zip") {
        zipFile = new Blob([file], { type: "application/zip" }); // Convert to Blob
        zipFileName = file.name;
      } else if (file.type.startsWith("image/")) {
        imageFiles.push({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
        });
      }
    });
  
    setEventData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...imageFiles],
      zipFile: zipFile ? { blob: zipFile, name: zipFileName } : prevState.zipFile, // Store blob + name
    }));
  };

  const handleFileSelect = (e) => {
    handleFileUpload(e.target.files);
  };

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
    handleFileUpload(e.dataTransfer.files);
  }, []);

  const removeImage = (index) => {
    setEventData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const removeZipFile = () => {
    setEventData((prevState) => ({ ...prevState, zipFile: null }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(eventData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-black p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Add New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Upload Files</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-1 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ${isDragging ? "border-blue-500 bg-blue-500 bg-opacity-10" : "border-gray-600 hover:border-blue-500"}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip, image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <PhotoIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-400">Click to select or drag and drop images/zip file here</p>
            </div>
          </div>

          {eventData.zipFile && (
  <div className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
    <span className="text-gray-300 text-sm">{eventData.zipFile.name}</span>
    <button onClick={removeZipFile} className="text-red-500 hover:text-red-700">
      <XMarkIcon className="h-5 w-5" />
    </button>
  </div>
)}

          {eventData.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {eventData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img src={image.preview} alt={image.name} className="w-full h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;