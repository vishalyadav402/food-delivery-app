import { useRouter } from 'next/navigation';
import React from 'react'
import { SlLocationPin } from "react-icons/sl";

const Header = ({ cartCount, onCartClick }) => {

  const router = useRouter();

  return (
    <>
      {/* Header */}
      <div className="bg-green-500 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 md:px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col cursor-pointer" onClick={() => router.push("/")}>
            <h1 className="text-2xl font-bold leading-6 mb-1">KiranaNeeds</h1>
            <p className="text-sm flex leading-4 items-center gap-2">
              <SlLocationPin /> Prithviganj Bazaar, 230133
            </p>
          </div>
          <nav className="flex gap-2 md:gap-6">
            {cartCount > 0 ? (
              <button
                onClick={onCartClick}
                className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-900"
              >
                🛒 View Cart ({cartCount})
              </button>
            ) : (
              <>
              <span className='hidden'>🙏Welcome Guest!</span>
              <button className='border rounded p-2' onClick={() => router.push("/track-order")}>
                Track Your Order
              </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
