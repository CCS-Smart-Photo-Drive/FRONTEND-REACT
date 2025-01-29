import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Header = ({ searchQuery, onSearchChange }) => {
  return (
    <header className="flex justify-between items-center">
      <div className="relative w-2/3 max-w-2xl">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-2 px-4 rounded-full bg-black text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-700 text-white"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white-700">Photo Drive</h1>
      </div>
    </header>
  );
};

export default Header;
