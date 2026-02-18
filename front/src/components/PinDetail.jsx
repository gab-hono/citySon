import './PinDetail.css'

export default function PinDetail({ pin, onClose }) {
  if (!pin) return null

  return (
    <div className="pin-detail">
      <div className="pin-detail__header">
        <h2 className="pin-detail__title">{pin.title}</h2>
        <button className="pin-detail__close" onClick={onClose}>✕</button>
      </div>

      <div className="pin-detail__content">
        <div className="pin-detail__field">
          <span className="pin-detail__label">Auteur</span>
          <span className="pin-detail__value">{pin.author}</span>
        </div>

        <div className="pin-detail__field">
          <span className="pin-detail__label">Lieu d'écoute</span>
          <span className="pin-detail__value">{pin.location_name}</span>
        </div>

        {pin.audio_url && (
          <div className="pin-detail__field pin-detail__field--audio">
            <span className="pin-detail__label">Audio</span>
            <audio controls className="pin-detail__audio">
              <source src={pin.audio_url} type="audio/mpeg" />
              <a href={pin.audio_url} target="_blank" rel="noopener noreferrer">
                Ouvrir le fichier
              </a>
            </audio>
          </div>
        )}

        {pin.inspiration_text && (
          <div className="pin-detail__field pin-detail__field--full">
            <span className="pin-detail__label">Description</span>
            <p className="pin-detail__description">{pin.inspiration_text}</p>
          </div>
        )}

        {pin.edit_technology && (
          <div className="pin-detail__field">
            <span className="pin-detail__label">Technologies pour la création</span>
            <span className="pin-detail__value">{pin.edit_technology}</span>
          </div>
        )}
      </div>
    </div>
  )
}