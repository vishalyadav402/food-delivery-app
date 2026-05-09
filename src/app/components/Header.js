"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { getDeliveryInfo } from "../utils/deliveryConfig";
import SearchBox from "./SearchBox";
import Image from "next/image";

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
    <>
   <header className="flex flex-wrap bg-gradient-to-b from-purple-100 to-white fixed top-0 left-0 right-0 z-10 w-full items-center justify-between px-4 md:px-6 border-b border-purple-200">
      {/* logo */}
      <a href='/' className="self-center md:mb-0 hidden lg:block lg:order-1">
        <div className="flex items-center"><Image src="/icon.png" height={50} width={50} alt='kirananeeds logo'></Image> <span className="font-semibold font-sans text-gray-900 text-3xl">Kirananeeds</span></div>
      </a>
      {/* border */}
      <div className="border-l border-purple-200 h-[80px] hidden lg:block lg:order-2" />
      {/* location */}
      <div onClick={() => router.push("/")} className="my-2 md:mb-0 order-1 lg:order-3 cursor-pointer">
        <p
          onClick={(e) => {
            e.stopPropagation();
            openLocationModal?.();
          }}
          className="flex items-center gap-1 max-w-[160px]"
        >
          <SlLocationPin size={20}/>
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
      {/* search */}
      <div className="order-3 lg:order-4 flex items-center  w-full lg:w-1/2 mb-2 lg:mb-0">
        <SearchBox search={search} setSearch={setSearch} />
      </div>
      {/* login */}
      <div className="order-2 lg:order-5">
        <button
          onClick={() => router.push("/track-order")}
          className="bg-white rounded-lg px-3 py-2 border text-sm text-gray-600 cursor-pointer border-gray-200"
        >
          Track Order
        </button>
      </div>
      {/* cart */}
      {<div className='hidden lg:block lg:order-6'>
        {cartCount > 0 && (
          <button className="bg-white rounded-lg px-3 py-2 border text-sm text-gray-600 cursor-pointer border-gray-200">
            🛒 {cartCount}
          </button>
        )}
      </div>}

    </header>
    </>
  );
};

export default Header;