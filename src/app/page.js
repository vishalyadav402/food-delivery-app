"use client";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";
import LocationModal from "./components/LocationModal";
import { useCart } from "./context/CartContext";

export default function Home() {
  const { cart, setShowCart } = useCart(); // 👈 only what's needed
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (!savedLocation) {
      setShowLocationModal(true);
    } else {
      setLocation(savedLocation);
    }
  }, []);

  const getAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return (
        data.address?.suburb ||
        data.address?.village ||
        data.address?.town ||
        data.address?.city ||
        "Your Area"
      );
    } catch {
      return "Your Area";
    }
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const address = await getAddress(pos.coords.latitude, pos.coords.longitude);
        setLocation(address);
        localStorage.setItem("userLocation", address);
        setShowLocationModal(false);
      },
      () => alert("Location permission denied")
    );
  };

  const handleSaveLocation = () => {
    if (!location) return alert("Enter location");
    localStorage.setItem("userLocation", location);
    setShowLocationModal(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        location={location}
        openLocationModal={() => setShowLocationModal(true)}
        cartCount={cart.length}
        onCartClick={() => setShowCart(true)} // 👈 opens global CartDrawer
      />

      <main className="max-w-full md:px-4 p-2 pb-4 mt-28">
        <Menu onCartClick={() => setShowCart(true)} />
      </main>

      {/* ❌ REMOVED: cart drawer block — now handled globally by CartDrawer in layout */}

      <LocationModal
        showLocationModal={showLocationModal}
        setShowLocationModal={setShowLocationModal}
        location={location}
        setLocation={setLocation}
        handleSaveLocation={handleSaveLocation}
      />
      <Footer />
    </div>
  );
}