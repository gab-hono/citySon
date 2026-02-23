/* ============================================================
   AJOUTERPIN.JSX — "ADD A SOUND" FORM PAGE
   Allows a user to submit a new sound pin to the database.
   Features:
   - Controlled form with all required fields
   - Interactive Leaflet map for coordinate selection
   - Confirmation modal with data summary before POST
   - beforeunload warning if user tries to leave with unsaved data
   Styles come from App.css (no local CSS file needed).
   ============================================================ */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import MapSelector from '../components/MapSelector'

// NO LOCAL CSS IMPORT — ALL STYLES ARE IN App.css

function AjouterPinPage() {

  const navigate = useNavigate()

  /* ── FORM STATE ─────────────────────────────────────────────
     Field names match the database column names for direct POST.
     ─────────────────────────────────────────────────────────── */
  const [formData, setFormData] = useState({
    title: '',
    inspiration_text: '',
    audio_url: '',
    author_name: '',
    location_name: '',
    latitude: '',
    longitude: '',
  })

  // TRACKS WHETHER THE FORM HAS BEEN MODIFIED (USED FOR EXIT WARNING)
  const [isModified, setIsModified] = useState(false)

  // CONTROLS VISIBILITY OF THE CONFIRMATION MODAL
  const [showConfirm, setShowConfirm] = useState(false)

  /* ── BROWSER EXIT WARNING ───────────────────────────────────
     Fires the native browser "leave page?" dialog if the user
     tries to close/refresh the tab with unsaved form data.
     Cleaned up when component unmounts.
     ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isModified) {
        e.preventDefault()
        e.returnValue = '' // REQUIRED FOR CHROME TO SHOW THE DIALOG
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isModified])

  /* ── HANDLERS ───────────────────────────────────────────── */

  // UPDATE A TEXT FIELD AND MARK FORM AS MODIFIED
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setIsModified(true)
  }

  // RECEIVE COORDINATES FROM THE MAP CLICK AND STORE IN FORM STATE
  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude:  lat.toFixed(6),
      longitude: lng.toFixed(6),
    }))
    setIsModified(true)
  }

  // VALIDATE FORM ON SUBMIT, THEN SHOW CONFIRMATION MODAL
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.latitude || !formData.longitude) {
      alert('📍 Veuillez sélectionner un point sur la carte.')
      return
    }
    setShowConfirm(true)
  }

  // SEND DATA TO BACKEND AFTER USER CONFIRMS IN MODAL
  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:4242/nouveaupin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Erreur serveur')

      // DISABLE EXIT WARNING BEFORE NAVIGATING AWAY
      setIsModified(false)
      setShowConfirm(false)
      navigate('/')

    } catch (err) {
      console.error('POST ERROR:', err)
      alert('❌ Une erreur est survenue. Vérifie que ton serveur tourne.')
      setShowConfirm(false)
    }
  }

  // CLOSE MODAL AND RETURN TO FORM WITHOUT LOSING DATA
  const handleCancel = () => setShowConfirm(false)


  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    <div className="page">
      <h1>Ajouter un son</h1>

      {/* ── MAIN FORM ── */}
      <form onSubmit={handleSubmit} noValidate className="ajouter-form">

        {/* TITLE FIELD */}
        <div className="form-field">
          <label htmlFor="title">
            Titre du son <span aria-hidden="true">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            aria-required="true"
            placeholder="Ex : Ambiance marché Bastille"
          />
        </div>

        {/* AUTHOR FIELD */}
        <div className="form-field">
          <label htmlFor="author_name">
            Auteur <span aria-hidden="true">*</span>
          </label>
          <input
            id="author_name"
            name="author_name"
            type="text"
            value={formData.author_name}
            onChange={handleChange}
            required
            aria-required="true"
            placeholder="Ton nom ou pseudonyme"
          />
        </div>

        {/* AUDIO URL FIELD */}
        <div className="form-field">
          <label htmlFor="audio_url">
            URL de l'audio <span aria-hidden="true">*</span>
          </label>
          <input
            id="audio_url"
            name="audio_url"
            type="url"
            value={formData.audio_url}
            onChange={handleChange}
            required
            aria-required="true"
            placeholder="https://soundcloud.com/..."
          />
        </div>

        {/* LISTENING LOCATION FIELD (OPTIONAL) */}
        <div className="form-field">
          <label htmlFor="location_name">Lieu d'écoute</label>
          <input
            id="location_name"
            name="location_name"
            type="text"
            value={formData.location_name}
            onChange={handleChange}
            placeholder="Ex : Métro Châtelet, ligne 4"
          />
        </div>

        {/* DESCRIPTION / INSPIRATION FIELD (OPTIONAL) */}
        <div className="form-field">
          <label htmlFor="inspiration_text">Description / Inspiration</label>
          <textarea
            id="inspiration_text"
            name="inspiration_text"
            value={formData.inspiration_text}
            onChange={handleChange}
            rows={4}
            placeholder="Décris le son, le contexte, l'ambiance..."
          />
        </div>

        {/* MAP COORDINATE SELECTOR FIELDSET */}
        <fieldset className="form-fieldset">
          <legend>
            Localisation <span aria-hidden="true">*</span>
          </legend>
          <p className="form-hint">Clique sur la carte pour placer ton son 📍</p>

          {/* INTERACTIVE MAP — CALLS handleLocationSelect ON CLICK */}
          <MapSelector
            lat={formData.latitude}
            lng={formData.longitude}
            onLocationSelect={handleLocationSelect}
          />

          {/* LIVE REGION: ANNOUNCES COORDINATE CHANGES TO SCREEN READERS */}
          <div aria-live="polite" className="coords-feedback">
            {formData.latitude && formData.longitude ? (
              <span className="coords-ok">
                ✓ Coordonnées : {formData.latitude}, {formData.longitude}
              </span>
            ) : (
              <span className="coords-empty">Aucune coordonnée sélectionnée</span>
            )}
          </div>
        </fieldset>

        {/* SUBMIT BUTTON */}
        <button type="submit" className="btn btn--primary ajouter-btn">
          Ajouter le son
        </button>

      </form>


      {/* ── CONFIRMATION MODAL ── */}
      {showConfirm && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal">
            <h2 id="modal-title">Confirmer l'ajout</h2>
            <p className="modal-subtitle">
              Résumé des données qui seront enregistrées :
            </p>

            {/* SEMANTIC DEFINITION LIST FOR DATA SUMMARY */}
            <dl className="modal-summary">
              <dt>Titre</dt>
              <dd>{formData.title}</dd>

              <dt>Auteur</dt>
              <dd>{formData.author_name}</dd>

              <dt>URL audio</dt>
              <dd className="modal-url">{formData.audio_url}</dd>

              <dt>Lieu d'écoute</dt>
              <dd>{formData.location_name || '—'}</dd>

              <dt>Description</dt>
              <dd>{formData.inspiration_text || '—'}</dd>

              <dt>Coordonnées</dt>
              <dd>{formData.latitude}, {formData.longitude}</dd>
            </dl>

            {/* ACTION BUTTONS: CONFIRM OR GO BACK TO EDITING */}
            <div className="modal-actions">
              <button onClick={handleConfirm} className="btn btn--primary">
                ✅ Confirmer
              </button>
              <button onClick={handleCancel} className="btn btn--ghost">
                ✏️ Continuer à éditer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AjouterPinPage