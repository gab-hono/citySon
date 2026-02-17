// src/components/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'


const PARIS_CENTER = [48.8566, 2.3522]

export default function MapView() {
  const [pins, setPins] = useState([])

  useEffect(() => {
    fetch('http//localhost:4242/pins')
      .then(res => res.json())
      .then(data => setPins(data.pins))
      .catch(err => console.error('Erreur fetch pins', err))
  }, [])

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

      {pins.map(pin => (
        <Marker
          key={pin.id}
          position={[pin.latitude, pin.longitude]}
          >
            <Popup>
              <strong>{pin.location_name}</strong>
              <p>{pin.inspiration_text}</p>
            </Popup>
          </Marker>
      ))}

    </MapContainer>
  )
}