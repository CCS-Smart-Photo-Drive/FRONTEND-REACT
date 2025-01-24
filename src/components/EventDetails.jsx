import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Filter,
} from "lucide-react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    upcoming: true,
    past: false,
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "/api/events?" +
          new URLSearchParams({
            upcoming: filters.upcoming,
            past: filters.past,
          }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        throw new Error("Failed to fetch events");
      }
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <h1 className="text-3xl font-bold text-white">Events</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="text-gray-400" />
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.upcoming}
                  onChange={(e) =>
                    setFilters({ ...filters, upcoming: e.target.checked })
                  }
                  className="form-checkbox text-blue-600 bg-gray-700 border-gray-600 rounded"
                />
                <span className="text-white">Upcoming Events</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.past}
                  onChange={(e) =>
                    setFilters({ ...filters, past: e.target.checked })
                  }
                  className="form-checkbox text-blue-600 bg-gray-700 border-gray-600 rounded"
                />
                <span className="text-white">Past Events</span>
              </label>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events List */}
            <div className="lg:col-span-1 space-y-4">
              {events.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">No events found</p>
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedEvent?.id === event.id
                        ? "ring-2 ring-blue-500"
                        : "hover:bg-gray-750"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-gray-400 text-sm mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(event.startDate)}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Event Details */}
            <div className="lg:col-span-2">
              {selectedEvent ? (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {selectedEvent.title}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">Date</p>
                          <p className="text-gray-400">
                            {formatDate(selectedEvent.startDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">Time</p>
                          <p className="text-gray-400">
                            {formatTime(selectedEvent.startDate)} -
                            {formatTime(selectedEvent.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-gray-400">
                            {selectedEvent.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <Users className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">Capacity</p>
                          <p className="text-gray-400">
                            {selectedEvent.currentAttendees} /{" "}
                            {selectedEvent.maxCapacity} attendees
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Description
                      </h3>
                      <p className="text-gray-400 whitespace-pre-line">
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>

                  {/* Additional Event Details */}
                  {selectedEvent.additionalInfo && (
                    <div className="border-t border-gray-700 pt-6 mt-6">
                      <h3 className="text-lg font-medium text-white mb-2">
                        Additional Information
                      </h3>
                      <div className="text-gray-400">
                        {selectedEvent.additionalInfo}
                      </div>
                    </div>
                  )}

                  {/* Event Actions */}
                  <div className="border-t border-gray-700 pt-6 mt-6">
                    <button
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      onClick={() => {
                        /* Handle event registration */
                      }}
                    >
                      Register for Event
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">
                    Select an event to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EventsPage;
