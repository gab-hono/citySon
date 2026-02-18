import './PinDetail.css' // Specific file for this component

export default function PinDetail({ pin, onClose }) {
  if (!pin) return null // If there's not a pin selected, nothing happens

  return (
    // THIS WHOLE DIV IS THE BOX THAT OPENS ONCE A PIN IS SELECTED
    <div className="pin-detail">

      {/* HEADER OF THE BOX */}
      <div className="pin-detail-header">
        <h2 className="pin-detail-title">{pin.title}</h2>
        <button className="pin-detail-close" onClick={onClose}>✕</button>
      </div>


      {/* SPECIFIC CONTENT OF THE BOX */}
      <div className="pin-detail-content">

        {/* PLACE WHERE AUTHOR AND LISTENING PLACE CAN GO IN FLEX VIEW */}
        <div className="pin-detail-field">
          <span className="pin-detail-label">Auteur</span>
          <span className="pin-detail-text">{pin.author_name}</span>
        </div>

        <div className="pin-detail-field">
          <span className="pin-detail-label">Lieu d'écoute</span>
          <span className="pin-detail-text">{pin.location_name}</span>
        </div>

        {/* PLACE FOR THE AUDIO LINK */}
        {pin.audio_url && (
          <div className="pin-detail-field">
            <span className="pin-detail-label">Lien à l'audio</span>
            <a
              className="pin-detail-text" 
              title={pin.title}
              href={pin.audio_url}
              target="_blank">
                Lien externe vers {pin.title}
            </a>
          </div>
        )}

        {/* PLACE FOR THE DESCRIPTION OF THE PIECE */}
        {pin.inspiration_text && (
          <div className="pin-detail-field pin-detail-field--full">
            <span className="pin-detail-label">Description</span>
            <p className="pin-detail-text">{pin.inspiration_text}</p>
          </div>
        )}

        {/* PLACE FOR THE TECHNOLOGIES USED IN THE RECORDING/MIXING */}
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