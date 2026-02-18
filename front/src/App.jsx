import './App.css'
import { Link, Outlet, useLocation } from 'react-router'
import MapView from './components/MapView'
import PinDetail from './components/PinDetail'
import { useState } from 'react'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [selectedPin, setSelectedPin] = useState(null)

  return (
    <div className="app-wrapper">
      <header className="header">
        <Link to="/" className="logo">CitySon</Link>
        <nav className="nav">
          <Link to="/profil" className="nav-link">Mon Profil</Link>
          <Link to="/favorites" className="nav-link">Mes Favoris</Link>
          <Link to="/ajouter" className="nav-link nav-link--cta">+ Ajouter un son</Link>
        </nav>
      </header>

      <main className="main">
        {isHome ? (
          <div className="home">
            <div className="home-box">
              <h1 className="home-title">CitySon</h1>
              <p className="home-subtitle">
                Cartographie sonore de Paris. Explorez, écoutez, déposez vos sons.
              </p>
              <Link to="/ajouter" className="btn btn--primary">Déposer un son</Link>
            </div>
            <div className="home-map-placeholder">
              <MapView onPinSelect={setSelectedPin} />
              {selectedPin && (
                <PinDetail 
                  pin={selectedPin} 
                  onClose={() => setSelectedPin(null)} 
                />
              )}
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <footer className="footer">
        <p>CitySon, une application de performance sonore créé par <strong>©Gabriel Hono</strong></p>
      </footer>
    </div>
  )
}

export default App