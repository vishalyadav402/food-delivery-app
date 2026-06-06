"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("location");
    if (saved) setLocation(saved);
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem("location", newLocation);
  };

  const [showLocationModal, setShowLocationModal] = useState(false);

  return (
    <LocationContext.Provider value={{ location, updateLocation, showLocationModal, setShowLocationModal }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}