import React, { useState, useEffect } from "react";
import Header from "./Header";
import CardContainer from "./CardContainer";
import EventManagement from "./EventManagement";

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

  const addTask = (eventData) => {
    const newTask = {
      id: Date.now(),
      ...eventData,
      fileContent: eventData.file ? URL.createObjectURL(eventData.file) : null,
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <div className="flex-1 ml-20 p-5">
        <Header />
        <div className="mt-8 space-y-8">
          <CardContainer taskCount={tasks.length} />
          <EventManagement
            tasks={tasks}
            addTask={addTask}
            removeTask={removeTask}
          />
        </div>
      </div>
    </div>
  );
};

export default New_Event_Page;
