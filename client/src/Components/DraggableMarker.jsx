import { useState, useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Optional: custom house icon
// const houseIcon = new L.Icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/69/69524.png',
//   iconSize: [38, 38],
// });

const DraggableMarker = ({ position, onDragEnd }) => {
  const [markerPosition, setMarkerPosition] = useState(position);

  // Update marker position when parent updates (like reset)
  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  // Map event to allow clicking on map to move marker (optional)
  useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng);
      onDragEnd(e.latlng.lat, e.latlng.lng);
    }
  });

  return (
    <Marker
      position={markerPosition}
      draggable={true}
      // icon={houseIcon}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setMarkerPosition([lat, lng]);
          onDragEnd(lat, lng);
        }
      }}
    >
      <Popup>📍 Drag to mark the exact location</Popup>
    </Marker>
  );
};

export default DraggableMarker;
