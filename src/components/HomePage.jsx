import React from "react";
import { UserCircle2, MenuIcon, X } from "lucide-react";

const HomePage = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">EventHub</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => (window.location.href = "/admin-login")}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <UserCircle2 className="w-5 h-5 mr-2" />
                Admin Login
              </button>
              <button
                onClick={() => (window.location.href = "/student-login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
              >
                <UserCircle2 className="w-5 h-5 mr-2" />
                Student Login
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-400 hover:text-white p-2"
              >
                {menuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => (window.location.href = "/admin-login")}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Admin Login
              </button>
              <button
                onClick={() => (window.location.href = "/student-login")}
                className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-blue-700"
              >
                Student Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            {/* Text Content */}
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold text-white mb-6">
                Your One-Stop Platform for College Events
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover, manage, and participate in a wide range of college
                events. From tech conferences to cultural festivals, stay
                updated with all the exciting happenings on campus.
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
                <button
                  onClick={() => (window.location.href = "/events")}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-md 
                           font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Browse Events
                </button>
                <button
                  onClick={() => (window.location.href = "/about")}
                  className="w-full sm:w-auto px-8 py-3 bg-gray-700 text-white rounded-md 
                           font-medium hover:bg-gray-600 transition-colors duration-200"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video">
                {/* Placeholder for image */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <p className="text-center">
                    Event Image Placeholder
                    <br />
                    (Add your image here)
                  </p>
                </div>
                {/* Once you have an image, replace the div above with: */}
                {/* <img 
                  src="/path-to-your-image.jpg" 
                  alt="College Events"
                  className="w-full h-full object-cover"
                /> */}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                Easy Access
              </h3>
              <p className="text-gray-300">
                Login as a student or admin to access different features and
                manage events.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                Event Updates
              </h3>
              <p className="text-gray-300">
                Stay informed about upcoming events, changes, and important
                announcements.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                Resource Access
              </h3>
              <p className="text-gray-300">
                Download event-related resources, images, and materials with
                ease.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
