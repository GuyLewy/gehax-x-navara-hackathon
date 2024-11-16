"use-client"
import { FC } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MarkerData {
    lat: number;
    lng: number;
    text: string;
  }
  
  interface MapProps {
    markers?: MarkerData[];
    regions?: L.LatLngTuple[][];
  }

// Set default marker icons
const defaultIcon = new L.Icon({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const Map: FC<MapProps> = ({ markers = [], regions = [] }) => {
  const defaultCenter: LatLngTuple = [51.505, -0.09];
  
  return (
    <MapContainer 
      center={defaultCenter}
      zoom={13} 
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {markers.map((marker: MarkerData, idx: number) => (
        <Marker 
          key={idx} 
          position={[marker.lat, marker.lng]}
        >
          <Popup>{marker.text}</Popup>
        </Marker>
      ))}

      {regions.map((coords: LatLngTuple[], idx: number) => (
        <Polygon key={idx} positions={coords} />
      ))}
    </MapContainer>
  );
};

export default Map;