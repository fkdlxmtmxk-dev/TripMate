
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// 번호가 표시되는 지도 마커
function createIcon(number, isLast) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:30px;height:30px;border-radius:50%;
      background:${isLast ? '#FF8A6B' : '#1AA99C'};
      color:white;display:flex;align-items:center;
      justify-content:center;font-weight:bold;
      border:2px solid white;
      box-shadow:0 2px 6px #0004;
    ">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

// 모든 장소가 지도에 보이도록 이동
function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [35, 35] });
    }
  }, [positions, map]);

  return null;
}

export default function RouteMap({ items = [] }) {
  const pts = items.filter(
    (item) =>
      Number.isFinite(Number(item.lat)) &&
      Number.isFinite(Number(item.lng))
  );

  if (pts.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl bg-[#EEF5F2] text-sm text-slate-400">
        표시할 위치 정보가 부족해요
      </div>
    );
  }

  const positions = pts.map((p) => [
    Number(p.lat),
    Number(p.lng),
  ]);

  const center = positions[0];

  return (
    <div className="h-[350px] w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{
              color: '#1AA99C',
              weight: 5,
            }}
          />
        )}

        {pts.map((p, index) => (
          <Marker
            key={index}
            position={positions[index]}
            icon={createIcon(index + 1, index === pts.length - 1)}
          >
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.time}
            </Popup>
          </Marker>
        ))}

        <FitBounds positions={positions} />
      </MapContainer>
    </div>
  );
}
