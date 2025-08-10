"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cart from "./Cart";

const Menu = () => {
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

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.name === item.name);
      if (existingItem) {
        return prevCart.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, qty: 1 }];
      }
    });
    // setShowCart(true); 
  };

  // Update quantity or remove item if qty < 1
  const updateQty = (name, newQty) => {
    if (newQty < 1) {
      removeItem(name);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === name ? { ...item, qty: newQty } : item
      )
    );
  };

  const removeItem = (name) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== name));
  };

  const goToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    router.push("/checkout");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-bold">Our Menu</h3>
        <button
          onClick={() => setShowCart(true)}
          className="bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600"
        >
          🛒 View Cart ({cart.length})
        </button>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
       {menuItems.map((item, index) => {
            const inCart = cart.some((cartItem) => cartItem.name === item.name);
            return (
                <div
                key={index}
                className="bg-white/10 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform"
                >
                <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="w-full h-50 object-cover"
                />
                <div className="p-4 text-center">
                    <h4 className="text-lg font-bold">{item.name}</h4>
                    <p className="text-gray-400">₹{item.price}</p>
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

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg relative">
            <div className="w-full flex justify-between items-center mb-4">
              <h4 className="text-2xl font-bold text-white">Your Cart</h4>
              <button
                onClick={() => setShowCart(false)}
                className="text-white text-2xl font-bold"
              >
                ✖
              </button>
            </div>
            <Cart
              cart={cart}
              goToCheckout={goToCheckout}
              updateQty={updateQty}
              removeItem={removeItem}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
