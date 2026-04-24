"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { checkDeliveryAvailability } from "../utils/deliveryConfig";

const Header = ({
  cartCount,
  onCartClick,
  location,
  openLocationModal = () => {}, // ✅ default empty
}) => {
  const router = useRouter();
const [deliveryInfo, setDeliveryInfo] = useState(null);

useEffect(() => {
  if (!location) {
    setDeliveryInfo(null);
    return;
  }

  const coords = JSON.parse(localStorage.getItem("userCoords"));

  const result = checkDeliveryAvailability({
    locationText: location,
    lat: coords?.lat,
    lng: coords?.lng,
  });

  setDeliveryInfo(result);
}, [location]);

  // ✅ Delivery ETA
  const getETA = () => {
    const min = Math.floor(Math.random() * 10) + 10;
    return `${min} mins`;
  };

  return (
    <div className="bg-green-500 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LEFT */}
        <div onClick={() => router.push("/")} className="cursor-pointer">
          {/* <h1 className="text-xl font-bold">KiranaNeeds</h1> */}

          <p
  onClick={(e) => {
    e.stopPropagation();
    openLocationModal?.();
  }}
  className="flex items-center gap-1 cursor-pointer max-w-[160px] md:max-w-[220px]"
>
  <SlLocationPin className="shrink-0" />

      <span className="truncate text-sm">
        {location || "Select Location"}
      </span>
    </p>

          {/* ETA */}
         {deliveryInfo && (
  <div className="text-[11px] mt-1 flex items-center gap-2">
    {deliveryInfo.ok ? (
      <>
        <span className="text-white">
          🚚 {deliveryInfo.distance} km
        </span>
        <span className="text-white/70">•</span>
        <span className="text-white">
          ⏱ {deliveryInfo.eta}
        </span>
      </>
    ) : (
      <span className="text-red-200">
        {deliveryInfo.message}
      </span>
    )}
  </div>
)}
        </div>

        {/* RIGHT */}
        <div className="flex gap-2">
          {cartCount > 0 && (
            <button
              onClick={onCartClick}
              className="hidden md:inline-flex bg-gray-800 px-4 py-2 rounded-full"
            >
              🛒 ({cartCount})
            </button>
          )}

          <button
            onClick={() => router.push("/track-order")}
            className="border px-3 py-2 rounded"
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;