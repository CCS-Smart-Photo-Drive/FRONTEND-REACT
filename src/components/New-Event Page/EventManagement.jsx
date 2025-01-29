import React, { useState } from "react";
import EventForm from "./EventForm";
import {
  ArrowUpOnSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const EventManagement = ({ tasks = [], addTask, removeTask }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSubmit = (eventData) => {
    addTask(eventData);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDownload = async (fileContent, fileName) => {
    setIsDownloading(true);
    try {
      const response = await fetch(fileContent);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-black rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">Events</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Add Event
        </button>
      </div>
      <div className="space-y-4">
        {tasks &&
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center bg-gray-800 rounded-md p-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              onClick={() => handleEventClick(task)}
            >
              <span className="text-white">{task.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTask(task.id);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}
      </div>
      {isFormOpen && (
        <EventForm
          onSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      {selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-black p-8 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">
              {selectedEvent.name}
            </h2>
            <p className="text-gray-300 mb-2">
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Organized by:</strong> {selectedEvent.organizedBy}
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-300">
                <strong>File:</strong>{" "}
                {selectedEvent.file
                  ? selectedEvent.file.name
                  : "No file uploaded"}
              </p>
              {selectedEvent.fileContent && (
                <button
                  onClick={() =>
                    handleDownload(
                      selectedEvent.fileContent,
                      selectedEvent.file.name
                    )
                  }
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <ArrowPathIcon className="h-5 w-5 mr-1 animate-spin" />
                  ) : (
                    <ArrowUpOnSquareIcon className="h-5 w-5 mr-1" />
                  )}
                  {isDownloading ? "Downloading..." : "Download"}
                </button>
              )}
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
