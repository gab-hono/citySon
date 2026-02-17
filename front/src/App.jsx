import './App.css'
import { Link, Outlet, useLocation } from 'react-router'

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

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
            <div className="home__hero">
              <h1 className="home__title">CitySon</h1>
              <p className="home__subtitle">
                Cartographie sonore de Paris — explorez, écoutez, déposez vos sons.
              </p>
              <Link to="/ajouter" className="btn btn--primary">Déposer un son</Link>
            </div>
            <div className="home__map-placeholder">
              <span>🗺 Carte interactive — à venir</span>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <footer className="footer">
        <p>CitySon — créé par <strong>©Gabriel Hono</strong></p>
      </footer>
    </div>
  )
}

export default App