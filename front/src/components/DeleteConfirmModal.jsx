/* ============================================================
   DELETECONFIRMMODAL.JSX — PERMANENT DELETION WARNING MODAL
   Shown when the user clicks the "Delete" button on a pin.
   Requires explicit confirmation before the delete action
   is sent to the API.
   Props:
   - pinTitle : title of the pin to be deleted (shown in the warning)
   - onConfirm: sends the DELETE request and removes the pin from the list
   - onCancel : closes the modal without deleting
   ============================================================ */

export default function DeleteConfirmModal({ pinTitle, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal modal--danger">
        <div className="modal-warning-icon">⚠️</div>
        <h2>Supprimer l'œuvre ?</h2>
        <p className="modal-subtitle">
          Attention, si vous effacez votre œuvre, elle sera effacée de façon permanente de notre base de données.
        </p>

        {/* DISPLAYS THE TITLE OF THE PIN ABOUT TO BE DELETED */}
        <p className="modal-pin-name">« {pinTitle} »</p>

        <p className="modal-subtitle">Confirmer la suppression ?</p>

        <div className="modal-actions">

          {/* CONFIRM BUTTON — TRIGGERS THE DELETE REQUEST IN THE PARENT */}
          <button onClick={onConfirm} className="btn btn--danger">
            🗑 Oui, supprimer
          </button>

          {/* CANCEL BUTTON — CLOSES THE MODAL, NO ACTION TAKEN */}
          <button onClick={onCancel} className="btn btn--ghost">
            Non, garder l'œuvre
          </button>
        </div>
      </div>
    </div>
  )
}