import React from 'react'
import { SlLocationPin } from "react-icons/sl";

const Header = () => {
  return (
    <>
     {/* Header */}
      <div className="bg-red-500 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Divine Food Hub</h1>
            <p className="text-sm flex items-center gap-2"><SlLocationPin /> Sangipur, Pratapgarh 230132</p>
          </div>
          <nav className="flex gap-2 md:gap-6">
            <a href="#" className="hover:bg-white font-semibold hover:text-red-500 transition-shadow border rounded-4xl px-4 py-2">Login</a>
            <a href="#" className="hover:bg-white font-semibold hover:text-red-500 transition-shadow border rounded-4xl px-4 py-2">Signup</a>
          </nav>
        </div>
      </div>
      </>
  )
}

export default Header