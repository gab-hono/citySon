/* ============================================================
   ABANDONWARNINGMODAL.JSX — "UNSAVED CHANGES" WARNING MODAL
   Shown when the user tries to close the EditModal after
   making changes, preventing accidental data loss.
   Props:
   - onLeave    : closes the edit modal without saving
   - onContinue : closes this warning and returns to editing
   ============================================================ */

export default function AbandonWarningModal({ onLeave, onContinue }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-warning-icon">✏️</div>
        <h2>Quitter sans sauvegarder ?</h2>
        <p className="modal-subtitle">
          Les modifications que vous avez effectuées ne seront pas enregistrées.
        </p>
        <div className="modal-actions">

          {/* LEAVE WITHOUT SAVING — CLOSES THE EDIT MODAL ENTIRELY */}
          <button onClick={onLeave} className="btn btn--ghost">
            Sortir sans sauvegarder
          </button>

          {/* CONTINUE EDITING — DISMISSES THIS WARNING AND RETURNS TO THE FORM */}
          <button onClick={onContinue} className="btn btn--primary">
            Continuer l'édition
          </button>
        </div>
      </div>
    </div>
  )
}