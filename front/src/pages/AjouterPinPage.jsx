/* ============================================================
   AJOUTERPIN.JSX — "ADD A SOUND" FORM PAGE
   Allows a user to submit a new sound pin to the database.
   Features:
   - Controlled form with all required fields
   - Interactive Leaflet map for coordinate selection
   - Confirmation modal with data summary before POST
   - beforeunload warning if user tries to leave with unsaved data
   ============================================================ */

import { useState } from 'react'
import { useNavigate } from 'react-router'
import MapSelector from '../components/MapSelector'
import ConfirmModal from '../components/ConfirmModal'

const INITIAL_FORM = {
  title: '',
  inspiration_text: '',
  audio_url: '',
  author_name: '',
  location_name: '',
  latitude: '',
  longitude: '',
}

function AjouterPinPage() {

  const navigate = useNavigate() // ALLOWS TO NAVIGATE DIRECTLY AFTER A BUTTON ACTION
  const [formData, setFormData] = useState(INITIAL_FORM) // DECLARES THE INITIAL DATA OF THE FORM AND STORES THE INFORMATION ON THE INPUT FIELDS
  const [showConfirm, setShowConfirm] = useState(false) // CONTROLS THE VISIBILITY OF THE CONFIRMATION MODAL

  /* ── HANDLERS ─── */

  // UPDATE A TEXT FIELD AND MARK FORM AS MODIFIED
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

  // VALIDATE FORM ON SUBMIT, THEN SHOW CONFIRMATION MODAL
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.latitude || !formData.longitude || !formData.audio_url || !formData.title) {
      alert('📍 Veuillez sélectionner un point sur la carte et compléter les champs obligatoires du formulaire.')
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
      setShowConfirm(false)
      navigate('/')

    } catch (err) {
      console.error('POST ERROR:', err)
      alert('❌ Une erreur est survenue. Vérifie que ton serveur tourne et que tous les champs soient remplis.')
      setShowConfirm(false)
    }
  }

  // CLOSE MODAL AND RETURN TO FORM WITHOUT LOSING DATA
  const handleCancel = () => setShowConfirm(false)


  /* ── RENDER ─ */
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
            placeholder="Votre nom ou pseudonyme"
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
            placeholder="Lien vers votre audio (Ex. https://soundcloud.com/...)"
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
            placeholder="Ex : Arbre au milieu de la place"
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
            placeholder="Décrivez le son, le contexte, l'ambiance..."
          />
        </div>

        {/* MAP COORDINATE SELECTOR FIELDSET */}
        <fieldset className="form-fieldset">
          <legend>
            Localisation <span aria-hidden="true">*</span>
          </legend>
          <p className="form-hint">Cliquez sur la carte pour placer ton son 📍</p>

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
        <ConfirmModal
          data={formData}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}


    </div>
  )
}

export default AjouterPinPage