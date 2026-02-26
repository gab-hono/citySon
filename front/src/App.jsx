/* ============================================================
   APP.JSX — ROOT APPLICATION COMPONENT
   Handles global layout: header, footer, routing shell.
   Conditionally renders the home page (map + hero) or
   inner pages via React Router's <Outlet />.
   Updated: PinDetail is now rendered outside the map container
   on mobile so it appears below the map and remains closeable,
   while on desktop it keeps its absolute overlay behaviour.
   ============================================================ */

import './App.css'
import { Link, Outlet, useLocation } from 'react-router'
import MapView from './components/MapView'
import PinDetail from './components/PinDetail'
import { useState } from 'react'

function App() {

  // DETERMINE IF WE ARE ON THE HOME ROUTE TO SHOW THE MAP LAYOUT
  const location = useLocation()
  const isHome = location.pathname === '/'

  // TRACK WHICH PIN IS SELECTED TO SHOW THE DETAIL PANEL (NULL = NONE)
  const [selectedPin, setSelectedPin] = useState(null)

  return (
    <div className="app-wrapper">

      {/* STICKY HEADER WITH LOGO AND NAV */}
      <header className="header">
        <Link to="/" className="logo">CitySon</Link>
        <nav className="nav" aria-label="Navigation principale">
          <Link to="/profil"    className="nav-link">Mon Profil</Link>
          <Link to="/favorites" className="nav-link">Mes Favoris</Link>
          <Link to="/ajouter"   className="nav-link nav-link--cta">+ Ajouter un son</Link>
        </nav>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="main">
        {isHome ? (

          // HOME LAYOUT: HERO COLUMN + FULL-HEIGHT MAP
          <div className="home">

            {/* HERO SECTION: TITLE, SUBTITLE, CTA BUTTON */}
            <div className="home-box">
              <h1 className="home-title">CitySon</h1>
              <p className="home-subtitle">
                Cartographie sonore de Paris.<br />
                Explorez, écoutez, déposez vos sons.
              </p>
              <Link to="/ajouter" className="btn btn--primary">
                Déposer un son
              </Link>
            </div>

            {/* MAP AREA: FILLS REMAINING SPACE */}
            {/* ON DESKTOP: PinDetail overlays on top of the map (absolute) */}
            {/* ON MOBILE:  PinDetail renders BELOW the map (see .pin-detail-mobile-wrapper) */}
            <div className="home-map-col">

              <div className="home-map-placeholder">
                {/* MAP COMPONENT: CALLS setSelectedPin WHEN A MARKER IS CLICKED */}
                <MapView onPinSelect={setSelectedPin} />

                {/* DESKTOP-ONLY OVERLAY — HIDDEN ON MOBILE VIA CSS */}
                {selectedPin && (
                  <div className="pin-detail-desktop-overlay">
                    <PinDetail
                      pin={selectedPin}
                      onClose={() => setSelectedPin(null)}
                    />
                  </div>
                )}
              </div>

              {/* MOBILE-ONLY SLOT — RENDERED IN NORMAL FLOW BELOW THE MAP */}
              {/* HIDDEN ON DESKTOP VIA CSS */}
              {selectedPin && (
                <div className="pin-detail-mobile-wrapper">
                  <PinDetail
                    pin={selectedPin}
                    onClose={() => setSelectedPin(null)}
                  />
                </div>
              )}

            </div>
          </div>

        ) : (
          // ALL OTHER ROUTES RENDER THEIR PAGE COMPONENT HERE
          <Outlet />
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p>CitySon, une application de performance sonore créée par <strong>©Gabriel Hono</strong></p>
      </footer>

    </div>
  )
}

export default App