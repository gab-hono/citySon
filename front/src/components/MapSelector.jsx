import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const PARIS_CENTER = [48.8566, 2.3522]

// Composant interne qui "écoute" les clics sur la carte
function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null // Ne rend rien visuellement, juste un listener
}

function MapSelector({ lat, lng, onLocationSelect }) {
  return (
    <MapContainer
      center={PARIS_CENTER}
      zoom={12}
      style={{ height: '300px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <ClickHandler onLocationSelect={onLocationSelect} />
      {/* Affiche le marqueur seulement si des coordonnées existent */}
      {lat && lng && <Marker position={[parseFloat(lat), parseFloat(lng)]} />}
    </MapContainer>
  )
}

export default MapSelector