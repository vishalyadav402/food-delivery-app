"use client";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";

export default function DraggableMarker({ position, setPosition }) {
  const containerStyle = {
    width: "100%",
    height: "250px",
    borderRadius: "12px",
  };

  const handleDragEnd = (e) => {
    setPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={14}
      >
        <Marker
          position={position}
          draggable={true}
          onDragEnd={handleDragEnd}
        />
      </GoogleMap>
    </LoadScript>
  );
}
