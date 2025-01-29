import React from "react";
export default function Profile({ userData }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <img
        src={userData.image || "/placeholder.svg"}
        alt={userData.name}
        className="profile-image"
      />
      <h2 className="profile-name">{userData.name}</h2>
      <p className="profile-info">{userData.email}</p>
      <p className="profile-info">{userData.phone}</p>
    </div>
  );
}
