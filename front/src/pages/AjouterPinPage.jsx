import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import MapSelector from '../components/MapSelector'
import './AjouterPin.css'

function AjouterPinPage() {

  const navigate = useNavigate()

  // État du formulaire (noms alignés sur la BDD)
  const [formData, setFormData] = useState({
    title: '',
    inspiration_text: '',
    audio_url: '',
    author_name: '',
    location_name: '',
    latitude: '',
    longitude: '',
  })

  //Le formulaire a-t-il été modifié ?
  const [isModified, setIsModified] = useState(false)

  // Afficher la modale de confirmation
  const [showConfirm, setShowConfirm] = useState(false)

  //Avertissement navigateur si on ferme/recharge l'onglet
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isModified) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isModified])

  // Mise à jour des champs texte
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setIsModified(true)
  }

  // Mise à jour des coordonnées depuis la carte
  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }))
    setIsModified(true)
  }

  // Clic sur "Ajouter le son" → validation + modale
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.latitude || !formData.longitude) {
      alert('📍 Veuillez sélectionner un point sur la carte.')
      return
    }
    setShowConfirm(true)
  }

  // Confirmation → envoi au backend
  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:4242/nouveaupin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Erreur serveur')

      setIsModified(false)   // Désactive l'alerte de sortie
      setShowConfirm(false)
      navigate('/')        // Retour à la carte
    } catch (err) {
      console.error(err)
      alert('❌ Une erreur est survenue. Vérifie que ton serveur tourne.')
      setShowConfirm(false)
    }
  }

  // Annulation → retour au formulaire
  const handleCancel = () => setShowConfirm(false)

  return (
    <div className="page">
      <h1>Ajouter un son</h1>

      <form onSubmit={handleSubmit} noValidate className="ajouter-form">

        {/* Titre */}
        <div className="form-field">
          <label htmlFor="title">Titre du son <span aria-hidden="true">*</span></label>
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

        {/* Auteur */}
        <div className="form-field">
          <label htmlFor="author_name">Auteur <span aria-hidden="true">*</span></label>
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

        {/* URL Audio */}
        <div className="form-field">
          <label htmlFor="audio_url">URL de l'audio <span aria-hidden="true">*</span></label>
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

        {/* Lieu d'écoute */}
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

        {/* Description */}
        <div className="form-field form-field--full">
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

        {/* Carte */}
        <fieldset className="form-field form-field--full form-fieldset">
          <legend>Localisation <span aria-hidden="true">*</span></legend>
          <p className="form-hint">Clique sur la carte pour placer ton son 📍</p>

          <MapSelector
            lat={formData.latitude}
            lng={formData.longitude}
            onLocationSelect={handleLocationSelect}
          />

          {/* Feedback accessible en live */}
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

      {/* MODALE DE CONFIRMATION */}
      {showConfirm && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal">
            <h2 id="modal-title">Confirmer l'ajout</h2>
            <p className="modal-subtitle">Résumé des données qui seront enregistrées :</p>

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