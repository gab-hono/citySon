/* ============================================================
   PINCARD.JSX — SINGLE PIN ROW IN THE PROFILE LIST
   Displays the pin's title, location and description.
   Provides "Edit" and "Delete" action buttons that pass
   the full pin object up to the parent via callbacks.
   Props:
   - pin      : pin object from the API
   - onEdit   : called with the pin when the Edit button is clicked
   - onDelete : called with the pin when the Delete button is clicked
   ============================================================ */

export default function PinCard({ pin, onEdit, onDelete }) {
  return (
    <div className="pin-card">

      {/* LEFT SIDE — PIN METADATA */}
      <div className="pin-card-info">
        <h3 className="pin-card-title">{pin.title}</h3>
        <p className="pin-card-location">📍 {pin.location_name || '—'}</p>

        {/* DESCRIPTION — RENDERED ONLY IF IT EXISTS */}
        {pin.inspiration_text && (
          <p className="pin-card-desc">{pin.inspiration_text}</p>
        )}
      </div>

      {/* RIGHT SIDE — ACTION BUTTONS */}
      <div className="pin-card-actions">

        {/* EDIT BUTTON — PASSES THE FULL PIN OBJECT TO THE PARENT */}
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => onEdit(pin)}
        >
          ✏️ Éditer
        </button>

        {/* DELETE BUTTON — TRIGGERS THE DELETE CONFIRMATION MODAL */}
        <button
          className="btn btn--danger-ghost btn--sm"
          onClick={() => onDelete(pin)}
        >
          🗑 Supprimer
        </button>
      </div>
    </div>
  )
}