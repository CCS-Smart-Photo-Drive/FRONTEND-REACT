import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SmartPhotoDriveHome from "./components/HomePage";
import UserAuthPage from "./components/UserAuthPage";
import AdminAuthPage from "./components/AdminAuthPage";
import EventDetails from "./components/EventDetails";
import ProfilePage from "./components/UserProfile";
import New_Event_Page from "./components/New-Event Page/New_Event_Page";
import About_Page from "./components/About-Us Page/About_Page";
import { Home } from "lucide-react";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/student-login" replace />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!token || !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<EventDetails />} />
        {/* Protected student routes */}
        <Route
          path="/admin/events"
          element={
            // <PrivateRoute>
            <New_Event_Page />
            /* </PrivateRoute> */
          }
        />
        <Route
          path="/profile"
          element={
            // <PrivateRoute>
            <ProfilePage />
            /* </PrivateRoute> */
          }
        />
        <Route
          path="/new-event"
          element={
            // <PrivateRoute>
            <New_Event_Page />
            /* </PrivateRoute> */
          }
        />
        <Route
          path="/events"
          element={
            // <PrivateRoute>
            <EventDetails />
            /* </PrivateRoute> */
          }
        />
        <Route
          path="/user/login"
          element={
            // <PrivateRoute>
            <UserAuthPage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/about-us"
          element={
            // <AdminRoute>
            <About_Page />
            // </AdminRoute>
          }
        />

        {/* Default redirect and catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
