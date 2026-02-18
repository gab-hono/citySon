import './App.css'
import { Link, Outlet, useLocation } from 'react-router'
import MapView from './components/MapView'
import PinDetail from './components/PinDetail'
import { useState } from 'react'

function App() {
  // TRACK CURRENT ROUTE TO CONDITIONALLY RENDER HOME OR OTHER PAGES
  const location = useLocation()
  const isHome = location.pathname === '/'
  
  // STATE TO MANAGE WHICH PIN IS CURRENTLY SELECTED (NULL IF NONE)
  const [selectedPin, setSelectedPin] = useState(null)

  return (
    <div className="app-wrapper">
      
      {/* HEADER WITH LOGO AND NAVIGATION LINKS */}
      <header className="header">
        <Link to="/" className="logo">CitySon</Link>
        <nav className="nav">
          <Link to="/profil" className="nav-link">Mon Profil</Link>
          <Link to="/favorites" className="nav-link">Mes Favoris</Link>
          <Link to="/ajouter" className="nav-link nav-link--cta">+ Ajouter un son</Link>
        </nav>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="main">
        {isHome ? (
          // HOME PAGE LAYOUT: HERO SECTION + MAP
          <div className="home">
            
            {/* LEFT SIDE: HERO SECTION WITH TITLE AND CTA */}
            <div className="home-box">
              <h1 className="home-title">CitySon</h1>
              <p className="home-subtitle">
                Cartographie sonore de Paris. Explorez, écoutez, déposez vos sons.
              </p>
              <Link to="/ajouter" className="btn btn--primary">Déposer un son</Link>
            </div>
            
            {/* RIGHT SIDE: MAP WITH PIN DETAIL OVERLAY */}
            <div className="home-map-placeholder">
              {/* MAP COMPONENT - PASSES SELECTED PIN BACK TO APP */}
              <MapView onPinSelect={setSelectedPin} />
              
              {/* PIN DETAIL PANEL - ONLY SHOWS WHEN A PIN IS SELECTED */}
              {selectedPin && (
                <PinDetail 
                  pin={selectedPin} 
                  onClose={() => setSelectedPin(null)} 
                />
              )}
            </div>
          </div>
        ) : (
          // OTHER PAGES (PROFIL, FAVORITES, AJOUTER) RENDER HERE VIA REACT ROUTER
          <Outlet />
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>CitySon, une application de performance sonore créé par <strong>©Gabriel Hono</strong></p>
      </footer>
    </div>
  )
}

export default App