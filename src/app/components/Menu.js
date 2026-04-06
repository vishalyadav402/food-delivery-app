"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Menu = ({ cart, addToCart, updateQty, removeItem }) => {
  
const [products, setProducts] = useState([]);

useEffect(() => {
  const local = localStorage.getItem("products");
  if (local) {
    setProducts(JSON.parse(local));
  } else {
    fetch("/data/productdata.json")
      .then(res => res.json())
      .then(setProducts);
  }
}, []);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
      <h3 className="text-3xl font-bold">Our Products</h3>
    </div>

{/* Menu Grid */}
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
  {products.map((item, index) => {
    const inCart = cart.some((c) => c.name === item.name);

    return (
      <div
        key={index}
        className="bg-white/10 gap-2 relative rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform"
      >
        <div className="h-[300px] w-full">
          <Image
            src={item.image || "/images/icon-vegacart.png"}
            alt={item.name}
            width={400}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="p-4 text-center absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm">
          <h4 className="text-lg font-bold">{item.name}</h4>
          <p className="text-green-400 font-semibold">₹{item.price}</p>

          <button
            onClick={() => addToCart(item)}
            disabled={inCart}
            className={`mt-2 px-4 py-2 rounded-full font-semibold ${
              inCart
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
            }`}
          >
            {inCart ? "Added" : "Add to Cart"}
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
