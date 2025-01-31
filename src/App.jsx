import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SmartPhotoDriveHome from "./components/HomePage";
import EventDetails from "./components/EventDetails";
import ProfilePage from "./components/UserProfile";
import New_Event_Page from "./components/New-Event Page/New_Event_Page";
import About_Page from "./components/About-Us Page/About_Page";
import { API_URL } from "./config";
import { VerifyLogin } from "./components/VerifyLogin";

const PrivateRoute = async ({ children }) => {
  const response = await fetch(`${API_URL}/get_user_status`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    return <Navigate to="/" replace />;
  }
  const data = await response.json();
  if (!data.is_admin) {
    return children;
  }
  return <Navigate to="/" replace />;
};

const AdminRoute = async ({ children }) => {
  const response = await fetch(`${API_URL}/get_user_status`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    return <Navigate to="/" replace />;
  }
  const data = await response.json();
  if (data.is_admin) {
    return children;
  }

  return <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SmartPhotoDriveHome />} />
        <Route
          path="/about-us"
          element={<About_Page />}
        />
        <Route
          path="/verify_login"
          element={<VerifyLogin />}
        />
        {/* Protected user routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
            <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
            <EventDetails />
            </PrivateRoute>
          }
        />
         {/* Protected admin routes */}
        <Route
          path="/manager_dashboard"
          element={
            <AdminRoute>
            <New_Event_Page />
            </AdminRoute>
          }
        />

        {/* Default redirect and catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
