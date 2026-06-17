"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("location");
    if (saved) {
      setLocation(saved);
      setShowLocationModal(false);
    } else {
      setShowLocationModal(true); // 👈 open by default when no location saved
    }
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem("location", newLocation);
    setShowLocationModal(false); // 👈 close modal once a location is set
  };

  return (
    <LocationContext.Provider
      value={{ location, updateLocation, showLocationModal, setShowLocationModal }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}