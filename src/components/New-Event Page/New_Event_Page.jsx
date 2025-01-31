import React, { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import CardContainer from "./CardContainer";
import EventManagement from "./EventManagement";
import { LogOut, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";

function convertEventDataToTask(eventData, id) {
    // name: string;
    // description: string;
    // organizedBy: string;
    // date: string;
    // images: never[];
    // to
    // {
    //   id: 1,
    //   name: "Event 1",
    //   description: "Description 1",
    //   organizedBy: "Organizer 1",
    //   date: "2023-06-01",
    //   file: null,
    //   fileContent: null,
    // }
    return {
      id,
      name: eventData.name,
      description: eventData.description,
      organizedBy: eventData.organizedBy,
      date: eventData.date,
      file: null,
      fileContent: null,
    }
}

function eventToTask(event) {
    // date: "2025-01-17"
    // description: "HACK"
    // event_manager_name: "hari"
    // event_name: "HACK"
    //organized_by: "CCS"
    //_id: "679ba1700cddb265d552edc6"
    //
    // to
    //
    // {
    //   id: 1,
    //   name: "Event 1",
    //   description: "Description 1",
    //   organizedBy: "Organizer 1",
    //   date: "2023-06-01",
    //   file: null,
    //   fileContent: null,
    // }

    return {
      id: event._id,
      name: event.event_name,
      description: event.description,
      organizedBy: event.organized_by,
      date: event.date,
      file: null,
      fileContent: null,
    }
}

async function zipImages(images) {
  if (images.length == 0) {
    alert("Please select files.");
    return;
  }

  const zip = new JSZip();
  for (let i = 0; i < images.length; i++) {
    zip.file(`${i}.jpg`, images[i], { binary: true });
  }

  return await zip.generateAsync({ type: "blob" });
}

const New_Event_Page = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    navigate("/");
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
      const body = new FormData();
      body.append("event_manager_name", localStorage.getItem("user_name"));
      const response = await fetch(`${API_URL}/my_events`, {
        body,
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setTasks(
        data.events.map((event, i) => eventToTask(event))
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
      if (eventData.images.length == 0) {
        alert("Images are required");
        return;
      }

      const images = eventData.images.map(async (file) => file.file);
      const zipFile = await zipImages(images);

      const formData = new FormData();
      formData.set("event_name", eventData.name);
      formData.set("event_manager_name", localStorage.getItem("user_name"));
      formData.set("organized_by", eventData.organizedBy);
      formData.set("description", eventData.description);
      formData.set("date", eventData.date);
      formData.append("file", zipFile, "images.zip");

      const response = await fetch(`${API_URL}/add_new_event`, {
        method: "POST",
        body: formData,
      });
      
      console.log(await response.json())
      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      const newTask = convertEventDataToTask(eventData, tasks.length);

      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event. Please try again.");
    }
  };

  const removeTask = async (id) => {
    try {
      const response = await fetch(`/events/${id}`, {
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
              <span className="text-xl font-bold text-white">SmartPhotoDrive</span>
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
