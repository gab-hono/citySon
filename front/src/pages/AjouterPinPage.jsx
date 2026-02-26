/* ============================================================
   AJOUTERPIN.JSX — "ADD A SOUND" FORM PAGE
   Actualizado: eliminado campo "Auteur" — se llena automáticamente
   con el username del usuario activo en el backend.
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

function AjouterPinPage() {
  const navigate = useNavigate()
  const [formData, setFormData]   = useState(INITIAL_FORM)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude:  lat.toFixed(6),
      longitude: lng.toFixed(6),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.latitude || !formData.longitude || !formData.audio_url || !formData.title) {
      alert('📍 Veuillez sélectionner un point sur la carte et compléter les champs obligatoires.')
      return
    }
    setShowConfirm(true)
  }

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

        {/* TITRE */}
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

        {/* AUDIO URL */}
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

        {/* LIEU D'ÉCOUTE */}
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

        {/* DESCRIPTION */}
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

        {/* TECHNOLOGIES */}
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

        {/* MAPA */}
        <fieldset className="form-fieldset">
          <legend>
            Localisation <span aria-hidden="true">*</span>
          </legend>
          <p className="form-hint">Cliquez sur la carte pour placer ton son 📍</p>
          <MapSelector
            lat={formData.latitude}
            lng={formData.longitude}
            onLocationSelect={handleLocationSelect}
          />
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