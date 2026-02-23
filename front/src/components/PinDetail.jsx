/* ============================================================
   PINDETAIL.JSX — SLIDE-UP PANEL FOR SELECTED MAP PIN
   Renders as an absolute overlay at the bottom of the map.
   Displays all metadata for the selected pin.
   Styles come from App.css (no local CSS file needed).
   ============================================================ */

export default function PinDetail({ pin, onClose }) {

  // DO NOT RENDER ANYTHING IF NO PIN IS SELECTED
  if (!pin) return null

  return (
    // OUTER PANEL: SLIDES UP FROM BOTTOM OF MAP CONTAINER
    <div className="pin-detail" role="complementary" aria-label={`Détails : ${pin.title}`}>

      {/* STICKY PANEL HEADER WITH TITLE AND CLOSE BUTTON */}
      <div className="pin-detail-header">
        <h2 className="pin-detail-title">{pin.title}</h2>
        <button
          className="pin-detail-close"
          onClick={onClose}
          aria-label="Fermer le panneau"
        >
          ✕
        </button>
      </div>

      {/*  SCROLLABLE CONTENT BODY  */}
      <div className="pin-detail-content">

        {/* AUTHOR AND LISTENING LOCATION, SIDE BY SIDE ON DESKTOP */}
        <div className="pin-detail-field">
          <span className="pin-detail-label">Auteur</span>
          <span className="pin-detail-text">{pin.author_name}</span>
        </div>

        <div className="pin-detail-field">
          <span className="pin-detail-label">Lieu d'écoute</span>
          <span className="pin-detail-text">{pin.location_name}</span>
        </div>

        {/* EXTERNAL AUDIO LINK, ONLY SHOWN IF AUDIO URL EXISTS */}
        {pin.audio_url && (
          <div className="pin-detail-field">
            <span className="pin-detail-label">Lien à l'audio</span>
            <a
              className="pin-detail-text"
              href={pin.audio_url}
              title={`Écouter : ${pin.title}`}
              target="_blank"
              rel="noreferrer"
            >
              Lien externe vers {pin.title}
            </a>
          </div>
        )}

        {/* DESCRIPTION, SPANS FULL WIDTH ON DESKTOP */}
        {pin.inspiration_text && (
          <div className="pin-detail-field pin-detail-field--full">
            <span className="pin-detail-label">Description</span>
            <p className="pin-detail-text">{pin.inspiration_text}</p>
          </div>
        )}

        {/* TECHNOLOGIES USED, SPANS FULL WIDTH ON DESKTOP */}
        {pin.technology && (
          <div className="pin-detail-field pin-detail-field--full">
            <span className="pin-detail-label">Technologies pour la création</span>
            <span className="pin-detail-text">{pin.technology}</span>
          </div>
        )}

      </div>
    </div>
  )
}