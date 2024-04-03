import App from "@/App.jsx";
import { Toaster } from "@/components/ui/toaster.jsx";
import { ThemeProvider } from "@/provider/ThemeProvider.jsx";
import axios from "axios";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/index.css";

axios.defaults.baseURL = "http://localhost:8080";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider storageKey="theme">
        <App />
      </ThemeProvider>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);
