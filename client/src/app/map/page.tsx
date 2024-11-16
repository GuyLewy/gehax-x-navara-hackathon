"use client";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import "./styles.scss"


<<<<<<< Updated upstream
// Set default marker icons
const defaultIcon = new L.Icon({
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
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
=======
export default function MyPage() {
  const position = [51.505, -0.09] as [number, number];
	return (
		<div className="h-[500px]">
			<MapContainer center={position} zoom={13} scrollWheelZoom={false}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={position}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}
>>>>>>> Stashed changes
