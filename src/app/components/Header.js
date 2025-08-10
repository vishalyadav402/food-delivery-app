import React from 'react'
import { SlLocationPin } from "react-icons/sl";

const Header = ({ cartCount, onCartClick }) => {
  return (
    <>
      {/* Header */}
      <div className="bg-red-500 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-2 md:px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold leading-6 mb-1">Divine Food Hub</h1>
            <p className="text-sm flex leading-4 items-center gap-2">
              <SlLocationPin /> Sangipur, Pratapgarh 230132
            </p>
          </div>
          <nav className="flex gap-2 md:gap-6">
            {/* <a
              href="#"
              className="hover:bg-white font-semibold hover:text-red-500 transition-shadow border rounded-4xl px-2 py-1 md:px-4 md:py-2"
            >
              Login
            </a>
            <a
              href="#"
              className="hover:bg-white font-semibold hover:text-red-500 transition-shadow border rounded-4xl px-2 py-1 md:px-4 md:py-2"
            >
              Signup
            </a> */}
            <button
              onClick={onCartClick}
              className="bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600"
            >
              🛒 View Cart ({cartCount})
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
