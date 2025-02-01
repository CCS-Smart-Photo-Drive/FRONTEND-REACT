import React, { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import CardContainer from "./CardContainer";
import EventManagement from "./EventManagement";
import { LogOut, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";
import NavbarAdmin from "../NavbarAdmin";
import { API_URL } from "../../config"

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
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
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
      <NavbarAdmin onLogout={() => {}} />
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
