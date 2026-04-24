import { useEffect, useState } from "react";

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

  // ✅ Load saved + recent
  useEffect(() => {
    const last = localStorage.getItem("userLocation");
    const history = JSON.parse(localStorage.getItem("recentLocations") || "[]");

    if (!location && last) setLocation(last);
    setRecent(history);
  }, []);

  // ✅ Save recent
  const saveRecent = (value) => {
    let history = JSON.parse(localStorage.getItem("recentLocations") || "[]");

    history = [value, ...history.filter((i) => i !== value)].slice(0, 5);
    localStorage.setItem("recentLocations", JSON.stringify(history));
    setRecent(history);
  };

  // ✅ Handle continue
  const handleContinue = () => {
    if (!location) return alert("Enter location");
    localStorage.setItem("userLocation", location);
    saveRecent(location);
    handleSaveLocation();
  };

  // ✅ GPS detect
  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Not supported");

    setLoadingGPS(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();

          const addr = data.display_name || "Your Area";

          setLocation(addr);
          saveRecent(addr);
          localStorage.setItem("userLocation", addr);
          setShowLocationModal(false);
        } catch {
          alert("Failed to fetch location");
        }
        setLoadingGPS(false);
      },
      () => {
        alert("Permission denied");
        setLoadingGPS(false);
      }
    );
  };

  // ✅ Suggestions (debounced)
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

  if (!showLocationModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">

      <div className="bg-white w-[90%] max-w-sm rounded-2xl shadow-xl p-5">

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          Choose your location
        </h2>

        <p className="text-xs text-gray-500 text-center mb-4">
          Find nearby stores for faster delivery
        </p>

        {/* GPS BUTTON */}
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

        {/* DIVIDER */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-2 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* INPUT */}
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter area or pincode"
          className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
        />

        {/* 🔍 Suggestions */}
        {loadingSuggest && (
          <p className="text-xs text-gray-400 mt-2">Searching...</p>
        )}

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

        {/* 🕘 Recent Locations */}
        {recent.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1">
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

        {/* CONTINUE */}
        <button
          onClick={handleContinue}
          className="w-full bg-gray-800 text-white py-2.5 rounded-xl font-semibold mt-4"
        >
          Continue
        </button>
      </div>
    </div>
  );
}