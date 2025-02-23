const Progress = ({ value, className = '' }) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(0, value), 100);
  
  return (
    <div className={`relative w-full h-4 bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-blue-500 transition-all duration-300 ease-in-out rounded-full"
        style={{ width: `${normalizedValue}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-50"></div>
      </div>
    </div>
  );
};
import { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import CardContainer from "./CardContainer";
import EventManagement from "./EventManagement";
import NavbarAdmin from "../NavbarAdmin";
// import Progress from "./Progress"; // Using our custom Progress component
import { API_URL } from "../../config";
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


const New_Event_Page = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

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
      const response = await fetch(`${API_URL(window.location.href)}/my_events`, {
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
  const validateImages = (images) => {
    const errors = [];
    const maxFileSize = 100 * 1024 * 1024; // 100MB per file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    images.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File ${file.name} is not a supported image type`);
      }
      if (file.size > maxFileSize) {
        throw new Error(`File ${file.name} exceeds maximum size of 100MB`);
      }
    });
    return errors;
  };

  const zipImages = async (images) => {
    const zip = new JSZip();
    const totalSize = images.reduce((sum, file) => sum + file.size, 0);
    let processedSize = 0;

    images.forEach((file, index) => {
      const extension = file.name.slice(file.name.lastIndexOf("."));
      const fileName = `image_${String(index).padStart(3, '0')}${extension}`;
      zip.file(fileName, file);
      
      processedSize += file.size;
      const progress = (processedSize / totalSize) * 50;
      setUploadProgress(progress);
    });
    
    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "STORE",
    }, (metadata) => {
      const progress = 50 + (metadata.percent / 2);
      setUploadProgress(progress);
    });

    return zipBlob;
  };

  const addTask = async (eventData) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      var zipBlob;
      if(!eventData.zipFile){
      if (eventData.images.length === 0) {
        throw new Error("Images are required");
      }

      const images = eventData.images.map(img => img.file);
      validateImages(images);

      zipBlob = await zipImages(images);
    }
    else{
      zipBlob = eventData.zipFile;
    }

      const xhr = new XMLHttpRequest();
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const uploadProgress = (event.loaded / event.total) * 100;
            setUploadProgress(40 + (uploadProgress * 0.6));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
      });

      xhr.open('POST', `${API_URL(window.location.href)}/add_new_event`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem("token")}`);
      xhr.setRequestHeader('X-Event-Name', eventData.name);
      xhr.setRequestHeader('X-Event-Manager-Name', localStorage.getItem("user_name"));
      xhr.setRequestHeader('X-Organized-By', eventData.organizedBy);
      xhr.setRequestHeader('X-Description', eventData.description);
      xhr.setRequestHeader('X-Date', eventData.date);
      xhr.setRequestHeader('X-Event-Manager-Email', localStorage.getItem("email"))
      xhr.setRequestHeader('Content-Type', 'application/zip');
      
      xhr.send(zipBlob);

      const response = await uploadPromise;
      const newTask = convertEventDataToTask(eventData, tasks.length);
      setTasks(prev => [...prev, newTask]);
      setUploadProgress(100);
      
      return response;
    } catch (error) {
      console.error("Error adding event:", error);
      setError(error.message);
      throw error;
    } finally {
      setIsUploading(false);
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
      setError("Failed to delete event. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <NavbarAdmin onLogout={() => {}} />
      <div className="flex-1 ml-20 p-5">
        <Header searchQuery={searchQuery} onSearchChange={handleSearch} />
        {error && (
          <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}
        {isUploading && (
          <div className="mt-4 space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-gray-400">
              Upload progress: {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
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