import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 16);
  }, [map, position]);
  return null;
};

const MapComponent = ({ center, zoom = 18, address, children }) => {
  console.log("🗺 Center passed to MapComponent:", center);

  const isInvalid =
    !center || !Array.isArray(center) ||
    center.length !== 2 || 
    center[0] === undefined || 
    center[1] === undefined || 
    center[0] === 0 || 
    center[1] === 0;

  if (isInvalid) {
    console.warn("❌ Invalid or missing coordinates for map:", center);
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-600">⚠️ No valid location set</p>
      </div>
    );
  }

  return (
    <div className="w-[54%] h-[550px] bg-white shadow-lg rounded-lg top-[6vh] left-[10vw] relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '95%', width: '52vw', borderRadius: '8px' }}
        className="top-[1.1vh] relative left-[0.8vw]"
      >
        {children}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center}>
          <Popup>{address}</Popup>
        </Marker>
        <RecenterMap position={center} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
