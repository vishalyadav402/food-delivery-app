"use client";
import { useEffect, useState } from "react";
import { checkDeliveryAvailability } from "../utils/deliveryConfig";

export default function LocationModal({
  showLocationModal,
  setShowLocationModal,
  location,
  setLocation,
  handleSaveLocation,
}) {
  const [recent, setRecent] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [coords, setCoords] = useState(null);

  // ✅ Validation state
  const [validation, setValidation] = useState({
    checking: false,
    ok: false,
    message: "",
  });

  // 📦 Load saved + recent
  useEffect(() => {
    const last = localStorage.getItem("userLocation");
    const history = JSON.parse(localStorage.getItem("recentLocations") || "[]");

    if (!location && last) setLocation(last);
    setRecent(history);
  }, []);

  // 💾 Save recent
  const saveRecent = (value) => {
    let history = JSON.parse(localStorage.getItem("recentLocations") || "[]");

    history = [value, ...history.filter((i) => i !== value)].slice(0, 5);
    localStorage.setItem("recentLocations", JSON.stringify(history));
    setRecent(history);
  };

  // 🚚 Auto validate while typing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!location || location.length < 5) {
        setValidation({ checking: false, ok: false, message: "" });
        return;
      }

      setValidation((v) => ({ ...v, checking: true }));

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`
        );
        const data = await res.json();

        if (!data.length) {
          setValidation({
            checking: false,
            ok: false,
            message: "Location not found",
          });
          return;
        }

        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setCoords({ lat, lng });

        const result = checkDeliveryAvailability({
          locationText: location,
          lat,
          lng,
        });

        setValidation({
          checking: false,
          ok: result.ok,
          message: result.message,
        });
      } catch (err) {
        console.error(err);
        setValidation({
          checking: false,
          ok: false,
          message: "Error checking location",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  // 📍 GPS detect
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingGPS(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();

          const addr = data.display_name || "Your Area";

          const result = checkDeliveryAvailability({
            locationText: addr,
            lat,
            lng,
          });

          if (!result.ok) {
            alert(result.message);
            setLoadingGPS(false);
            return;
          }

          setLocation(addr);
          setCoords({ lat, lng });

          localStorage.setItem("userLocation", addr);
          localStorage.setItem(
            "userCoords",
            JSON.stringify({ lat, lng })
          );

          saveRecent(addr);
          setShowLocationModal(false);
        } catch (err) {
          console.error(err);
          alert("Failed to fetch address");
        }

        setLoadingGPS(false);
      },
      () => {
        alert("Permission denied");
        setLoadingGPS(false);
      }
    );
  };

  // 🔍 Suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!location || location.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoadingSuggest(true);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }

      setLoadingSuggest(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location]);

  // ✅ Continue
  const handleContinue = () => {
    if (!validation.ok) return;

    localStorage.setItem("userLocation", location);
    localStorage.setItem("userCoords", JSON.stringify(coords));

    saveRecent(location);
    handleSaveLocation();
  };

  if (!showLocationModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-sm rounded-2xl shadow-xl p-5">

        <h2 className="text-lg font-semibold text-gray-800 text-center">
          Choose your location
        </h2>

        <p className="text-xs text-gray-500 text-center mb-4">
          Find nearby stores for faster delivery
        </p>

        {/* GPS */}
        <button
          onClick={detectLocation}
          disabled={loadingGPS}
          className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          {loadingGPS ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Detecting...
            </>
          ) : (
            "📍 Use current location"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-2 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Input */}
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter area or pincode"
          className="w-full border rounded-xl px-3 py-2 text-gray-600 text-sm focus:ring-2 focus:ring-green-500 outline-none"
        />

        {/* Validation */}
        {validation.checking && (
          <p className="text-xs text-gray-400 mt-2">Checking...</p>
        )}

        {validation.message && !validation.checking && (
          <p
            className={`text-xs mt-2 ${
              validation.ok ? "text-green-600" : "text-red-500"
            }`}
          >
            {validation.message}
          </p>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="border rounded-xl mt-2 max-h-32 overflow-y-auto">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => {
                  setLocation(s.display_name);
                  setSuggestions([]);
                }}
                className="p-2 text-xs hover:bg-gray-100 cursor-pointer"
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}

        {/* Recent */}
        {recent.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">
              Recent locations
            </p>

            {recent.map((r, i) => (
              <div
                key={i}
                onClick={() => setLocation(r)}
                className="text-sm py-1 cursor-pointer hover:text-green-600"
              >
                📍 {r}
              </div>
            ))}
          </div>
        )}

        {/* Continue */}
        <button
          onClick={handleContinue}
          disabled={!validation.ok}
          className={`w-full py-2.5 rounded-xl font-semibold mt-4 ${
            validation.ok
              ? "bg-gray-800 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}