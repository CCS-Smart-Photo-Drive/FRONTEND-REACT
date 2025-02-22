import React, { useEffect, useState } from "react";
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
import UserAuthPage from "./components/UserAuthPage";
import AdminAuthPage from "./components/AdminAuthPage";

const PrivateRoute = ({ children }) => {
  const [render, setRender] = useState(<div>Loading...</div>);
  useEffect(() => {
    (async () => {
      const response = await fetch(`https://api-smartdrive.ccstiet.com/get_user_status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
        
      });
      if (!response.ok) {
        setRender(<Navigate to="/" replace />);
        return;
      }
      const data = await response.json();
      if (!data.status) {
        setRender(children);
        return;
      }
      setRender(<Navigate to="/" replace />);
    })()
  })
  
  return render;
};

const AdminRoute = ({ children }) => {
  const [render, setRender] = useState(<div>Loading...</div>);
  useEffect(() => {
    (async () => {
      const response = await fetch(`https://api-smartdrive.ccstiet.com/get_user_status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
        
      });
      if (!response.ok) {
        setRender(<Navigate to="/" replace />);
        return;
      }
      const data = await response.json();
      if (data.status) {
        setRender(children);
        return;
      }
      setRender(<Navigate to="/" replace />);
    })()
  })

  return render;
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
        {/* <Route
          path="/auth/user"
          element={<UserAuthPage />}
        />
        <Route
          path="/auth/admin"
          element={<AdminAuthPage />}
        /> */}
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
