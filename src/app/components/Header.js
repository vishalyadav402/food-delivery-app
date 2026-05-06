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
const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

   // 🔥 SCROLL DETECTION
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false); // scroll down
      } else {
        setShowHeader(true); // scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const [search, setSearch] = useState("");

  return (
   <div className="bg-green-500 text-white w-full fixed top-0 left-0 right-0 z-50 shadow-md">

  {/* 🔽 ONLY THIS HIDES */}
  <div
    className={`overflow-hidden transition-all duration-300 ${
  showHeader ? "max-h-[100px] opacity-100" : "max-h-3 opacity-0"
}`}
  >
    <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

      {/* LEFT */}
      <div onClick={() => router.push("/")} className="cursor-pointer">
        <p
          onClick={(e) => {
            e.stopPropagation();
            openLocationModal?.();
          }}
          className="flex items-center gap-1 max-w-[160px]"
        >
          <SlLocationPin />
          <span className="truncate text-sm">
            {location || "Select Location"}
          </span>
        </p>

        {deliveryInfo && (
          <div className="text-[11px] mt-1 flex gap-2">
            <span>🚚 {deliveryInfo.distance} km</span>
            <span>•</span>
            <span>⏱ {deliveryInfo.eta}</span>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex gap-2">
        {cartCount > 0 && (
          <button className="bg-gray-800 px-4 py-2 rounded-full">
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

  {/* 🔥 ALWAYS VISIBLE SEARCH */}
  <div className="bg-green-500">
    <div className="max-w-6xl mx-auto">
      <SearchBox search={search} setSearch={setSearch} />
    </div>
  </div>

</div>
  );
};

export default Header;