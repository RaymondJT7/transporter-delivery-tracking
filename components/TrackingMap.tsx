"use client";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  pickupAddress: string;
  deliveryAddress: string;
};

const fakeLocations: Record<string, [number, number]> = {
  "12 Aldgate High Street, Vereeniging": [-26.6728, 27.9319],
  "45 Populier Street, Duncanville": [-26.6648, 27.9261],
  "83 Rivonia Road, Sandton": [-26.1076, 28.0567],
  "123 Church Street, Pretoria": [-25.7461, 28.1881],
  "Cape Town Harbour": [-33.9068, 18.4222],
  "Durban Beachfront": [-29.8579, 31.0351],
  "Rosebank Mall, Johannesburg": [-26.1466, 28.0416],
  "Menlyn Mall, Pretoria": [-25.7828, 28.2752],
  "Bloemfontein CBD": [-29.1183, 26.2140],
  "Kimberley CBD": [-28.7282, 24.7499],
};

function getCoords(address: string): [number, number] {
  return fakeLocations[address] || [-26.2041, 28.0473];
}

function MapUpdater({
  pickup,
  destination,
}: {
  pickup: [number, number];
  destination: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([pickup, destination]);
    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [pickup, destination, map]);

  return null;
}

export default function TrackingMap({
  pickupAddress,
  deliveryAddress,
}: Props) {
  const pickup = getCoords(pickupAddress);
  const destination = getCoords(deliveryAddress);

  return (
    <MapContainer
      center={destination}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
    >
      <MapUpdater pickup={pickup} destination={destination} />

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={pickup} icon={markerIcon}>
        <Popup>Pickup: {pickupAddress}</Popup>
      </Marker>

      <Marker position={destination} icon={markerIcon}>
        <Popup>Destination: {deliveryAddress}</Popup>
      </Marker>
    </MapContainer>
  );
}