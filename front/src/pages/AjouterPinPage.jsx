/* ============================================================
   AJOUTERPIN.JSX — "ADD A SOUND" FORM PAGE
   Updated: the audio URL field now only accepts SoundCloud links.
   A validation helper checks the URL format on submit and
   displays an inline error if the link is not from SoundCloud.
   ============================================================ */

import { useState } from 'react'
import { useNavigate } from 'react-router'
import MapSelector from '../components/MapSelector'
import ConfirmModal from '../components/ConfirmModal'

const INITIAL_FORM = {
  title: '',
  inspiration_text: '',
  audio_url: '',
  location_name: '',
  latitude: '',
  longitude: '',
  technology: '',
}

// RETURNS TRUE ONLY IF THE URL BELONGS TO SOUNDCLOUD
// ACCEPTS: soundcloud.com/... AND www.soundcloud.com/...
// REJECTS: any other domain or malformed URL
function isSoundCloudUrl(value) {
  try {
    const { hostname } = new URL(value)
    return hostname === 'soundcloud.com' || hostname === 'www.soundcloud.com' || hostname === 'on.soundcloud.com'
  } catch {
    return false
  }
}

function AjouterPinPage() {
  const navigate = useNavigate()
  const [formData, setFormData]       = useState(INITIAL_FORM)
  const [showConfirm, setShowConfirm] = useState(false)

  // INLINE ERROR MESSAGE FOR THE AUDIO URL FIELD (NULL = NO ERROR)
  const [urlError, setUrlError]       = useState(null)

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

  // VALIDATE ALL REQUIRED FIELDS BEFORE SHOWING THE CONFIRMATION MODAL
  const handleSubmit = (e) => {
    e.preventDefault()

    // CHECK THAT THE AUDIO URL IS A VALID SOUNDCLOUD LINK
    if (!isSoundCloudUrl(formData.audio_url)) {
      setUrlError('Seuls les liens SoundCloud sont acceptés. Ex : https://soundcloud.com/artiste/titre')
      return
    }

    if (!formData.latitude || !formData.longitude || !formData.title) {
      alert('📍 Veuillez sélectionner un point sur la carte et compléter les champs obligatoires.')
      return
    }

    setShowConfirm(true)
  }

  // SEND THE FORM DATA TO THE BACKEND AFTER THE USER CONFIRMS IN THE MODAL
  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:4242/nouveaupin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Erreur serveur')
      setShowConfirm(false)
      navigate('/')
    } catch (err) {
      console.error('POST ERROR:', err)
      alert('❌ Une erreur est survenue. Vérifie que ton serveur tourne et que tous les champs soient remplis.')
      setShowConfirm(false)
    }
  }

  return (
    <div className="page">
      <h1>Ajouter un son</h1>

      <form onSubmit={handleSubmit} noValidate className="ajouter-form">

        {/* TITLE — REQUIRED */}
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

        {/* SOUNDCLOUD URL — REQUIRED, VALIDATED ON SUBMIT */}
        <div className="form-field">
          <label htmlFor="audio_url">
            Lien SoundCloud <span aria-hidden="true">*</span>
          </label>
          <input
            id="audio_url"
            name="audio_url"
            type="url"
            value={formData.audio_url}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby={urlError ? 'audio-url-error' : undefined}
            aria-invalid={!!urlError}
            placeholder="https://soundcloud.com/artiste/titre"
            className={urlError ? 'input--error' : ''}
          />
          {/* INLINE ERROR — SHOWN ONLY WHEN THE URL IS NOT FROM SOUNDCLOUD */}
          {urlError && (
            <p id="audio-url-error" className="form-error" role="alert">
              {urlError}
            </p>
          )}
        </div>

        {/* LISTENING LOCATION — OPTIONAL */}
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

        {/* DESCRIPTION / INSPIRATION — OPTIONAL */}
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

        {/* TECHNOLOGIES USED — OPTIONAL */}
        <div className="form-field">
          <label htmlFor="technology">Technologies utilisées</label>
          <input
            id="technology"
            name="technology"
            type="text"
            value={formData.technology}
            onChange={handleChange}
            placeholder="Ex : Max/MSP, Ableton Live..."
          />
        </div>

        {/* MAP COORDINATE SELECTOR — REQUIRED */}
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

        <button type="submit" className="btn btn--primary ajouter-btn">
          Ajouter le son
        </button>

      </form>

      {/* CONFIRMATION MODAL — SHOWN AFTER SUCCESSFUL VALIDATION */}
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