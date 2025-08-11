"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cart from "./Cart";

const Menu = ({ cart, addToCart, updateQty, removeItem }) => {
  const router = useRouter();
  const menuItems = [
    { name: "Noodles", price: 120, image: "/images/noodles.avif" },
    { name: "Burger", price: 150, image: "/images/burger.avif" },
    { name: "Momos", price: 100, image: "/images/momos.avif" },
    { name: "Cold Coffee", price: 90, image: "/images/cold-coffee.avif" },
    { name: "Pizza", price: 200, image: "/images/pizza.avif" },
    { name: "Sandwich", price: 180, image: "/images/sandwitch.avif" },
    { name: "Rolls", price: 80, image: "/images/rolls.avif" },
  ];


  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-bold">Our Menu</h3>
     
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
       {menuItems.map((item, index) => {
        const inCart = cart.some((c) => c.name === item.name);
        return (
          <div key={index} className="bg-white/10 relative rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform">
            <div className="h-[300px] w-full">
            <Image src={item.image} alt={item.name} width={400} height={300} />
            </div>
            <div className="p-4 text-center absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm">
              <h4 className="text-lg font-bold">{item.name}</h4>
              <p className="text-red-600">₹{item.price}</p>
              <button
                onClick={() => addToCart(item)}
                disabled={inCart}
                className={`mt-2 px-4 py-2 rounded-full font-semibold ${
                  inCart
                    ? "bg-red-300 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                }`}
              >
                {inCart ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
};

export default Menu;
