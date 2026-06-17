/*
  Vite entry point. The whole app lives in App.jsx — this file just mounts it.
  (Keeping the mount separate from the component is what lets hot-reload work
   cleanly and avoids the "createRoot called twice" warning.)
*/
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Fill the night sky behind the app.
document.documentElement.style.height = "100%";
document.body.style.margin = "0";
document.body.style.minHeight = "100vh";
document.body.style.background = "#0a0e22";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
