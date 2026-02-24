/* ============================================================
   CONFIRMMODAL.JSX — Modal de confirmación genérico
   Props:
   - data       : objeto con los datos a mostrar en el resumen
   - onConfirm  : función llamada al confirmar
   - onCancel   : función llamada al cancelar
   ============================================================ */

function ConfirmModal({ data, onConfirm, onCancel }) {
  return (
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

        <dl className="modal-summary">
          <dt>Titre</dt>
          <dd>{data.title}</dd>

          <dt>Auteur</dt>
          <dd>{data.author_name}</dd>

          <dt>URL audio</dt>
          <dd className="modal-url">{data.audio_url}</dd>

          <dt>Lieu d'écoute</dt>
          <dd>{data.location_name || '—'}</dd>

          <dt>Description</dt>
          <dd>{data.inspiration_text || '—'}</dd>

          <dt>Coordonnées</dt>
          <dd>{data.latitude}, {data.longitude}</dd>
        </dl>

        <div className="modal-actions">
          <button onClick={onConfirm} className="btn btn--primary">
            ✅ Confirmer
          </button>
          <button onClick={onCancel} className="btn btn--ghost">
            ✏️ Continuer à éditer
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal