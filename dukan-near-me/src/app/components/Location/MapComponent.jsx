"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for missing marker icon
const customIcon = new L.Icon({
	// iconUrl: "/marker-icon.png", // Make sure these icons are in the public folder
	iconUrl: "marker.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowUrl: "/marker-shadow.png",
	shadowSize: [41, 41],
});

export default function MapComponent({ setLocation, location, role }) {
	const [position, setPosition] = useState({ lat: 28.6139, lng: 77.209 }); // Default to Delhi

	// Function to get the saved user location from the database
	useEffect(() => {
		if (location?.lat && location?.lng) {
			setPosition({ lat: location.lat, lng: location.lng });
		} else {
			const fetchUserLocation = async () => {
				try {
					const res = await fetch("/api/users/location");
					const data = await res.json();
					if (res.ok && data.latitude && data.longitude) {
						setPosition({ lat: data.latitude, lng: data.longitude });
						setLocation({ lat: data.latitude, lng: data.longitude, ...data });
					}
				} catch (error) {
					console.error("Error fetching user location:", error);
				}
			};
			fetchUserLocation();
		}
	}, [location]);

	const fetchAddress = async (lat, lng) => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
			);
			const data = await response.json();
			if (data.address) {
				return {
					houseNumber: data.address.house_number || "",
					street: data.address.road || "",
					buildingName: data.address.building || "",
					landmark: data.address.neighbourhood || "",
					city: data.address.city || data.address.town || data.address.village || "",
					state: data.address.state || "",
					country: data.address.country || "",
					zipCode: data.address.postcode || "",
				};
			}
		} catch (error) {
			console.error("Error fetching address:", error);
		}
		return {};
	};

	function LocationMarker({ position }) {
		const map = useMapEvents({
			click: async (e) => {
				if (role !== "USER") return;

				const { lat, lng } = e.latlng;
				setPosition({ lat, lng });
				const addressData = await fetchAddress(lat, lng);
				setLocation({ lat, lng, ...addressData });
			},
		});

		useEffect(() => {
			if (position.lat && position.lng) {
			map.setView(position, 13); // Center the map when position changes
		  }
		}, [position, map]);
	  
		return <Marker position={position} icon={customIcon} />;
	}

	return (
		<MapContainer center={position} zoom={13} className="h-96" style={{ width: "80vw" }}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<LocationMarker position={position} />
		</MapContainer>
	);
}
