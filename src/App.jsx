import Course from "@/components/Course";
import Dashboard from "@/components/Dashboard";
import Homepage from "@/components/Homepage";
import Login from "@/components/Login";
import PrivateRoute from "@/components/PrivateRoute";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import TeacherDashboard from "./components/TeacherDashboard";
import { useLocalStorage } from "./util/useLocalStorage";

function App() {
  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const [roles, setRoles] = useState(null);

  useEffect(() => {
    if (jwt) {
      const decodedJwt = jwtDecode(jwt);
      setRoles(decodedJwt.authorities);
    } else {
      return [];
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          roles?.includes("ROLE_TEACHER") ? (
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          ) : (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          )
        }
      />
      <Route
        path={`courses/:id`}
        element={
          <PrivateRoute>
            <Course />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
}

export default App;
