// FloatingCart.jsx — final version, no props needed
"use client";
import { useCart } from "../context/CartContext";

export default function FloatingCart() {
  const { cart, total, setShowCart } = useCart(); // 👈 from context

  if (!cart.length) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-green-600 text-white px-4 py-3 flex justify-between items-center shadow-lg z-50">
      <div>
        <p className="text-md font-semibold">
          {cart.length} item{cart.length > 1 ? "s" : ""}
        </p>
        <p className="text-sm">₹{total}</p>
      </div>
      <button
        onClick={() => setShowCart(true)} // 👈 opens drawer globally
        className="bg-white text-green-700 px-4 py-2 rounded-full font-semibold"
      >
        View Cart →
      </button>
    </div>
  );
}