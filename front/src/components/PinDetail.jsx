/* ============================================================
   PINDETAIL.JSX — SLIDE-UP PANEL FOR SELECTED MAP PIN
   Updated:
   - The external audio link is replaced by an embedded SoundCloud
     player built from the stored URL
   - A helper function converts a standard SoundCloud page URL
     into the embed iframe src required by the SoundCloud widget API
   ============================================================ */

import { useState, useEffect } from 'react'

const CURRENT_USER_ID = '44360181-1cbf-4a49-ac4c-af815a001ae1'
const API = 'https://city-son.vercel.app'

/* ── SOUNDCLOUD EMBED HELPER ────────────────────────────────
   Converts a standard SoundCloud track URL into the src URL
   needed for the <iframe> embed player.
   Example input  : https://soundcloud.com/artist/track-name
   Example output : https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/...
   The simplest approach supported by SoundCloud is to pass the
   original page URL directly as the `url` parameter — their
   oEmbed-compatible player resolves it automatically.
   ─────────────────────────────────────────────────────────── */
function buildEmbedSrc(pageUrl) {
  const encoded = encodeURIComponent(pageUrl)
  return (
    `https://w.soundcloud.com/player/?url=${encoded}` +
    `&color=%23c8f135` +   // ACCENT COLOR MATCHING THE APP THEME
    `&auto_play=false` +
    `&hide_related=true` +
    `&show_comments=false` +
    `&show_user=true` +
    `&show_reposts=false` +
    `&show_teaser=false`
  )
}

export default function PinDetail({ pin, onClose }) {

  // TRACKS WHETHER THE PIN IS IN THE CURRENT USER'S FAVORITES
  const [isFavori, setIsFavori]     = useState(false)

  // TRUE WHILE THE FAVORITE TOGGLE REQUEST IS IN FLIGHT
  const [favLoading, setFavLoading] = useState(false)

  // SUCCESS TOAST MESSAGE (NULL = TOAST HIDDEN)
  const [toast, setToast]           = useState(null)

  // CHECK WHETHER THIS PIN IS ALREADY A FAVORITE WHEN THE PANEL OPENS
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

  // DO NOT RENDER ANYTHING IF NO PIN IS SELECTED
  if (!pin) return null

  // ADD OR REMOVE THE PIN FROM THE USER'S FAVORITES
  const handleToggleFavori = async () => {
    setFavLoading(true)
    try {
      if (isFavori) {
        // REMOVE FROM FAVORITES
        const res = await fetch(`${API}/favoris/${pin.id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
        setIsFavori(false)
        setToast('Retiré des favoris')
      } else {
        // ADD TO FAVORITES
        const res = await fetch(`${API}/favoris`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin_id: pin.id }),
        })
        // 409 CONFLICT MEANS IT WAS ALREADY A FAVORITE — SYNC STATE SILENTLY
        if (res.status === 409) { setIsFavori(true); return }
        if (!res.ok) throw new Error()
        setIsFavori(true)
        setToast('Ajouté aux favoris ♡')
      }
    } catch (err) {
      console.error(err)
      alert('❌ Erreur lors de la mise à jour des favoris.')
    } finally {
      setFavLoading(false)
      setTimeout(() => setToast(null), 2800)
    }
  }

  return (
    <div className="pin-detail" role="complementary" aria-label={`Détails : ${pin.title}`}>

      {/* STICKY PANEL HEADER WITH TITLE AND CLOSE BUTTON */}
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

      {/* SCROLLABLE CONTENT BODY */}
      <div className="pin-detail-content">

        <div className="pin-detail-field">
          <span className="pin-detail-label">Auteur</span>
          <span className="pin-detail-text">{pin.author_name}</span>
        </div>

        <div className="pin-detail-field">
          <span className="pin-detail-label">Lieu d'écoute</span>
          <span className="pin-detail-text">{pin.location_name}</span>
        </div>

        {/* SOUNDCLOUD EMBEDDED PLAYER — REPLACES THE PLAIN EXTERNAL LINK */}
        {pin.audio_url && (
          <div className="pin-detail-field pin-detail-field--full pin-detail-field--audio">
            <span className="pin-detail-label">Écouter</span>
            <iframe
              className="pin-detail-player"
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={buildEmbedSrc(pin.audio_url)}
              title={`Écouter : ${pin.title}`}
            />
          </div>
        )}

        {/* DESCRIPTION — SHOWN ONLY IF IT EXISTS */}
        {pin.inspiration_text && (
          <div className="pin-detail-field pin-detail-field--full">
            <span className="pin-detail-label">Description</span>
            <p className="pin-detail-text">{pin.inspiration_text}</p>
          </div>
        )}

        {/* TECHNOLOGIES — SHOWN ONLY IF THEY EXIST */}
        {pin.technology && (
          <div className="pin-detail-field pin-detail-field--full">
            <span className="pin-detail-label">Technologies pour la création</span>
            <span className="pin-detail-text">{pin.technology}</span>
          </div>
        )}

        {/* FAVORITE TOGGLE BUTTON */}
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

      {/* INLINE TOAST — DISPLAYED AT THE BOTTOM OF THE PANEL */}
      {toast && (
        <div className="pin-detail-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  )
}