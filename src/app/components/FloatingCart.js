"use client";
import { useCart } from "../context/CartContext";
import { usePathname } from "next/navigation";

export default function FloatingCart() {
  const { cart, total, setShowCart } = useCart();
  const pathname = usePathname();

  const isVisible =
  pathname === "/" ||
  pathname.startsWith("/s") ||
  pathname.match(/^\/[^/]+$/) ||        // matches /[category]  e.g. /fruits
  pathname.match(/^\/[^/]+\/[^/]+$/);   // matches /[category]/[subcategory] e.g. /fruits/mango
  if (!cart.length) return null;
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-green-600 text-white px-4 py-3 flex justify-between items-center shadow-lg z-50">
      <div>
        <p className="text-md font-semibold">
          {cart.length} item{cart.length > 1 ? "s" : ""}
        </p>
        <p className="text-sm">₹{total}</p>
      </div>
      <button
        onClick={() => setShowCart(true)}
        className="bg-white text-green-700 px-4 py-2 rounded-full font-semibold"
      >
        View Cart →
      </button>
    </div>
  );
}