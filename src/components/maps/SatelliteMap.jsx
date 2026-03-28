/**
 * SatelliteMap — Leaflet map with satellite/NDVI layers.
 * Must be imported with dynamic({ ssr: false }) from Next.js pages.
 */
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon paths broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Kabupaten centre coordinates for Jawa Timur
const KABUPATEN_COORDS = {
  bangkalan:   [-7.035,  112.730],
  banyuwangi:  [-8.219,  114.369],
  blitar:      [-8.098,  112.168],
  bojonegoro:  [-7.150,  111.881],
  bondowoso:   [-7.910,  113.823],
  gresik:      [-7.157,  112.655],
  jember:      [-8.172,  113.700],
  jombang:     [-7.553,  112.235],
  kediri:      [-7.849,  112.017],
  lamongan:    [-7.117,  112.416],
  lumajang:    [-8.132,  113.222],
  madiun:      [-7.630,  111.524],
  magetan:     [-7.649,  111.329],
  malang:      [-7.980,  112.630],
  mojokerto:   [-7.471,  112.434],
  nganjuk:     [-7.605,  111.903],
  ngawi:       [-7.406,  111.447],
  pacitan:     [-8.197,  111.102],
  pamekasan:   [-7.157,  113.474],
  pasuruan:    [-7.647,  112.907],
  ponorogo:    [-7.866,  111.461],
  probolinggo: [-7.755,  113.215],
  sampang:     [-7.183,  113.248],
  sidoarjo:    [-7.447,  112.718],
  situbondo:   [-7.706,  114.008],
  sumenep:     [-6.994,  113.863],
  surabaya:    [-7.257,  112.752],
  trenggalek:  [-8.049,  111.713],
  tuban:       [-6.897,  112.050],
  tulungagung: [-8.065,  111.902],
};

/** NDVI value → green/yellow/red colour */
function ndviColor(ndvi) {
  const v = parseFloat(ndvi) || 0;
  if (v >= 0.6) return '#16a34a'; // healthy – dark green
  if (v >= 0.4) return '#84cc16'; // moderate – lime
  if (v >= 0.2) return '#eab308'; // stressed – yellow
  return '#ef4444';               // poor – red
}

/** health score (0-100) → readable label */
function healthLabel(score) {
  const s = parseFloat(score) || 0;
  if (s >= 80) return 'Baik';
  if (s >= 60) return 'Sedang';
  return 'Perlu Perhatian';
}

export default function SatelliteMap({ kabupaten, fields = [] }) {
  const centre = KABUPATEN_COORDS[kabupaten?.toLowerCase()] || [-7.5, 112.5];
  const zoom   = 11;

  return (
    <MapContainer
      center={centre}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <LayersControl position="topright">
        {/* ── Base layers ── */}
        <LayersControl.BaseLayer checked name="🛰️ Satellite (Esri)">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri — Source: Esri, USGS, NOAA"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="🗺️ Street Map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="⛰️ Terrain">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>

        {/* ── Overlay: NDVI colour circles ── */}
        <LayersControl.Overlay checked name="🌿 NDVI / Kesehatan Lahan">
          <>
            {fields.map((field) => {
              // API returns processed shape: coordinates.lat/lng, ndvi, healthScore, name, cropType, area
              const lat = parseFloat(field.coordinates?.lat || field.coordinates_lat);
              const lng = parseFloat(field.coordinates?.lng || field.coordinates_lng);
              if (!lat || !lng) return null;

              const ndviVal   = parseFloat(field.ndvi ?? field.current_ndvi ?? 0);
              const health    = parseFloat(field.healthScore ?? field.health_score ?? 0);
              const color     = ndviColor(ndviVal);
              const areaHa    = parseFloat(field.area ?? field.area_hectares ?? 1);
              const radius    = Math.max(10, Math.min(40, areaHa * 3));
              const fieldName = field.name ?? field.field_name ?? 'Lahan';
              const cropType  = field.cropType ?? field.crop_type ?? '—';

              return (
                <CircleMarker
                  key={field.id}
                  center={[lat, lng]}
                  radius={radius}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.55, weight: 2 }}
                >
                  <Tooltip direction="top" offset={[0, -4]} opacity={0.95}>
                    <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                      <strong>{fieldName}</strong><br />
                      NDVI: {ndviVal.toFixed(3)}<br />
                      Kesehatan: {healthLabel(health)} ({health}%)<br />
                      Tanaman: {cropType} — {areaHa} Ha
                    </div>
                  </Tooltip>
                  <Popup>
                    <div style={{ minWidth: 180 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{fieldName}</p>
                      <table style={{ fontSize: 12, width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          <tr><td style={{ paddingRight: 8, color: '#666' }}>Tanaman</td><td><strong>{cropType}</strong></td></tr>
                          <tr><td style={{ color: '#666' }}>Luas</td><td><strong>{areaHa} Ha</strong></td></tr>
                          <tr><td style={{ color: '#666' }}>NDVI</td><td><strong>{ndviVal.toFixed(3)}</strong></td></tr>
                          <tr><td style={{ color: '#666' }}>Kel. Tanah</td><td><strong>{field.soilMoisture ?? field.current_soil_moisture ?? '—'}%</strong></td></tr>
                          <tr><td style={{ color: '#666' }}>Suhu</td><td><strong>{field.temperature ?? field.current_temperature ?? '—'}°C</strong></td></tr>
                          <tr><td style={{ color: '#666' }}>Fase</td><td><strong>{field.growthStage ?? field.growth_stage ?? '—'}</strong></td></tr>
                          <tr><td style={{ color: '#666' }}>Kesehatan</td><td><strong style={{ color }}>{healthLabel(health)}</strong></td></tr>
                          {field.nextActivity && (
                            <tr><td style={{ color: '#666' }}>Aktivitas</td><td><strong>{field.nextActivity}</strong></td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </>
        </LayersControl.Overlay>

        {/* ── Overlay: Kabupaten centre marker ── */}
        <LayersControl.Overlay checked name="📍 Pusat Kabupaten">
          <Marker position={centre}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold capitalize">{kabupaten}</p>
                <p className="text-gray-500">Jawa Timur</p>
                <p className="mt-1 text-xs">{fields.length} lahan terpantau</p>
              </div>
            </Popup>
          </Marker>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
