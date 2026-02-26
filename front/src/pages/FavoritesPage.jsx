/* ============================================================
   FAVORITESPAGE.JSX — PÁGINA "MES FAVORIS"
   Muestra los pines marcados como favoritos por el usuario.
   Permite eliminar cada uno de la lista.
   ============================================================ */

import { useState, useEffect } from 'react'
import Toast from '../components/Toast'

const CURRENT_USER_ID = '44360181-1cbf-4a49-ac4c-af815a001ae1'
const API = 'http://localhost:4242'

function FavoriCard({ pin, onRemove }) {
  return (
    <div className="pin-card">
      <div className="pin-card-info">
        <h3 className="pin-card-title">{pin.title}</h3>
        <p className="pin-card-location">📍 {pin.location_name || '—'}</p>
        {pin.author_name && (
          <p className="pin-card-author">par {pin.author_name}</p>
        )}
        {pin.inspiration_text && (
          <p className="pin-card-desc">{pin.inspiration_text}</p>
        )}
        {pin.audio_url && (
          <a
            href={pin.audio_url}
            target="_blank"
            rel="noreferrer"
            className="pin-card-audio-link"
          >
            🎵 Écouter
          </a>
        )}
      </div>
      <div className="pin-card-actions">
        <button
          className="btn btn--danger-ghost btn--sm"
          onClick={() => onRemove(pin)}
          aria-label={`Retirer "${pin.title}" des favoris`}
        >
          ♡ Retirer des favoris
        </button>
      </div>
    </div>
  )
}

export default function FavoritesPage() {
  const [favoris, setFavoris] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast]     = useState(null)

  useEffect(() => {
    fetch(`${API}/users/${CURRENT_USER_ID}/favoris`)
      .then(r => r.json())
      .then(data => setFavoris(data.favoris ?? []))
      .catch(err => console.error('Erreur chargement favoris:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (pin) => {
    try {
      const res = await fetch(`${API}/favoris/${pin.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur serveur')
      setFavoris(prev => prev.filter(f => f.id !== pin.id))
      setToast(`« ${pin.title} » retiré des favoris.`)
    } catch (err) {
      console.error(err)
      alert('❌ Erreur lors de la suppression du favori.')
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="profil-loading">Chargement des favoris…</div>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Mes Favoris</h1>

      {favoris.length === 0 ? (
        <div className="profil-empty-state">
          <p className="profil-empty">♡ Vous n'avez pas encore de sons favoris.</p>
          <p className="profil-empty-hint">
            Explorez la carte et cliquez sur ♡ pour ajouter des sons à cette liste.
          </p>
        </div>
      ) : (
        <ul className="pin-list" role="list">
          {favoris.map(pin => (
            <li key={pin.favori_id ?? pin.id}>
              <FavoriCard pin={pin} onRemove={handleRemove} />
            </li>
          ))}
        </ul>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}