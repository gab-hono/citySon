/* ============================================================
   MAPVIEW.JSX — HOME PAGE MAP COMPONENT
   Fetches all pins from the backend and renders them as
   Leaflet markers. Clicking a marker triggers the onPinSelect
   callback to show PinDetail in the parent (App.jsx).
   Different from MapSelector: read-only, shows all existing pins.
   ============================================================ */

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'

// DEFAULT MAP CENTER: PARIS CITY CENTER
const PARIS_CENTER = [48.8566, 2.3522]

/* ── MARKER CLICK HANDLER ───────────────────────────────────
   Renders all pin markers on the map. Attaches a click handler
   to each marker that reports the full pin object upward.
   Props:
   - pins (array)      : list of pin objects from the API
   - onPinClick (fn)   : called with a pin object when clicked
   ─────────────────────────────────────────────────────────── */
function MarkerClickHandler({ pins, onPinClick }) {
  return (
    <>
      {pins.map(pin => (
        <Marker
          key={pin.id}
          position={[pin.latitude, pin.longitude]}
          eventHandlers={{
            // WHEN MARKER IS CLICKED, PASS THE FULL PIN OBJECT TO PARENT
            click: () => onPinClick(pin)
          }}
        >
          {/* LEAFLET POPUP SHOWN ON HOVER  (SHOWS PIN TITLE) */}
          <Popup>
            <strong>{pin.title}</strong>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

/* ── MAPVIEW ────────────────────────────────────────────────
   Props:
   - onPinSelect (fn) : called with pin object when user clicks a marker
   ─────────────────────────────────────────────────────────── */
export default function MapView({ onPinSelect }) {

  // PINS STATE: POPULATED FROM THE BACKEND API ON MOUNT
  const [pins, setPins] = useState([])

  // FETCH ALL PINS FROM API WHEN COMPONENT FIRST MOUNTS
  useEffect(() => {
    fetch('https://city-son.vercel.app/pins')
      .then(res => res.json())
      .then(data => setPins(data.pins))
      .catch(err => console.error('ERROR FETCHING PINS:', err))
  }, [])

  return (
    // MAP FILLS ENTIRE PARENT CONTAINER (HOME-MAP-PLACEHOLDER)
    <MapContainer
      center={PARIS_CENTER}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      {/* OPENSTREETMAP BASE TILE LAYER */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* RENDER ALL PIN MARKERS AND HANDLE THEIR CLICK EVENTS */}
      <MarkerClickHandler pins={pins} onPinClick={onPinSelect} />
    </MapContainer>
  )
}