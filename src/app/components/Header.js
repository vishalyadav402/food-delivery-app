"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { getDeliveryInfo } from "../utils/deliveryConfig";
import SearchBox from "./SearchBox";

const Header = ({
  cartCount,
  onCartClick,
  searchField,
  setsearchField,
  location,
  openLocationModal = () => {}, // ✅ default empty
}) => {
  const router = useRouter();
const [deliveryInfo, setDeliveryInfo] = useState(null);


useEffect(() => {
  setDeliveryInfo(getDeliveryInfo());
}, [location]);

  // ✅ Delivery ETA
  const getETA = () => {
    const min = Math.floor(Math.random() * 10) + 10;
    return `${min} mins`;
  };


  const [search, setSearch] = useState("");

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
  <div className="text-[11px] text-white/90 mt-1 flex items-center gap-2">
    <span>🚚 {deliveryInfo.distance} km</span>
    <span>•</span>
    <span>⏱ {deliveryInfo.eta}</span>
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
      <div className="max-w-6xl mx-auto">
      <SearchBox search={search} setSearch={setSearch} />
      </div>
    </div>
  );
};

export default Header;