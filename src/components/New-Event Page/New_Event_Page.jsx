import React, { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import CardContainer from "./CardContainer";
import EventManagement from "./EventManagement";
import { LogOut, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const New_Event_Page = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Event 1",
      description: "Description 1",
      organizedBy: "Organizer 1",
      date: "2023-06-01",
      file: null,
      fileContent: null,
    },
    {
      id: 2,
      name: "Event 2",
      description: "Description 2",
      organizedBy: "Organizer 2",
      date: "2023-06-15",
      file: null,
      fileContent: null,
    },
    {
      id: 3,
      name: "Event 3",
      description: "Description 3",
      organizedBy: "Organizer 3",
      date: "2023-06-30",
      file: null,
      fileContent: null,
    },
    {
      id: 4,
      name: "Event 4",
      description: "Description 4",
      organizedBy: "Organizer 4",
      date: "2023-07-01",
      file: null,
      fileContent: null,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profilePicture");
    navigate("/login");
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      Object.values(task)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setTasks(
        data.map((event) => ({
          ...event,
          fileContent: event.file ? URL.createObjectURL(event.file) : null,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
      setLoading(false);
    }
  };

  const compressImage = async (file, maxWidth = 800) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Calculate new dimensions maintaining aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with reduced quality
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        };
      };
    });
  };

  const addTask = async (eventData) => {
    try {
      let compressedImage = null;

      if (eventData.file) {
        if (eventData.file.type.startsWith("image/")) {
          compressedImage = await compressImage(eventData.file);
        }
      }

      const formData = new FormData();

      Object.keys(eventData).forEach((key) => {
        if (key !== "file") {
          formData.append(key, eventData[key]);
        }
      });

      // Add compressed image if exists
      if (compressedImage) {
        // Convert base64 to blob
        const response = await fetch(compressedImage);
        const blob = await response.blob();
        formData.append("image", blob, "compressed_image.jpg");
      } else if (eventData.file) {
        // If it's not an image, send the original file
        formData.append("file", eventData.file);
      }

      const response = await fetch("/api/events", {
        method: "POST",
        body: formData, // Send as FormData instead of JSON
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      const newEvent = await response.json();
      const newTask = {
        ...newEvent,
        fileContent:
          compressedImage ||
          (eventData.file ? URL.createObjectURL(eventData.file) : null),
      };

      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event. Please try again.");
    }
  };

  const removeTask = async (id) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-white">PhotoDrive</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-red-400 hover:text-white hover:bg-red-600 transition duration-150"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-1 ml-20 p-5">
        <Header searchQuery={searchQuery} onSearchChange={handleSearch} />
        <div className="mt-8 space-y-8">
          <CardContainer taskCount={filteredTasks.length} />
          <EventManagement
            tasks={filteredTasks}
            addTask={addTask}
            removeTask={removeTask}
          />
        </div>
      </div>
    </div>
  );
};

export default New_Event_Page;
