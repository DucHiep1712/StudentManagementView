import { default as AdminDasboard } from "@/components/Admin/Dashboard";
import Homepage from "@/components/Homepage";
import Login from "@/components/Login";
import PrivateRoute from "@/components/PrivateRoute";
import { default as StudentCourse } from "@/components/Student/Course";
import { default as StudentDashboard } from "@/components/Student/Dashboard";
import { default as TeacherCourse } from "@/components/Teacher/Course";
import { default as TeacherDashboard } from "@/components/Teacher/Dashboard";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useLocalStorage } from "./util/useLocalStorage";

function App() {
  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const [roles, setRoles] = useState(null);

  useEffect(() => {
    if (jwt) {
      const decodedJwt = jwtDecode(jwt);
      setRoles(decodedJwt.authorities);
    } else {
      setRoles([]);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          roles?.includes("ROLE_ADMIN") ? (
            <PrivateRoute>
              <AdminDasboard />
            </PrivateRoute>
          ) : roles?.includes("ROLE_TEACHER") ? (
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          ) : (
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          )
        }
      />
      <Route
        path={`courses/:id`}
        element={
          roles?.includes("ROLE_ADMIN") ? (
            <Navigate to="/dashboard" />
          ) : roles?.includes("ROLE_TEACHER") ? (
            <PrivateRoute>
              <TeacherCourse />
            </PrivateRoute>
          ) : (
            <PrivateRoute>
              <StudentCourse />
            </PrivateRoute>
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
}

export default App;
