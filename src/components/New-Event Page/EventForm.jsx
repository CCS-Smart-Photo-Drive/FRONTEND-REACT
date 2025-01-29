import React, { useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";

const EventForm = ({ onSubmit, onClose }) => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    organizedBy: "",
    date: "",
    file: null,
    fileContent: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      const file = files[0];
      setEventData({ ...eventData, [name]: file });

      // Instead of reading the entire file, just store the file object
      setEventData((prevState) => ({
        ...prevState,
        fileContent: file,
      }));
    } else {
      setEventData({ ...eventData, [name]: value });
    }
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
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Name of Event
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description of event
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="organizedBy"
              className="block text-sm font-medium text-gray-300"
            >
              Organised by
            </label>
            <input
              type="text"
              id="organizedBy"
              name="organizedBy"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-300"
            >
              Date of event
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="date"
                id="date"
                name="date"
                required
                className="block w-full rounded-md bg-gray-800 border-gray-700 text-white pl-10"
                onChange={handleChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-300"
            >
              Choose file (ZIP only)
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".zip"
              required
              className="mt-1 block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
