import React, { useState, useEffect } from "react";
import { Search, CalendarDays, MapPin, X, Download, User } from "lucide-react";
import NavbarUser from "./NavbarUser";
import { motion } from "framer-motion";
import { API_URL } from "../config";

function formatForFrontEnd(data) {
  /*
    {
      "_id": "6799e8e57be6aff4f018302b",
      "date": "12",
      "description": "yoyo",
      "event_manager_name": "hari22",
      "event_name": "yoyo1234",
      "location": "Thapar",
      "organized_by": "hehe",
    }

    to

    {
      "id": 1,
      "name": "Tech Conference 2024",
      "description": "Join us for the biggest tech conference of the year featuring leading experts in AI, Web Development, and Cloud Computing.",
      "date": "2024-03-15T09:00:00Z",
      "location": "San Francisco Convention Center",
    }
  ];
  */
  return data.map((event) => ({
    id: event._id,
    name: event.event_name,
    description: event.description,
    date: event.date,
    location: event.location,
    organized_by: event.organized_by,
  }));
}

const EventsPage = () => {
  if (localStorage.getItem("token") === null) {
    return <Navigate to="/login" replace />;
  }

  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  // Hardcoded events data
  const hardcodedEvents = [];

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/all_events`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(formatForFrontEnd(data.events));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events", err);
        setLoading(false);
    })
  }, [])

  const handleDownloadImages = async (eventName) => {
    setDownloadLoading(true);
    setDownloadError("");

    try {
      const body = new FormData();
      body.set("user_email", localStorage.getItem("user_email"));
      const fetchDownloadResponse = await fetch(`${API_URL}/get_photos/${eventName}`, {
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
        credentials: "include",
      });

      if (!fetchDownloadResponse.ok) {
        throw new Error("Failed to get download link");
      }

      const downloadTarget = (await fetchDownloadResponse.json()).download;
      const response = await fetch(`${API_URL}/get_photos/${eventName}?download=${downloadTarget}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to get download link");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `event-${eventName}-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

    } catch (err) {
      console.log(err);
      setDownloadError("Failed to download images. Please try again.");
    } finally {
      setDownloadLoading(false);
    }
  };

  const searchLocalEvents = (query) => {
    if (!query.trim()) {
      setEvents(hardcodedEvents);
      return;
    }

    const filteredEvents = hardcodedEvents.filter(
      (event) =>
        event.name.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
    );

    setEvents(filteredEvents);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchLocalEvents(query);
  };

  useEffect(() => {
    setEvents(hardcodedEvents);
    setLoading(false);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 pb-8">
      <NavbarUser onLogout={() => {}} />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500"
        >
          EVENTS
        </motion.h1>
        {/* <p className="text-gray-400 mt-2">Browse and search upcoming events</p> */}

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Events Grid */}
        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden 
                         hover:border-gray-600 transition-colors duration-200"
              >
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-100">
                    {event.name}
                  </h3>
                  <p className="mt-2 text-gray-300 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-400">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.organized_by}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md 
                               hover:bg-blue-700 transition-colors duration-200
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                               focus:ring-offset-gray-800"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Events Found */}
        {!loading && events.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No events found
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              {selectedEvent.name}
            </h2>
            <p className="text-gray-300 mb-4">{selectedEvent.description}</p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-400">
                <CalendarDays className="w-4 h-4 mr-2" />
                <span>{formatDate(selectedEvent.date)}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{selectedEvent.location}</span>
              </div>
            </div>

            {downloadError && (
              <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md border border-red-700">
                {downloadError}
              </div>
            )}

            <button
              onClick={() => handleDownloadImages(selectedEvent.name)}
              disabled={downloadLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md 
                       hover:bg-blue-700 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                       focus:ring-offset-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {downloadLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                  Fetching Images...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Get Images
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
