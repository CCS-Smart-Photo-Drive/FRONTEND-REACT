import React from "react";
export default function Header({ onEdit }) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wider">PHOTO DRIVE</h1>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors font-medium"
        >
          Edit Profile
        </button>
      </div>
    </header>
  );
}

