// src/components/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const PARIS_CENTER = [48.8566, 2.3522]

export default function MapView() {


  return (
    <MapContainer
      center={PARIS_CENTER}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="©OpenStreetMap contributors"
      />
    </MapContainer>
  )
}