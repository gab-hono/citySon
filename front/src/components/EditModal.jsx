/* ============================================================
   EDITMODAL.JSX — EDIT FORM MODAL FOR AN EXISTING PIN
   Allows the user to update all fields of a posted pin.
   - Pre-fills the form with the current pin data
   - Shows an AbandonWarningModal if the user tries to close
     the modal after making changes
   - Sends a PUT request to the API on confirmation
   Props:
   - pin    : the pin object to edit (used to pre-fill the form)
   - onSave : called with the updated pin object after a successful save
   - onClose: called when the modal should be closed without saving
   ============================================================ */

import { useState } from "react"
import AbandonWarningModal from "./AbandonWarningModal"
import MapSelector from "./MapSelector"

const API = 'http://localhost:4242'

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

  // CONTROLS VISIBILITY OF THE "ABANDON CHANGES?" WARNING MODAL
  const [showAbandonWarning, setShowAbandonWarning] = useState(false)

  // TRUE WHILE THE PUT REQUEST IS IN FLIGHT — DISABLES THE SAVE BUTTON
  const [saving, setSaving] = useState(false)

  // UPDATE A SINGLE FORM FIELD BY NAME
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
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

  // SEND THE UPDATED FORM DATA TO THE API VIA PUT REQUEST
  const handleSave = async () => {
    if (!formData.title || !formData.audio_url || !formData.latitude || !formData.longitude) {
      alert('Veuillez compléter les champs obligatoires.')
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

            {/* AUDIO URL — REQUIRED */}
            <div className="form-field">
              <label htmlFor="edit-audio_url">URL de l'audio <span>*</span></label>
              <input
                id="edit-audio_url"
                name="audio_url"
                type="url"
                value={formData.audio_url}
                onChange={handleChange}
                required
              />
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