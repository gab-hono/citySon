/* ============================================================
   PINDETAIL.JSX — SLIDE-UP PANEL FOR SELECTED MAP PIN
   Actualizado: botón "Ajouter aux favoris" / "Retirer des favoris"
   ============================================================ */

import { useState, useEffect } from 'react'

const CURRENT_USER_ID = '44360181-1cbf-4a49-ac4c-af815a001ae1'
const API = 'http://localhost:4242'

export default function PinDetail({ pin, onClose }) {
  const [isFavori, setIsFavori]   = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [toast, setToast]          = useState(null)

  // Verificar si ya es favorito al abrir el panel
  useEffect(() => {
    if (!pin) return
    fetch(`${API}/users/${CURRENT_USER_ID}/favoris`)
      .then(r => r.json())
      .then(data => {
        const ids = (data.favoris ?? []).map(f => f.id)
        setIsFavori(ids.includes(pin.id))
      })
      .catch(() => {})
  }, [pin])

  if (!pin) return null

  const handleToggleFavori = async () => {
    setFavLoading(true)
    try {
      if (isFavori) {
        // Eliminar de favoritos
        const res = await fetch(`${API}/favoris/${pin.id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
        setIsFavori(false)
        setToast('Retiré des favoris')
      } else {
        // Agregar a favoritos
        const res = await fetch(`${API}/favoris`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin_id: pin.id }),
        })
        if (!res.ok) {
          const data = await res.json()
          if (res.status === 409) {
            setIsFavori(true)
            return
          }
          throw new Error(data.message)
        }
        setIsFavori(true)
        setToast('Ajouté aux favoris ♡')
      }
    } catch (err) {
      console.error(err)
      alert('❌ Erreur lors de la mise à jour des favoris.')
    } finally {
      setFavLoading(false)
      // Auto-hide toast
      if (toast) setTimeout(() => setToast(null), 2800)
    }
  }

  return (
    <div className="pin-detail" role="complementary" aria-label={`Détails : ${pin.title}`}>

      {/* STICKY HEADER */}
      <div className="pin-detail-header">
        <h2 className="pin-detail-title">{pin.title}</h2>
        <button
          className="pin-detail-close"
          onClick={onClose}
          aria-label="Fermer le panneau"
        >
          ✕
        </button>
      </div>

      {/* CONTENT BODY */}
      <div className="pin-detail-content">

        <div className="pin-detail-field">
          <span className="pin-detail-label">Auteur</span>
          <span className="pin-detail-text">{pin.author_name}</span>
        </div>

        <div className="pin-detail-field">
          <span className="pin-detail-label">Lieu d'écoute</span>
          <span className="pin-detail-text">{pin.location_name}</span>
        </div>

        {pin.audio_url && (
          <div className="pin-detail-field">
            <span className="pin-detail-label">Lien à l'audio</span>
            <a
              className="pin-detail-audio"
              href={pin.audio_url}
              title={`Écouter : ${pin.title}`}
              target="_blank"
              rel="noreferrer"
            >
              Lien externe vers {pin.title}
            </a>
          </div>
        )}

        {pin.inspiration_text && (
          <div className="pin-detail-field pin-detail-field--full">
            <span className="pin-detail-label">Description</span>
            <p className="pin-detail-text">{pin.inspiration_text}</p>
          </div>
        )}

        {pin.technology && (
          <div className="pin-detail-field pin-detail-field--full">
            <span className="pin-detail-label">Technologies pour la création</span>
            <span className="pin-detail-text">{pin.technology}</span>
          </div>
        )}

        {/* BOTÓN FAVORITO */}
        <div className="pin-detail-field pin-detail-field--full">
          <button
            className={`btn ${isFavori ? 'btn--favori-active' : 'btn--favori'}`}
            onClick={handleToggleFavori}
            disabled={favLoading}
            aria-pressed={isFavori}
          >
            {favLoading
              ? '…'
              : isFavori
                ? '♥ Retirer de mes favoris'
                : '♡ Ajouter aux favoris'
            }
          </button>
        </div>

      </div>

      {/* TOAST */}
      {toast && (
        <div className="pin-detail-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  )
}