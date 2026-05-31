"use client";
import { useRouter, usePathname } from "next/navigation"; // 👈 add usePathname
import { useEffect, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { IoArrowBack } from "react-icons/io5"; // 👈 back icon
import { getDeliveryInfo } from "../utils/deliveryConfig";
import SearchBox from "./SearchBox";
import Image from "next/image";

const Header = ({
  cartCount,
  onCartClick,
  searchField,
  setsearchField,
  location,
  openLocationModal = () => {},
}) => {
  const router = useRouter();
  const pathname = usePathname(); // 👈
  const isHome = pathname === "/"; // 👈

  const [deliveryInfo, setDeliveryInfo] = useState(null);

  useEffect(() => {
    setDeliveryInfo(getDeliveryInfo());
  }, [location]);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const [search, setSearch] = useState("");

  return (
    <header className="flex flex-wrap bg-gradient-to-b from-purple-100 to-white fixed top-0 left-0 right-0 z-99 w-full items-center justify-between px-2 md:px-6 border-b border-purple-200">

      {/* 👈 BACK BUTTON — only on child pages */}
      {!isHome && (
        <button
          onClick={() => router.back() || router.push('/')}
          className="order-0 lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 mr-0 my-2"
        >
          <IoArrowBack size={18} className="text-gray-700" />
        </button>
      )}

      {/* LOGO */}
      <a href="/" className="self-center md:mb-0 hidden lg:block lg:order-1">
        <div className="flex items-center">
          <Image src="/icon.png" height={50} width={50} style={{ width: "auto" }} alt="kirananeeds logo" />
          <span className="font-semibold font-sans text-gray-900 text-3xl">Kirananeeds</span>
        </div>
      </a>

      {/* BORDER */}
      <div className="border-l border-purple-200 h-[80px] hidden lg:block lg:order-2" />

      {/* LOCATION */}
      <div onClick={() => router.push("/")} className="my-2 md:mb-0 order-1 lg:order-3 cursor-pointer">
        <p
          onClick={(e) => {
            e.stopPropagation();
            openLocationModal?.();
          }}
          className="flex items-center gap-1 max-w-[160px]"
        >
          <SlLocationPin size={20} />
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

      {/* SEARCH */}
      <div className="order-3 lg:order-4 flex items-center w-full lg:w-1/2 mb-2 lg:mb-0">
        <SearchBox search={search} setSearch={setSearch} />
      </div>

      {/* TRACK ORDER */}
      <div className="order-2 lg:order-5">
        <button
          onClick={() => router.push("/track-order")}
          className="bg-white rounded-lg px-3 py-2 border text-sm text-gray-600 cursor-pointer border-gray-200"
        >
          Track Order
        </button>
      </div>

    </header>
  );
};

export default Header;