import React, { useState } from "react";
import Header from "./Header.jsx";
import Profile from "./Profile.jsx";
import EditProfile from "./EditProfile.jsx";
import "../../index.css";

export default function Profile_Page() {
  const [userData, setUserData] = useState({
    name: "y",
    email: "y@thapar.edu.com",
    phone: "+91 NNNNNNNNNN",
    image: "/placeholder.svg?height=300&width=300",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCloseEdit = () => setIsEditing(false);

  const handleUpdateProfile = (newData) => {
    setUserData((prevData) => ({ ...prevData, ...newData }));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen">
      <Header onEdit={handleEdit} />
      <main className="container mx-auto px-4 py-8">
        <Profile userData={userData} />
        {isEditing && (
          <EditProfile
            userData={userData}
            onClose={handleCloseEdit}
            onUpdate={handleUpdateProfile}
          />
        )}
      </main>
    </div>
  );
}
