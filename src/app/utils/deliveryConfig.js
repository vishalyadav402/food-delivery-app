// 🚚 DELIVERY RULES
export const DELIVERY_RULES = {
  minOrder: 100,
  freeDeliveryAbove: 299,
  baseCharge: 20,
};

// 📍 SHOP LOCATION
export const SHOP_LOCATION = {
  lat: 25.84670,
  lng: 82.21600,
};

// 🚚 MAX DISTANCE
export const MAX_DISTANCE_KM = 10;

// 📮 SERVICEABLE PINCODES
export const SERVICEABLE_PINCODES = [
  "230133",
  "230134",
  "230135",
];

// 📍 PINCODE → COORDS (fallback)
export const PINCODE_COORDS = {
  "230133": { lat: 25.860, lng: 82.210 },
  "230134": { lat: 25.870, lng: 82.200 },
  "230135": { lat: 25.880, lng: 82.190 },
};

// 🔍 Extract pincode
export const getPincode = (text = "") => {
  const match = text.match(/\b\d{6}\b/);
  return match ? match[0] : null;
};

// 📏 Distance (safe)
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((R * c).toFixed(2));
};

// 🚚 DELIVERY CHARGE
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

// 📦 DELIVERY INFO (distance + ETA)
export const getDeliveryInfo = () => {
  const coords = JSON.parse(localStorage.getItem("userCoords"));

  if (!coords) return null;

  const distance = getDistanceKm(
    SHOP_LOCATION.lat,
    SHOP_LOCATION.lng,
    coords.lat,
    coords.lng
  );

  if (!distance) return null;

  let eta = "20-25 mins";

  if (distance > 3) eta = "30-40 mins";
  if (distance > 6) eta = "40-50 mins";

  return {
    distance,
    eta,
  };
};

// 🔥 MAIN DELIVERY CHECK (FULL LOGIC)
export const checkDeliveryAvailability = ({
  locationText,
  lat,
  lng,
}) => {
  const pincode = getPincode(locationText);

  // ❌ No pincode
  if (!pincode) {
    return {
      ok: false,
      message: "Enter valid pincode",
    };
  }

  // ❌ Not serviceable
  if (!SERVICEABLE_PINCODES.includes(pincode)) {
    return {
      ok: false,
      message: "❌ Delivery not available in your area",
    };
  }

  let finalLat = lat;
  let finalLng = lng;

  // 🔁 FALLBACK → PINCODE COORDS
  if (!lat || !lng) {
    const pinCoords = PINCODE_COORDS[pincode];

    if (!pinCoords) {
      return {
        ok: false,
        message: "Location not detected properly",
      };
    }

    finalLat = pinCoords.lat;
    finalLng = pinCoords.lng;
  }

  // 📏 DISTANCE
  const distance = getDistanceKm(
    SHOP_LOCATION.lat,
    SHOP_LOCATION.lng,
    finalLat,
    finalLng
  );

  // ❌ Too far
  if (distance > MAX_DISTANCE_KM) {
    return {
      ok: false,
      message: `❌ Delivery not available beyond ${MAX_DISTANCE_KM} km`,
    };
  }

  // ✅ SUCCESS
  return {
    ok: true,
    distance,
    eta:
      distance <= 3
        ? "20-25 mins"
        : distance <= 6
        ? "30-40 mins"
        : "40-50 mins",
    message: `✅ Delivery available (${distance} km)`,
  };
};

// 🔍 OPTIONAL: GET DISTANCE FROM PINCODE ONLY
export const getDistanceFromPincode = (pincode) => {
  const coords = PINCODE_COORDS[pincode];

  if (!coords) return null;

  return getDistanceKm(
    SHOP_LOCATION.lat,
    SHOP_LOCATION.lng,
    coords.lat,
    coords.lng
  );
};