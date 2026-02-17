import { createBrowserRouter } from "react-router";
import App from "./App"
import ProfilPage from "./pages/ProfilPage";
import AjouterPinPage from "./pages/AjouterPinPage";
import FavoritesPage from "./pages/FavoritesPage";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "profil", element: <ProfilPage />},
            { path: "ajouter", element: <AjouterPinPage />},
            { path: "favorites", element: <FavoritesPage />}
        ]
    }
])