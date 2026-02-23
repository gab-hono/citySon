/* ============================================================
   MAIN.JSX — APPLICATION ENTRY POINT
   Mounts the React app into the DOM root element.
   Imports global styles and the Leaflet icon bug fix before
   rendering the router-provided component tree.
   ============================================================ */

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router"
import { router } from "./router"

// GLOBAL STYLES — SINGLE SOURCE OF TRUTH FOR ALL CSS
import "./index.css"
import "./App.css"

// FIXES LEAFLET'S BROKEN MARKER ICON PATHS IN VITE/WEBPACK BUILDS
import './fixLeafletBugIcons'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)