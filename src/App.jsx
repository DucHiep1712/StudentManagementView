import axios from "axios";
import { useEffect, useState } from "react";

import { useLocalStorage } from "@/util/useLocalStorage";
import Dashboard from "@/components/Dashboard";
import Homepage from "@/components/Homepage";
import Login from "@/components/Login";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [jwt, setJwt] = useLocalStorage("", "jwt");

  useEffect(() => {
    console.log(`JWT: ${jwt}`);
  }, [jwt]);

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
}

export default App;
