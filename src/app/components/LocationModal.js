"use client";
import { useEffect, useState } from "react";
import { checkDeliveryAvailability } from "../utils/deliveryConfig";
import { useLocation } from "../context/LocationContext"; // 👈

const SERVICEABLE_PINCODES = ["230133", "230134", "230135"];

export default function LocationModal() {
const { location, updateLocation, showLocationModal, setShowLocationModal } = useLocation();
  const [inputValue, setInputValue] = useState(location || ""); // 👈 local input state
  const [recent, setRecent] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [coords, setCoords] = useState(null);
  const [validation, setValidation] = useState({ checking: false, ok: false, message: "" });

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("recentLocations") || "[]");
    setRecent(history);
  }, []);


  const saveRecent = (value) => {
    let history = JSON.parse(localStorage.getItem("recentLocations") || "[]");
    history = [value, ...history.filter((i) => i !== value)].slice(0, 5);
    localStorage.setItem("recentLocations", JSON.stringify(history));
    setRecent(history);
  };

  // 🚀 AUTO VALIDATION
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!inputValue || inputValue.length < 3) {
        setValidation({ checking: false, ok: false, message: "" });
        return;
      }

      const match = inputValue.match(/\b\d{6}\b/);
      if (match) {
        const pin = match[0];
        if (SERVICEABLE_PINCODES.includes(pin)) {
          setValidation({ checking: false, ok: true, message: "✅ Delivery available" });
          setCoords({ lat: 25.9, lng: 81.95 });
        } else {
          setValidation({ checking: false, ok: false, message: "❌ Not serviceable" });
        }
        return;
      }

      if (!navigator.onLine) {
        setValidation({ checking: false, ok: false, message: "Offline: Enter pincode" });
        return;
      }

      setValidation((v) => ({ ...v, checking: true }));

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${inputValue}&format=json&limit=1`,
          { headers: { "User-Agent": "KiranaNeedsApp/1.0" } }
        );
        const data = await res.json();

        if (!data.length) {
          setValidation({ checking: false, ok: false, message: "Location not found" });
          return;
        }

        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCoords({ lat, lng });

        const result = checkDeliveryAvailability({ locationText: inputValue, lat, lng });
        setValidation({ checking: false, ok: result.ok, message: result.message });
      } catch {
        setValidation({ checking: false, ok: false, message: "Enter pincode (network issue)" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // 📍 GPS
  const detectLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    setLoadingGPS(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "User-Agent": "KiranaNeedsApp/1.0" } }
          );
          const data = await res.json();
          const addr = data.display_name || "Your Area";
          const result = checkDeliveryAvailability({ locationText: addr, lat, lng });

          if (!result.ok) { alert(result.message); setLoadingGPS(false); return; }

          updateLocation(addr); // 👈 context
          localStorage.setItem("userCoords", JSON.stringify({ lat, lng }));
          saveRecent(addr);
          setShowLocationModal(false);
        } catch { alert("Failed to fetch location"); }
        setLoadingGPS(false);
      },
      () => { alert("Permission denied"); setLoadingGPS(false); }
    );
  };

  // 🔍 Suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!inputValue || inputValue.length < 3) { setSuggestions([]); return; }
      setLoadingSuggest(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${inputValue}&format=json&limit=5`,
          { headers: { "User-Agent": "KiranaNeedsApp/1.0" } }
        );
        setSuggestions(await res.json());
      } catch { setSuggestions([]); }
      setLoadingSuggest(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleContinue = () => {
    if (!validation.ok) return;
    updateLocation(inputValue); // 👈 context
    localStorage.setItem("userCoords", JSON.stringify(coords));
    saveRecent(inputValue);
    setShowLocationModal(false);
  };

  const deleteRecent = (value) => {
    const updated = recent.filter((item) => item !== value);
    setRecent(updated);
    localStorage.setItem("recentLocations", JSON.stringify(updated));
  };

  if (!showLocationModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-sm rounded-2xl shadow-xl p-5">
        <h2 className="text-lg font-semibold text-center text-gray-800">Choose your location</h2>
        <p className="text-xs text-gray-500 text-center mb-4">Serviceable: 230133, 230134, 230135</p>

        <button
          onClick={detectLocation}
          disabled={loadingGPS}
          className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          {loadingGPS ? "Detecting..." : "📍 Use current location"}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-2 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="relative">
          <input
            value={inputValue} // 👈 local state
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter area or pincode"
            className="w-full border rounded-xl px-3 py-2 pr-8 text-gray-500 text-sm"
          />
          {inputValue && (
            <button
              onClick={() => { setInputValue(""); setValidation({ checking: false, ok: false, message: "" }); }}
              className="absolute right-2 top-2 text-gray-400 hover:text-black"
            >✖</button>
          )}
        </div>

        {validation.checking && <p className="text-xs text-gray-400 mt-2">Checking...</p>}
        {validation.message && !validation.checking && (
          <div className="flex justify-between">
          <p className="text-xs mt-2">Select Location Below</p>
          <p className={`text-xs mt-2 ${validation.ok ? "text-green-600" : "text-red-500"}`}>
            {validation.message}
          </p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="border border-gray-200 rounded-sm mt-2 max-h-32 overflow-y-auto">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => {
                  const selected = s.display_name;
                  const lat = parseFloat(s.lat);
                  const lng = parseFloat(s.lon);
                  const result = checkDeliveryAvailability({ locationText: selected, lat, lng });
                  if (!result.ok) { alert(result.message); return; }

                  updateLocation(selected); // 👈 context
                  localStorage.setItem("userCoords", JSON.stringify({ lat, lng }));
                  saveRecent(selected);
                  setSuggestions([]);
                  setShowLocationModal(false);
                }}
                className="p-2 text-xs hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}

        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-gray-500">Recent</p>
            {recent.length > 0 && (
              <button onClick={() => { setRecent([]); localStorage.removeItem("recentLocations"); }}
                className="text-[10px] text-red-500">Clear</button>
            )}
          </div>
          {recent.map((r, i) => (
            <div key={i} className="flex justify-between items-center text-xs py-1 group">
              <span onClick={() => setInputValue(r)}
                className="cursor-pointer hover:text-green-600 text-gray-500 flex-1">
                📍 {r}
              </span>
              <button onClick={() => deleteRecent(r)}
                className="text-gray-400 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition">
                ✖
              </button>
            </div>
          ))}
        </div>

        {!suggestions.length && (
          <button
  onClick={handleContinue}
  disabled={!validation.ok || !inputValue}
  className={`w-full mt-4 py-2.5 rounded-xl transition ${
    validation.ok && inputValue
      ? "bg-gray-800 text-white"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  {!inputValue
    ? "Enter a location"
    : validation.checking
    ? "Checking..."
    : validation.ok
    ? "Continue"
    : "Not serviceable"}
</button>
        )}
      </div>
    </div>
  );
}