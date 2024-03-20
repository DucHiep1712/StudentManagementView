import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/provider/ThemeProvider.jsx";
import { Toaster } from "@/components/ui/toaster.jsx";

axios.defaults.baseURL = "http://localhost:8080";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider storageKey="theme">
        <App />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
