export const DELIVERY_RULES = {
  minOrder: 100,
  freeDeliveryAbove: 299,
  baseCharge: 20,
};


export const calculateDelivery = (cartTotal) => {
  if (cartTotal < DELIVERY_RULES.minOrder) {
    return {
      allowed: false,
      message: `Minimum order ₹${DELIVERY_RULES.minOrder}`,
    };
  }

  if (cartTotal >= DELIVERY_RULES.freeDeliveryAbove) {
    return {
      allowed: true,
      charge: 0,
      message: "Free Delivery 🎉",
    };
  }

  return {
    allowed: true,
    charge: DELIVERY_RULES.baseCharge,
    message: `Delivery ₹${DELIVERY_RULES.baseCharge}`,
  };
};

// 📍 Shop Location (SET YOUR SHOP LAT/LNG HERE)
export const SHOP_LOCATION = {
  lat: 25.84670, // 👉 change to your shop location
  lng: 82.21600,
};

// 🚚 Max delivery radius (km)
export const MAX_DISTANCE_KM = 6;

// 📮 Serviceable pincodes
export const SERVICEABLE_PINCODES = [
  "230133",
  "230134",
  "230135",
];

// 🔍 Extract pincode
export const getPincode = (text = "") => {
  const match = text.match(/\b\d{6}\b/);
  return match ? match[0] : null;
};

// 📏 Distance formula
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getDeliveryInfo = () => {
  const coords = JSON.parse(localStorage.getItem("userCoords"));

  if (!coords) return null;

  const distance = getDistanceKm(
    SHOP_LOCATION.lat,
    SHOP_LOCATION.lng,
    coords.lat,
    coords.lng
  );

  // 🚚 ETA logic
  let eta = "10-15 mins";

  if (distance > 3) eta = "20-25 mins";
  if (distance > 6) eta = "30-40 mins";

  return {
    distance: distance.toFixed(1),
    eta,
  };
};

// ✅ FINAL CHECK
export const checkDeliveryAvailability = ({
  locationText,
  lat,
  lng,
}) => {
  const pincode = getPincode(locationText);

  // ❌ Pincode invalid
  if (!pincode) {
    return {
      ok: false,
      message: "Enter valid pincode",
    };
  }

  // ❌ Pincode not serviceable
  if (!SERVICEABLE_PINCODES.includes(pincode)) {
    return {
      ok: false,
      message:
        "❌ Delivery not available in your area (pincode)",
    };
  }

  // ❌ No GPS coords
  if (!lat || !lng) {
    return {
      ok: false,
      message: "Location not detected properly",
    };
  }

  // 📏 Distance check
  const distance = getDistanceKm(
    SHOP_LOCATION.lat,
    SHOP_LOCATION.lng,
    lat,
    lng
  );

  if (distance > MAX_DISTANCE_KM) {
    return {
      ok: false,
      message: `❌ Delivery not available (beyond ${MAX_DISTANCE_KM} km)`,
    };
  }

  // ✅ Success
  return {
    ok: true,
    distance: distance.toFixed(2),
    message: `✅ Delivery available (${distance.toFixed(1)} km)`,
  };
};