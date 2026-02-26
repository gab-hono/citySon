/* ============================================================
   PROFILPAGE.JSX — USER PROFILE PAGE
   Sections:
   1. User's personal information (hardcoded ID until authentication
      is implemented)
   2. List of pins posted by the user, with "Edit" and "Delete" buttons
   ============================================================ */

import { useState, useEffect } from 'react'
import Toast from '../components/Toast'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import EditModal from '../components/EditModal'
import PinCard from '../components/PinCard'

// REFERENCE USER — USED AS PLACEHOLDER UNTIL AUTH IS IMPLEMENTED
const CURRENT_USER_ID = '44360181-1cbf-4a49-ac4c-af815a001ae1'
const API = 'http://localhost:4242'

export default function ProfilPage() {

  // USER OBJECT FETCHED FROM THE API
  const [user, setUser]               = useState(null)

  // LIST OF PINS POSTED BY THE CURRENT USER
  const [pins, setPins]               = useState([])

  // LOADING STATE: TRUE WHILE FETCHING USER + PINS DATA
  const [loading, setLoading]         = useState(true)

  // PIN CURRENTLY BEING EDITED (NULL = EDIT MODAL CLOSED)
  const [editingPin, setEditingPin]   = useState(null)

  // PIN CURRENTLY PENDING DELETION (NULL = DELETE MODAL CLOSED)
  const [deletingPin, setDeletingPin] = useState(null)

  // SUCCESS TOAST MESSAGE (NULL = TOAST HIDDEN)
  const [toast, setToast]             = useState(null)

  // FETCH USER PROFILE AND THEIR PINS IN PARALLEL ON MOUNT
  useEffect(() => {
    Promise.all([
      fetch(`${API}/users/${CURRENT_USER_ID}`).then(r => r.json()),
      fetch(`${API}/users/${CURRENT_USER_ID}/pins`).then(r => r.json()),
    ]).then(([userData, pinsData]) => {
      setUser(userData.user)
      setPins(pinsData.pins)
    }).catch(err => console.error('Error loading profile:', err))
      .finally(() => setLoading(false))
  }, [])

  // REPLACE THE EDITED PIN IN THE LIST AND CLOSE THE EDIT MODAL
  const handleSaveEdit = (updatedPin) => {
    setPins(prev => prev.map(p => p.id === updatedPin.id ? updatedPin : p))
    setEditingPin(null)
    setToast('Changements sauvegardés avec succès !')
  }

  // SEND DELETE REQUEST TO THE API, THEN REMOVE THE PIN FROM THE LIST
  const handleConfirmDelete = async () => {
    if (!deletingPin) return
    try {
      const res = await fetch(`${API}/pins/${deletingPin.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Server error')
      setPins(prev => prev.filter(p => p.id !== deletingPin.id))
      setDeletingPin(null)
      setToast('Œuvre supprimée.')
    } catch (err) {
      console.error(err)
      alert('❌ Erreur lors de la suppression.')
      setDeletingPin(null)
    }
  }

  // SHOW A SPINNER-LIKE MESSAGE WHILE DATA IS LOADING
  if (loading) {
    return (
      <div className="page">
        <div className="profil-loading">Chargement du profil…</div>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Mon Profil</h1>

      {/* ── SECTION 1: USER PERSONAL INFORMATION ── */}
      {user && (
        <section className="profil-section profil-user-card" aria-label="Informations personnelles">

          {/* AVATAR: DISPLAYS THE FIRST LETTER OF THE USERNAME */}
          <div className="profil-avatar" aria-hidden="true">
            {user.username?.[0]?.toUpperCase() ?? '?'}
          </div>

          <div className="profil-user-info">
            <h2 className="profil-username">@{user.username}</h2>

            {/* EMAIL — SHOWN ONLY IF AVAILABLE */}
            {user.email && <p className="profil-detail">📧 {user.email}</p>}

            {/* MEMBERSHIP DATE — FORMATTED TO FRENCH LOCALE */}
            {user.created_at && (
              <p className="profil-detail">
                🗓 Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric', month: 'long'
                })}
              </p>
            )}

            {/* PUBLISHED WORKS COUNT — HANDLES SINGULAR/PLURAL */}
            <p className="profil-detail">
              🎵 {pins.length} œuvre{pins.length !== 1 ? 's' : ''} publiée{pins.length !== 1 ? 's' : ''}
            </p>
          </div>
        </section>
      )}

      {/* ── SECTION 2: USER'S PUBLISHED PINS ── */}
      <section className="profil-section" aria-label="Mes œuvres">
        <h2 className="profil-section-title">Mes œuvres publiées</h2>

        {/* EMPTY STATE WHEN THE USER HAS NOT POSTED ANY PINS YET */}
        {pins.length === 0 ? (
          <p className="profil-empty">Vous n'avez pas encore publié de son.</p>
        ) : (
          <ul className="pin-list" role="list">
            {pins.map(pin => (
              <li key={pin.id}>
                {/* PINCARD PASSES THE SELECTED PIN UP TO THE MODAL HANDLERS */}
                <PinCard
                  pin={pin}
                  onEdit={setEditingPin}
                  onDelete={setDeletingPin}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── EDIT MODAL — MOUNTED ONLY WHEN A PIN IS SELECTED FOR EDITING ── */}
      {editingPin && (
        <EditModal
          pin={editingPin}
          onSave={handleSaveEdit}
          onClose={() => setEditingPin(null)}
        />
      )}

      {/* ── DELETE CONFIRMATION MODAL — MOUNTED ONLY WHEN DELETION IS REQUESTED ── */}
      {deletingPin && (
        <DeleteConfirmModal
          pinTitle={deletingPin.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingPin(null)}
        />
      )}

      {/* ── SUCCESS TOAST — SHOWN BRIEFLY AFTER EDIT OR DELETE ACTIONS ── */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}