/* ============================================================
   EDITMODAL.JSX — EDIT FORM MODAL FOR AN EXISTING PIN
   Updated: the audio URL field now validates that the link
   belongs to SoundCloud, consistent with AjouterPinPage.
   ============================================================ */

import { useState } from "react"
import AbandonWarningModal from "./AbandonWarningModal"
import MapSelector from "./MapSelector"

const API = 'https://city-son.vercel.app/' 

// RETURNS TRUE ONLY IF THE URL BELONGS TO SOUNDCLOUD
// MIRRORS THE SAME HELPER USED IN AjouterPinPage
function isSoundCloudUrl(value) {
  try {
    const { hostname } = new URL(value)
    return hostname === 'soundcloud.com' || hostname === 'www.soundcloud.com' || hostname === 'on.soundcloud.com'
  } catch {
    return false
  }
}

export default function EditModal({ pin, onSave, onClose }) {

  // FORM STATE — PRE-FILLED WITH THE CURRENT PIN VALUES
  const [formData, setFormData] = useState({
    title:            pin.title            ?? '',
    audio_url:        pin.audio_url        ?? '',
    location_name:    pin.location_name    ?? '',
    inspiration_text: pin.inspiration_text ?? '',
    technology:       pin.technology       ?? '',
    latitude:         String(pin.latitude  ?? ''),
    longitude:        String(pin.longitude ?? ''),
  })

  // INLINE ERROR MESSAGE FOR THE AUDIO URL FIELD (NULL = NO ERROR)
  const [urlError, setUrlError] = useState(null)

  // CONTROLS VISIBILITY OF THE "ABANDON CHANGES?" WARNING MODAL
  const [showAbandonWarning, setShowAbandonWarning] = useState(false)

  // TRUE WHILE THE PUT REQUEST IS IN FLIGHT — DISABLES THE SAVE BUTTON
  const [saving, setSaving] = useState(false)

  // UPDATE A SINGLE FORM FIELD AND CLEAR THE URL ERROR WHEN THE USER RETYPES
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (e.target.name === 'audio_url') setUrlError(null)
  }

  // RECEIVE COORDINATES FROM THE MAP CLICK AND STORE IN FORM STATE
  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude:  lat.toFixed(6),
      longitude: lng.toFixed(6),
    }))
  }

  // SHOW THE ABANDON WARNING MODAL INSTEAD OF CLOSING IMMEDIATELY
  const handleAttemptClose = () => {
    setShowAbandonWarning(true)
  }

  // VALIDATE THE URL THEN SEND THE UPDATED DATA TO THE API VIA PUT REQUEST
  const handleSave = async () => {
    if (!formData.title || !formData.latitude || !formData.longitude) {
      alert('Veuillez compléter les champs obligatoires.')
      return
    }

    // BLOCK SAVE IF THE AUDIO URL IS NOT A VALID SOUNDCLOUD LINK
    if (!isSoundCloudUrl(formData.audio_url)) {
      setUrlError('Seuls les liens SoundCloud sont acceptés. Ex : https://soundcloud.com/artiste/titre')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`${API}/pins/${pin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()

      // PASS THE UPDATED PIN BACK TO THE PARENT TO REFRESH THE LIST
      onSave(data.data)
    } catch (err) {
      console.error(err)
      alert('❌ Une erreur est survenue lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="modal-overlay modal-overlay--edit" role="dialog" aria-modal="true">
        <div className="modal modal--edit">

          {/* ── MODAL HEADER: TITLE + CLOSE BUTTON ── */}
          <div className="modal-edit-header">
            <h2>Modifier l'œuvre</h2>
            <button
              className="pin-detail-close"
              onClick={handleAttemptClose}
              aria-label="Fermer"
            >✕</button>
          </div>

          {/* ── SCROLLABLE FORM BODY ── */}
          <div className="modal-edit-body">

            {/* TITLE — REQUIRED */}
            <div className="form-field">
              <label htmlFor="edit-title">Titre <span>*</span></label>
              <input
                id="edit-title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* SOUNDCLOUD URL — REQUIRED, VALIDATED ON SAVE */}
            <div className="form-field">
              <label htmlFor="edit-audio_url">Lien SoundCloud <span>*</span></label>
              <input
                id="edit-audio_url"
                name="audio_url"
                type="url"
                value={formData.audio_url}
                onChange={handleChange}
                required
                aria-describedby={urlError ? 'edit-audio-url-error' : undefined}
                aria-invalid={!!urlError}
                placeholder="https://soundcloud.com/artiste/titre"
                className={urlError ? 'input--error' : ''}
              />
              {/* INLINE ERROR — SHOWN ONLY WHEN THE URL IS NOT FROM SOUNDCLOUD */}
              {urlError && (
                <p id="edit-audio-url-error" className="form-error" role="alert">
                  {urlError}
                </p>
              )}
            </div>

            {/* LISTENING LOCATION — OPTIONAL */}
            <div className="form-field">
              <label htmlFor="edit-location_name">Lieu d'écoute</label>
              <input
                id="edit-location_name"
                name="location_name"
                type="text"
                value={formData.location_name}
                onChange={handleChange}
              />
            </div>

            {/* DESCRIPTION / INSPIRATION — OPTIONAL */}
            <div className="form-field">
              <label htmlFor="edit-inspiration_text">Description / Inspiration</label>
              <textarea
                id="edit-inspiration_text"
                name="inspiration_text"
                value={formData.inspiration_text}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* TECHNOLOGIES USED — OPTIONAL */}
            <div className="form-field">
              <label htmlFor="edit-technology">Technologies</label>
              <input
                id="edit-technology"
                name="technology"
                type="text"
                value={formData.technology}
                onChange={handleChange}
              />
            </div>

            {/* MAP COORDINATE SELECTOR — REQUIRED */}
            <fieldset className="form-fieldset">
              <legend>Localisation <span>*</span></legend>
              <p className="form-hint">Cliquez sur la carte pour repositionner le son 📍</p>

              {/* INTERACTIVE MAP — CALLS handleLocationSelect ON CLICK */}
              <MapSelector
                lat={formData.latitude}
                lng={formData.longitude}
                onLocationSelect={handleLocationSelect}
              />

              {/* LIVE REGION: ANNOUNCES COORDINATE CHANGES TO SCREEN READERS */}
              <div aria-live="polite" className="coords-feedback">
                {formData.latitude && formData.longitude ? (
                  <span className="coords-ok">✓ {formData.latitude}, {formData.longitude}</span>
                ) : (
                  <span className="coords-empty">Aucune coordonnée</span>
                )}
              </div>
            </fieldset>
          </div>

          {/* ── MODAL FOOTER: SAVE + ABANDON BUTTONS ── */}
          <div className="modal-edit-footer">

            {/* SAVE BUTTON — DISABLED WHILE THE REQUEST IS IN FLIGHT */}
            <button
              onClick={handleSave}
              className="btn btn--primary"
              disabled={saving}
            >
              {saving ? 'Sauvegarde...' : '✅ Confirmer les changements'}
            </button>

            {/* ABANDON BUTTON — SHOWS THE WARNING MODAL BEFORE CLOSING */}
            <button
              onClick={handleAttemptClose}
              className="btn btn--ghost"
            >
              Abandonner
            </button>
          </div>
        </div>
      </div>

      {/* ABANDON WARNING MODAL — SHOWN WHEN THE USER TRIES TO CLOSE WITH UNSAVED CHANGES */}
      {showAbandonWarning && (
        <AbandonWarningModal
          onLeave={() => { setShowAbandonWarning(false); onClose() }}
          onContinue={() => setShowAbandonWarning(false)}
        />
      )}
    </>
  )
}