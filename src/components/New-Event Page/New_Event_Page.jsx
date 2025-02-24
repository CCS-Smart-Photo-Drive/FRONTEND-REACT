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
// import { useState, useEffect, useMemo } from "react";
// import Header from "./Header";
// import CardContainer from "./CardContainer";
// import EventManagement from "./EventManagement";
// import NavbarAdmin from "../NavbarAdmin";
// // import Progress from "./Progress"; // Using our custom Progress component
// import { API_URL } from "../../config";
// import JSZip from "jszip";

// function convertEventDataToTask(eventData, id) {
//   // name: string;
//   // description: string;
//   // organizedBy: string;
//   // date: string;
//   // images: never[];
//   // to
//   // {
//   //   id: 1,
//   //   name: "Event 1",
//   //   description: "Description 1",
//   //   organizedBy: "Organizer 1",
//   //   date: "2023-06-01",
//   //   file: null,
//   //   fileContent: null,
//   // }
//   return {
//     id,
//     name: eventData.name,
//     description: eventData.description,
//     organizedBy: eventData.organizedBy,
//     date: eventData.date,
//     file: null,
//     fileContent: null,
//   }
// }

// function eventToTask(event) {
//   // date: "2025-01-17"
//   // description: "HACK"
//   // event_manager_name: "hari"
//   // event_name: "HACK"
//   //organized_by: "CCS"
//   //_id: "679ba1700cddb265d552edc6"
//   //
//   // to
//   //
//   // {
//   //   id: 1,
//   //   name: "Event 1",
//   //   description: "Description 1",
//   //   organizedBy: "Organizer 1",
//   //   date: "2023-06-01",
//   //   file: null,
//   //   fileContent: null,
//   // }

//   return {
//     id: event._id,
//     name: event.event_name,
//     description: event.description,
//     organizedBy: event.organized_by,
//     date: event.date,
//     file: null,
//     fileContent: null,
//   }
// }


// const New_Event_Page = () => {
//   const [tasks, setTasks] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const filteredTasks = useMemo(() => {
//     return tasks.filter((task) =>
//       Object.values(task)
//         .join(" ")
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//     );
//   }, [tasks, searchQuery]);

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   const fetchEvents = async () => {
//     try {
//       const body = new FormData();
//       body.append("event_manager_name", localStorage.getItem("user_name"));
//       const response = await fetch(`${API_URL(window.location.href)}/my_events`, {
//         body,
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         mode: "cors",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch events");
//       }
//       const data = await response.json();
//       setTasks(
//         data.events.map((event, i) => eventToTask(event))
//       );
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       setError("Failed to load events. Please try again later.");
//       setLoading(false);
//     }
//   };
//   const validateImages = (images) => {
//     const errors = [];
//     const maxFileSize = 100 * 1024 * 1024; // 100MB per file
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

//     images.forEach((file) => {
//       if (!allowedTypes.includes(file.type)) {
//         throw new Error(`File ${file.name} is not a supported image type`);
//       }
//       if (file.size > maxFileSize) {
//         throw new Error(`File ${file.name} exceeds maximum size of 100MB`);
//       }
//     });
//     return errors;
//   };

//   const zipImages = async (images) => {
//     const zip = new JSZip();
//     const totalSize = images.reduce((sum, file) => sum + file.size, 0);
//     let processedSize = 0;

//     images.forEach((file, index) => {
//       const extension = file.name.slice(file.name.lastIndexOf("."));
//       const fileName = `image_${String(index).padStart(3, '0')}${extension}`;
//       zip.file(fileName, file);
      
//       processedSize += file.size;
//       const progress = (processedSize / totalSize) * 50;
//       setUploadProgress(progress);
//     });
    
//     const zipBlob = await zip.generateAsync({
//       type: "blob",
//       compression: "STORE",
//     }, (metadata) => {
//       const progress = 50 + (metadata.percent / 2);
//       setUploadProgress(progress);
//     });

//     return zipBlob;
//   };

//   const addTask = async (eventData) => {
//     try {
//       setIsUploading(true);
//       setUploadProgress(0);
//       setError(null);
//       var zipBlob;
//       if(!eventData.zipFile){
//       if (eventData.images.length === 0) {
//         throw new Error("Images are required");
//       }

//       const images = eventData.images.map(img => img.file);
//       validateImages(images);

//       zipBlob = await zipImages(images);
//     }
//     else{
//       zipBlob = eventData.zipFile;
//     }

//       const xhr = new XMLHttpRequest();
//       const uploadPromise = new Promise((resolve, reject) => {
//         xhr.upload.onprogress = (event) => {
//           if (event.lengthComputable) {
//             const uploadProgress = (event.loaded / event.total) * 100;
//             setUploadProgress(40 + (uploadProgress * 0.6));
//           }
//         };

//         xhr.onload = () => {
//           if (xhr.status >= 200 && xhr.status < 300) {
//             resolve(JSON.parse(xhr.responseText));
//           } else {
//             reject(new Error(`Upload failed with status ${xhr.status}`));
//           }
//         };

//         xhr.onerror = () => reject(new Error('Network error during upload'));
//       });

//       xhr.open('POST', `${API_URL(window.location.href)}/add_new_event`);
//       xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem("token")}`);
//       xhr.setRequestHeader('X-Event-Name', eventData.name);
//       xhr.setRequestHeader('X-Event-Manager-Name', localStorage.getItem("user_name"));
//       xhr.setRequestHeader('X-Organized-By', eventData.organizedBy);
//       xhr.setRequestHeader('X-Description', eventData.description);
//       xhr.setRequestHeader('X-Date', eventData.date);
//       xhr.setRequestHeader('X-Event-Manager-Email', localStorage.getItem("email"))
//       xhr.setRequestHeader('Content-Type', 'application/zip');
      
//       xhr.send(zipBlob);

//       const response = await uploadPromise;
//       const newTask = convertEventDataToTask(eventData, tasks.length);
//       setTasks(prev => [...prev, newTask]);
//       setUploadProgress(100);
      
//       return response;
//     } catch (error) {
//       console.error("Error adding event:", error);
//       setError(error.message);
//       throw error;
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const removeTask = async (id) => {
//     try {
//       const response = await fetch(`/events/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//         mode: "cors",
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete event: ${response.statusText}`);
//       }

//       setTasks(tasks.filter((task) => task.id !== id));
//     } catch (error) {
//       console.error("Error deleting event:", error);
//       setError("Failed to delete event. Please try again.");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900">
//       <NavbarAdmin onLogout={() => {}} />
//       <div className="flex-1 ml-20 p-5">
//         <Header searchQuery={searchQuery} onSearchChange={handleSearch} />
//         {error && (
//           <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-500">
//             {error}
//           </div>
//         )}
//         {isUploading && (
//           <div className="mt-4 space-y-2">
//             <Progress value={uploadProgress} className="w-full" />
//             <p className="text-sm text-gray-400">
//               Upload progress: {Math.round(uploadProgress)}%
//             </p>
//           </div>
//         )}
//         <div className="mt-8 space-y-8">
//           <CardContainer taskCount={filteredTasks.length} />
//           <EventManagement
//             tasks={filteredTasks}
//             addTask={addTask}
//             removeTask={removeTask}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default New_Event_Page;
import React, { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import CardContainer from "./CardContainer";
import EventManagement from "./EventManagement";
import NavbarAdmin from "../NavbarAdmin";
import { API_URL } from "../../config";
import JSZip from "jszip";

// Constants for upload configuration
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_RETRIES = 3;
const CONCURRENT_CHUNKS = 3;

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


// Custom hook for managing upload state
const useUploadState = () => {
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    progress: 0,
    error: null,
    cancelUpload: null,
    currentOperation: '',
  });

  const startUpload = (cancelFn) => {
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      cancelUpload: cancelFn,
      currentOperation: 'Preparing upload...'
    });
  };

  const updateProgress = (progress, operation) => {
    setUploadState(prev => ({
      ...prev,
      progress,
      currentOperation: operation || prev.currentOperation
    }));
  };

  const setError = (error) => {
    setUploadState(prev => ({
      ...prev,
      error,
      isUploading: false
    }));
  };

  const resetUpload = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      cancelUpload: null,
      currentOperation: ''
    });
  };

  return {
    uploadState,
    startUpload,
    updateProgress,
    setError,
    resetUpload
  };
};

// Upload Manager class for handling chunked uploads
class UploadManager {
  constructor(onProgress) {
    this.uploadQueue = [];
    this.activeUploads = 0;
    this.abortController = new AbortController();
    this.onProgress = onProgress;
  }

  async uploadChunk(fileId, chunk, chunkIndex, retryCount = 0) {
    try {
      const response = await fetch(`${API_URL(window.location.href)}/upload_chunk/${fileId}`, {
        method: 'POST',
        headers: {
          'X-Chunk-Index': chunkIndex,
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: chunk,
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (retryCount < MAX_RETRIES && !this.abortController.signal.aborted) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return this.uploadChunk(fileId, chunk, chunkIndex, retryCount + 1);
      }
      throw error;
    }
  }

  async processQueue() {
    while (this.uploadQueue.length > 0 && this.activeUploads < CONCURRENT_CHUNKS) {
      const upload = this.uploadQueue.shift();
      this.activeUploads++;
      
      try {
        await upload();
      } catch (error) {
        if (!this.abortController.signal.aborted) {
          console.error('Chunk upload failed:', error);
        }
      }
      
      this.activeUploads--;
      this.processQueue();
    }
  }

  addToQueue(uploadFn) {
    this.uploadQueue.push(uploadFn);
    this.processQueue();
  }

  cancelUpload() {
    this.abortController.abort();
    this.uploadQueue = [];
    this.activeUploads = 0;
    this.abortController = new AbortController();
  }
}

// Helper functions
const validateImages = (images) => {
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
};

const zipImages = async (images, onProgress) => {
  const zip = new JSZip();
  const totalSize = images.reduce((sum, file) => sum + file.size, 0);
  let processedSize = 0;

  images.forEach((file, index) => {
    const extension = file.name.slice(file.name.lastIndexOf("."));
    const fileName = `image_${String(index).padStart(3, '0')}${extension}`;
    zip.file(fileName, file);
    
    processedSize += file.size;
    const progress = (processedSize / totalSize) * 20; // 20% of total progress
    onProgress(progress, 'Preparing files...');
  });
  
  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "STORE",
  }, (metadata) => {
    const progress = 20 + (metadata.percent / 5); // 20-40% of total progress
    onProgress(progress, 'Compressing files...');
  });

  return zipBlob;
};

const New_Event_Page = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { uploadState, startUpload, updateProgress, setError, resetUpload } = useUploadState();

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
      setTasks(data.events.map(eventToTask));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
      setLoading(false);
    }
  };

  // const addTask = async (eventData) => {
  //   const uploadManager = new UploadManager();
    
  //   try {
  //     startUpload(() => uploadManager.cancelUpload());

  //     // Prepare the file
  //     let zipBlob;
  //     if (!eventData.zipFile) {
  //       if (eventData.images.length === 0) {
  //         throw new Error("Images are required");
  //       }
  //       validateImages(eventData.images.map(img => img.file));
  //       zipBlob = await zipImages(eventData.images.map(img => img.file), updateProgress);
  //     } else {
  //       zipBlob = eventData.zipFile;
  //       updateProgress(40, 'File prepared');
  //     }

  //     // Initialize upload
  //     const initResponse = await fetch(`${API_URL(window.location.href)}/init_upload`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem("token")}`
  //       },
  //       body: JSON.stringify({
  //         totalSize: zipBlob.size,
  //         fileName: eventData.zipFile?.name || 'images.zip',
  //         eventName: eventData.name,
  //         organizedBy: eventData.organizedBy,
  //         description: eventData.description,
  //         eventManagerName: localStorage.getItem("user_name"),
  //         eventManagerEmail: localStorage.getItem("email"),
  //         date: eventData.date
  //       })
  //     });

  //     if (!initResponse.ok) {
  //       throw new Error(`Failed to initialize upload: ${initResponse.statusText}`);
  //     }

  //     const { fileId, totalChunks } = await initResponse.json();
  //     let uploadedChunks = 0;

  //     // Split and upload chunks
  //     for (let i = 0; i < totalChunks; i++) {
  //       const start = i * CHUNK_SIZE;
  //       const end = Math.min(start + CHUNK_SIZE, zipBlob.size);
  //       const chunk = zipBlob.slice(start, end);
        
  //       uploadManager.addToQueue(async () => {
  //         await uploadManager.uploadChunk(fileId, chunk, i);
  //         uploadedChunks++;
  //         const progress = 40 + ((uploadedChunks / totalChunks) * 60);
  //         updateProgress(progress, `Uploading: ${uploadedChunks}/${totalChunks} chunks`);
  //       });
  //     }

  //     // Wait for completion
  //     await new Promise((resolve, reject) => {
  //       const checkCompletion = setInterval(() => {
  //         if (uploadedChunks === totalChunks) {
  //           clearInterval(checkCompletion);
  //           resolve();
  //         } else if (uploadState.error) {
  //           clearInterval(checkCompletion);
  //           reject(new Error(uploadState.error));
  //         }
  //       }, 1000);
  //     });

  //     const newTask = convertEventDataToTask(eventData, tasks.length);
  //     setTasks(prev => [...prev, newTask]);
  //     updateProgress(100, 'Upload complete!');
      
  //     return { message: 'Upload completed successfully' };

  //   } catch (error) {
  //     console.error("Error adding event:", error);
  //     setError(error.message);
  //     uploadManager.cancelUpload();
  //     throw error;
  //   } finally {
  //     setTimeout(resetUpload, 2000);
  //   }
  // };
  // const addTask = async (eventData) => {
  //   const uploadManager = new UploadManager();
    
  //   try {
  //     startUpload(() => uploadManager.cancelUpload());
  
  //     // Prepare the file
  //     let zipBlob;
  //     let totalSize;
      
  //     if (!eventData.zipFile) {
  //       if (eventData.images.length === 0) {
  //         throw new Error("Images are required");
  //       }
  //       validateImages(eventData.images.map(img => img.file));
  //       zipBlob = await zipImages(eventData.images.map(img => img.file), updateProgress);
  //       totalSize = zipBlob.size;
  //     } else {
  //       zipBlob = eventData.zipFile;
  //       totalSize = eventData.zipFile.size;
  //       updateProgress(40, 'File prepared');
  //     }
  
  //     // Initialize upload
  //     const initResponse = await fetch(`${API_URL(window.location.href)}/init_upload`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem("token")}`
  //       },
  //       body: JSON.stringify({
  //         totalSize: totalSize, // Now properly set for both cases
  //         fileName: eventData.zipFile?.name || 'images.zip',
  //         eventName: eventData.name,
  //         organizedBy: eventData.organizedBy,
  //         description: eventData.description,
  //         eventManagerName: localStorage.getItem("user_name"),
  //         eventManagerEmail: localStorage.getItem("email"),
  //         date: eventData.date
  //       })
  //     });
  
  //     if (!initResponse.ok) {
  //       const errorData = await initResponse.json();
  //       throw new Error(errorData.error || `Failed to initialize upload: ${initResponse.statusText}`);
  //     }
  
  //     const { fileId, totalChunks } = await initResponse.json();
  //     let uploadedChunks = 0;
  
  //     // Split and upload chunks
  //     for (let i = 0; i < totalChunks; i++) {
  //       const start = i * CHUNK_SIZE;
  //       const end = Math.min(start + CHUNK_SIZE, zipBlob.size);
  //       const chunk = zipBlob.slice(start, end);
        
  //       uploadManager.addToQueue(async () => {
  //         await uploadManager.uploadChunk(fileId, chunk, i);
  //         uploadedChunks++;
  //         const progress = 40 + ((uploadedChunks / totalChunks) * 60);
  //         updateProgress(progress, `Uploading: ${uploadedChunks}/${totalChunks} chunks`);
  //       });
  //     }
  
  //     // Wait for completion
  //     await new Promise((resolve, reject) => {
  //       const checkCompletion = setInterval(() => {
  //         if (uploadedChunks === totalChunks) {
  //           clearInterval(checkCompletion);
  //           resolve();
  //         } else if (uploadState.error) {
  //           clearInterval(checkCompletion);
  //           reject(new Error(uploadState.error));
  //         }
  //       }, 1000);
  //     });
  
  //     const newTask = convertEventDataToTask(eventData, tasks.length);
  //     setTasks(prev => [...prev, newTask]);
  //     updateProgress(100, 'Upload complete!');
      
  //     return { message: 'Upload completed successfully' };
  
  //   } catch (error) {
  //     console.error("Error adding event:", error);
  //     setError(error.message);
  //     uploadManager.cancelUpload();
  //     throw error;
  //   } finally {
  //     setTimeout(resetUpload, 2000);
  //   }
  // };

  class ChunkUploadTracker {
    constructor(totalChunks) {
      this.totalChunks = totalChunks;
      this.uploadedChunks = new Set();
      this.failedChunks = new Map(); // Maps chunk index to retry count (for tracking attempts)
      this.retryTimeouts = new Map(); // Maps chunk index to timeout ID
    }
  
    markSuccess(chunkIndex) {
      this.uploadedChunks.add(chunkIndex);
      this.failedChunks.delete(chunkIndex);
      this.clearRetryTimeout(chunkIndex);
    }
  
    markFailure(chunkIndex) {
      const retryCount = (this.failedChunks.get(chunkIndex) || 0) + 1;
      this.failedChunks.set(chunkIndex, retryCount);
    }
  
    setRetryTimeout(chunkIndex, timeoutId) {
      this.clearRetryTimeout(chunkIndex);
      this.retryTimeouts.set(chunkIndex, timeoutId);
    }
  
    clearRetryTimeout(chunkIndex) {
      const timeoutId = this.retryTimeouts.get(chunkIndex);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.retryTimeouts.delete(chunkIndex);
      }
    }
  
    clearAllTimeouts() {
      for (const timeoutId of this.retryTimeouts.values()) {
        clearTimeout(timeoutId);
      }
      this.retryTimeouts.clear();
    }
  
    getProgress() {
      return (this.uploadedChunks.size / this.totalChunks) * 100;
    }
  
    isComplete() {
      return this.uploadedChunks.size === this.totalChunks;
    }
  
    getRetryDelay(retryCount) {
      // Cap the maximum delay at 30 seconds to prevent excessive waiting
      const maxDelay = 30000;
      const baseDelay = 1000;
      const exponentialDelay = baseDelay * Math.pow(2, Math.min(retryCount, 5));
      return Math.min(exponentialDelay, maxDelay);
    }
  
    getPendingChunks() {
      return Array.from({ length: this.totalChunks })
        .map((_, i) => i)
        .filter(i => !this.uploadedChunks.has(i));
    }
  
    getRetryCount(chunkIndex) {
      return this.failedChunks.get(chunkIndex) || 0;
    }
  }

//   const addTask = async (eventData) => {
//     const uploadManager = new UploadManager();
//     let uploadTracker = null;
//     let abortController = new AbortController();
    
//     try {
//         startUpload(() => {
//             abortController.abort();
//             uploadTracker?.clearAllTimeouts();
//             uploadManager.cancelUpload();
//         });

//         // Prepare the file
//         let zipBlob;
//         let totalSize;

//         if (!eventData.zipFile) {
//             if (eventData.images.length === 0) {
//                 throw new Error("Images are required");
//             }
//             validateImages(eventData.images.map(img => img.file));
//             zipBlob = await zipImages(eventData.images.map(img => img.file), updateProgress);
//             totalSize = zipBlob.size;
//         } else {
//             zipBlob = eventData.zipFile.blob;
//             totalSize = zipBlob.size;
//             updateProgress(40, 'File prepared');
//         }

//         // **Fix: Ensure totalChunks is properly calculated**
//         // const CHUNK_SIZE = 5* 1024 * 1024; // Define CHUNK_SIZE (1MB or as needed)
//         const totalChunks = Math.ceil(totalSize / CHUNK_SIZE); // Use Math.ceil()

//         console.log({
//             fileName: eventData.zipFile?.name || 'images.zip',
//             eventName: eventData.name,
//             organizedBy: eventData.organizedBy,
//             description: eventData.description,
//             eventManagerName: localStorage.getItem("user_name"),
//             eventManagerEmail: localStorage.getItem("email"),
//             date: eventData.date,
//             totalSize: totalSize,
//             totalChunks: totalChunks // Log this value
//         });

//         // Initialize upload with correct totalChunks value
//         const initResponse = await fetch(`${API_URL(window.location.href)}/init_upload`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem("token")}`
//             },
//             body: JSON.stringify({
//                 fileName: eventData.zipFile?.name || 'images.zip',
//                 eventName: eventData.name,
//                 organizedBy: eventData.organizedBy,
//                 description: eventData.description,
//                 eventManagerName: localStorage.getItem("user_name"),
//                 eventManagerEmail: localStorage.getItem("email"),
//                 date: eventData.date,
//                 totalSize: totalSize,
//                 totalChunks: totalChunks // Ensure this is sent
//             }),
//             signal: abortController.signal
//         });

//         if (!initResponse.ok) {
//             const errorData = await initResponse.json();
//             throw new Error(errorData.error || `Failed to initialize upload: ${initResponse.statusText}`);
//         }

//         const { fileId } = await initResponse.json();
//         uploadTracker = new ChunkUploadTracker(totalChunks);

//         const uploadChunk = async (chunkIndex) => {
//             while (!abortController.signal.aborted) {
//                 try {
//                     const start = chunkIndex * CHUNK_SIZE;
//                     const end = Math.min(start + CHUNK_SIZE, zipBlob.size);
//                     const chunk = zipBlob.slice(start, end);

//                     const response = await fetch(`${API_URL(window.location.href)}/upload_chunk/${fileId}`, {
//                         method: 'POST',
//                         headers: {
//                             'X-Chunk-Index': chunkIndex,
//                             'Authorization': `Bearer ${localStorage.getItem("token")}`
//                         },
//                         body: chunk,
//                         signal: abortController.signal
//                     });

//                     if (!response.ok) {
//                         throw new Error(`Chunk upload failed: ${response.statusText}`);
//                     }

//                     uploadTracker.markSuccess(chunkIndex);
//                     updateProgress(
//                         40 + (uploadTracker.getProgress() * 0.6),
//                         `Uploading: ${uploadTracker.uploadedChunks.size}/${totalChunks} chunks (Retries: ${uploadTracker.getRetryCount(chunkIndex)})`
//                     );

//                     return; // Success - exit the retry loop

//                 } catch (error) {
//                     if (abortController.signal.aborted) {
//                         throw new Error('Upload cancelled');
//                     }

//                     uploadTracker.markFailure(chunkIndex);
//                     const retryCount = uploadTracker.getRetryCount(chunkIndex);
//                     const retryDelay = uploadTracker.getRetryDelay(retryCount);
                    
//                     updateProgress(
//                         40 + (uploadTracker.getProgress() * 0.6),
//                         `Retrying chunk ${chunkIndex} (Attempt ${retryCount + 1})`
//                     );

//                     await new Promise(resolve => {
//                         const timeoutId = setTimeout(resolve, retryDelay);
//                         uploadTracker.setRetryTimeout(chunkIndex, timeoutId);
//                     });
                    
//                     continue;
//                 }
//             }
//         };

//         // Upload all chunks with infinite retry
//         const uploadPromises = Array.from({ length: totalChunks }).map((_, i) => uploadChunk(i));
//         await Promise.all(uploadPromises);

//         // Verify completion
//         if (!uploadTracker.isComplete()) {
//             const pendingChunks = uploadTracker.getPendingChunks();
//             throw new Error(`Upload incomplete. Missing chunks: ${pendingChunks.join(', ')}`);
//         }

//         const newTask = convertEventDataToTask(eventData, tasks.length);
//         setTasks(prev => [...prev, newTask]);
//         updateProgress(100, 'Upload complete!');
        
//         return { message: 'Upload completed successfully' };

//     } catch (error) {
//         console.error("Error adding event:", error);
//         setError(error.message);
//         uploadTracker?.clearAllTimeouts();
//         uploadManager.cancelUpload();
//         throw error;
//     } finally {
//         setTimeout(resetUpload, 2000);
//     }
// };

// const addTask = async (eventData) => {
//   const uploadManager = new UploadManager();
//   let uploadTracker = null;
//   let abortController = new AbortController();
  
//   try {
//       startUpload(() => {
//           abortController.abort();
//           uploadTracker?.clearAllTimeouts();
//           uploadManager.cancelUpload();
//       });

//       // Prepare the file
//       let zipBlob;
//       let totalSize;

//       if (!eventData.zipFile) {
//           if (eventData.images.length === 0) {
//               throw new Error("Images are required");
//           }
//           validateImages(eventData.images.map(img => img.file));
//           zipBlob = await zipImages(eventData.images.map(img => img.file), updateProgress);
//           totalSize = zipBlob.size;
//       } else {
//           zipBlob = eventData.zipFile.blob;
//           totalSize = zipBlob.size;
//           updateProgress(40, 'File prepared');
//       }

//       const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);

//       console.log({
//           fileName: eventData.zipFile?.name || 'images.zip',
//           eventName: eventData.name,
//           organizedBy: eventData.organizedBy,
//           description: eventData.description,
//           eventManagerName: localStorage.getItem("user_name"),
//           eventManagerEmail: localStorage.getItem("email"),
//           date: eventData.date,
//           totalSize: totalSize,
//           totalChunks: totalChunks
//       });

//       // **Step 1: Initialize Upload**
//       const initResponse = await fetch(`${API_URL(window.location.href)}/init_upload`, {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${localStorage.getItem("token")}`
//           },
//           body: JSON.stringify({
//               fileName: eventData.zipFile?.name || 'images.zip',
//               eventName: eventData.name,
//               organizedBy: eventData.organizedBy,
//               description: eventData.description,
//               eventManagerName: localStorage.getItem("user_name"),
//               eventManagerEmail: localStorage.getItem("email"),
//               date: eventData.date,
//               totalSize: totalSize,
//               totalChunks: totalChunks
//           }),
//           signal: abortController.signal
//       });

//       if (!initResponse.ok) {
//           const errorData = await initResponse.json();
//           throw new Error(errorData.error || `Failed to initialize upload: ${initResponse.statusText}`);
//       }

//       const { fileId } = await initResponse.json();
//       uploadTracker = new ChunkUploadTracker(totalChunks);

//       // **Step 2: Upload Chunks**
//       const uploadChunk = async (chunkIndex) => {
//           while (!abortController.signal.aborted) {
//               try {
//                   const start = chunkIndex * CHUNK_SIZE;
//                   const end = Math.min(start + CHUNK_SIZE, zipBlob.size);
//                   const chunk = zipBlob.slice(start, end);

//                   const response = await fetch(`${API_URL(window.location.href)}/upload_chunk/${fileId}`, {
//                       method: 'POST',
//                       headers: {
//                           'X-Chunk-Index': chunkIndex,
//                           'Authorization': `Bearer ${localStorage.getItem("token")}`
//                       },
//                       body: chunk,
//                       signal: abortController.signal
//                   });

//                   if (!response.ok) {
//                       throw new Error(`Chunk upload failed: ${response.statusText}`);
//                   }

//                   uploadTracker.markSuccess(chunkIndex);
//                   updateProgress(
//                       40 + (uploadTracker.getProgress() * 0.6),
//                       `Uploading: ${uploadTracker.uploadedChunks.size}/${totalChunks} chunks`
//                   );

//                   return; // Success - exit the retry loop

//               } catch (error) {
//                   if (abortController.signal.aborted) {
//                       throw new Error('Upload cancelled');
//                   }

//                   uploadTracker.markFailure(chunkIndex);
//                   const retryCount = uploadTracker.getRetryCount(chunkIndex);
//                   const retryDelay = uploadTracker.getRetryDelay(retryCount);
                  
//                   updateProgress(
//                       40 + (uploadTracker.getProgress() * 0.6),
//                       `Retrying chunk ${chunkIndex} (Attempt ${retryCount + 1})`
//                   );

//                   await new Promise(resolve => {
//                       const timeoutId = setTimeout(resolve, retryDelay);
//                       uploadTracker.setRetryTimeout(chunkIndex, timeoutId);
//                   });

//                   continue;
//               }
//           }
//       };

//       // Upload all chunks
//       const uploadPromises = Array.from({ length: totalChunks }).map((_, i) => uploadChunk(i));
//       await Promise.all(uploadPromises);

//       // **Step 3: Finalize Upload**
//       const completeResponse = await fetch(`${API_URL(window.location.href)}/complete_upload/${fileId}`, {
//           method: 'POST',
//           headers: {
//               'Authorization': `Bearer ${localStorage.getItem("token")}`
//           }
//       });

//       if (!completeResponse.ok) {
//           throw new Error(`Finalizing upload failed: ${completeResponse.statusText}`);
//       }

//       const newTask = convertEventDataToTask(eventData, tasks.length);
//       setTasks(prev => [...prev, newTask]);
//       updateProgress(100, 'Upload complete!');
      
//       return { message: 'Upload completed successfully' };

//   } catch (error) {
//       console.error("Error adding event:", error);
//       setError(error.message);
//       uploadTracker?.clearAllTimeouts();
//       uploadManager.cancelUpload();
//       throw error;
//   } finally {
//       setTimeout(resetUpload, 2000);
//   }
// };
const addTask = async (eventData) => {
  const uploadManager = new UploadManager();
  let uploadTracker = null;
  let abortController = new AbortController();

  try {
      startUpload(() => {
          abortController.abort();
          uploadTracker?.clearAllTimeouts();
          uploadManager.cancelUpload();
      });

      let zipBlob;
      let totalSize;

      if (!eventData.zipFile) {
          if (eventData.images.length === 0) {
              throw new Error("Images are required");
          }
          validateImages(eventData.images.map(img => img.file));
          zipBlob = await zipImages(eventData.images.map(img => img.file), updateProgress);
          totalSize = zipBlob.size;
      } else {
          zipBlob = eventData.zipFile.blob;
          totalSize = zipBlob.size;
          updateProgress(40, 'File prepared');
      }

      const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);

      // **Initialize Upload**
      const initResponse = await fetch(`${API_URL(window.location.href)}/init_upload`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
              fileName: eventData.zipFile?.name || 'images.zip',
              eventName: eventData.name,
              organizedBy: eventData.organizedBy,
              description: eventData.description,
              eventManagerName: localStorage.getItem("user_name"),
              eventManagerEmail: localStorage.getItem("email"),
              date: eventData.date,
              totalSize,
              totalChunks
          }),
          signal: abortController.signal
      });

      if (!initResponse.ok) {
          const errorData = await initResponse.json();
          throw new Error(errorData.error || `Failed to initialize upload`);
      }

      const { fileId } = await initResponse.json();
      uploadTracker = new ChunkUploadTracker(totalChunks);

      // **Upload Chunks**
      const uploadChunk = async (chunkIndex) => {
          const start = chunkIndex * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, zipBlob.size);
          const chunk = zipBlob.slice(start, end);

          const response = await fetch(`${API_URL(window.location.href)}/upload_chunk/${fileId}`, {
              method: 'POST',
              headers: {
                  'X-Chunk-Index': chunkIndex,
                  'Authorization': `Bearer ${localStorage.getItem("token")}`
              },
              body: chunk,
              signal: abortController.signal
          });

          if (!response.ok) {
              throw new Error(`Chunk ${chunkIndex} upload failed`);
          }

          uploadTracker.markSuccess(chunkIndex);
          updateProgress(40 + (uploadTracker.getProgress() * 0.6),
              `Uploading: ${uploadTracker.uploadedChunks.size}/${totalChunks} chunks`);
      };

      await Promise.all(Array.from({ length: totalChunks }, (_, i) => uploadChunk(i)));

      // **Finalize Upload**
      const completeResponse = await fetch(`${API_URL(window.location.href)}/finalize_upload/${fileId}`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
      });

      if (!completeResponse.ok) {
          throw new Error(`Finalizing upload failed`);
      }

      const newTask = convertEventDataToTask(eventData, tasks.length);
      setTasks(prev => [...prev, newTask]);
      updateProgress(100, 'Upload complete!');

      return { message: 'Upload completed successfully' };

  } catch (error) {
      console.error("Error adding event:", error);
      setError(error.message);
      uploadTracker?.clearAllTimeouts();
      uploadManager.cancelUpload();
      throw error;
  } finally {
      setTimeout(resetUpload, 2000);
  }
};


  const removeTask = async (id) => {
    try {
      const response = await fetch(`https://api-smartdrive.ccstiet.com/events/${id}`, {
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
        {uploadState.error && (
          <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-500">
            {uploadState.error}
          </div>
        )}
        {uploadState.isUploading && (
          <div className="mt-4 space-y-2">
            <Progress value={uploadState.progress} className="w-full" />
            <div className="flex justify-between text-sm text-gray-400">
              <p>{uploadState.currentOperation}</p>
              <p>{Math.round(uploadState.progress)}%</p>
            </div>
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