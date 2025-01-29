import React, { useState } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

const Header = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)

  const gridItems = [
    { imgSrc: "https://example.photos/60?random=1", link: "page1.html" },
    { imgSrc: "https://example.photos/60?random=2", link: "page2.html" },
    { imgSrc: "https://exapmle.photos/60?random=3", link: "page3.html" },
    { imgSrc: "https://exapmle.photos/60?random=4", link: "page4.html" },
    { imgSrc: "https://exapmle.photos/60?random=5", link: "page5.html" },
    { imgSrc: "https://exapmle.photos/60?random=6", link: "page6.html" },
    { imgSrc: "https://example.photos/60?random=7", link: "page7.html" },
    { imgSrc: "https://example.photos/60?random=8", link: "page8.html" },
    { imgSrc: "https://example.photos/60?random=9", link: "page9.html" },
  ]

  return (
    <header className="flex justify-between items-center">
      <div className="relative w-2/3 max-w-2xl">
        <input
          type="text"
          placeholder="Search"
          className="w-full py-2 px-4 rounded-full bg-black shadow-md focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          className="grid grid-cols-3 gap-1 p-1 bg-gray-900 rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-600 rounded-full" />
          ))}
        </button>
        {isTerminalOpen && (
          <div className="absolute top-16 right-4 bg-white p-4 rounded-md shadow-lg grid grid-cols-3 gap-2">
            {gridItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="block w-12 h-12 rounded-md overflow-hidden hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  src={item.imgSrc || "/placeholder.svg"}
                  alt={`Grid item ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        )}
        <h1 className="text-xl font-bold text-white-700">Photo Drive</h1>
      </div>
    </header>
  )
}

export default Header

