/* ============================================================
   MAPSELECTOR.JSX — INTERACTIVE MAP FOR COORDINATE SELECTION
   Used inside the "Ajouter un son" form. Allows the user to
   click anywhere on the map to place a marker and capture
   latitude/longitude coordinates.
   Different from MapView: no existing pins, no popups —
   only a single draggable placement marker.
   ============================================================ */

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// DEFAULT CENTER: PARIS CITY CENTER
const PARIS_CENTER = [48.8566, 2.3522]

/* ── CLICK HANDLER ──────────────────────────────────────────
   Inner component that listens for map click events and
   forwards the latitude/longitude to the parent form.
   Returns null — renders nothing visually.
   ─────────────────────────────────────────────────────────── */
function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      // PASS CLICKED COORDINATES UP TO PARENT VIA CALLBACK
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

/* ── MAPSELECTOR ────────────────────────────────────────────
   Props:
   - lat (string)           : current latitude value (from formData)
   - lng (string)           : current longitude value (from formData)
   - onLocationSelect (fn)  : called with (lat, lng) on click
   ─────────────────────────────────────────────────────────── */
function MapSelector({ lat, lng, onLocationSelect }) {
  return (
    <MapContainer
      center={PARIS_CENTER}
      zoom={12}
      style={{ height: '300px', width: '100%', borderRadius: '8px' }}
    >
      {/* OPENSTREETMAP BASE TILE LAYER */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* ATTACH THE CLICK LISTENER TO THE MAP */}
      <ClickHandler onLocationSelect={onLocationSelect} />

      {/* SHOW MARKER ONLY WHEN COORDINATES HAVE BEEN SELECTED */}
      {lat && lng && (
        <Marker position={[parseFloat(lat), parseFloat(lng)]} />
      )}
    </MapContainer>
  )
}

export default MapSelector