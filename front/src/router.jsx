/* ============================================================
   ROUTER.JSX — APPLICATION ROUTE DEFINITIONS
   Defines the URL structure using React Router v6.
   App is the root layout (header + footer).
   Child routes render inside App's <Outlet /> component.
   ============================================================ */

import { createBrowserRouter } from "react-router"
import App           from "./App"
import ProfilPage    from "./pages/ProfilPage"
import AjouterPinPage from "./pages/AjouterPinPage"
import FavoritesPage from "./pages/FavoritesPage"

export const router = createBrowserRouter([
  {
    // ROOT LAYOUT ROUTE — ALWAYS RENDERED (HEADER + FOOTER)
    path: "/",
    element: <App />,
    children: [
      // CHILD ROUTES — RENDERED INSIDE App's <Outlet />
      { path: "profil",    element: <ProfilPage /> },
      { path: "ajouter",   element: <AjouterPinPage /> },
      { path: "favorites", element: <FavoritesPage /> },
    ]
  }
])