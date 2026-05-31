"use client";
import { useCart } from "../context/CartContext";
import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/checkout", "/cart", "/orders", "/profile", "/admin"];

export default function FloatingCart() {
  const { cart, total, setShowCart } = useCart();
  const pathname = usePathname();

  // ✅ check exclusions first
  const isHidden = HIDDEN_PATHS.some((p) => pathname.startsWith(p));

  const isVisible =
    !isHidden && (
      pathname === "/" ||
      pathname.startsWith("/search") ||
      pathname.match(/^\/[^/]+$/) ||                    // /[category]
      pathname.match(/^\/[^/]+\/[^/]+$/) ||             // /[category]/[subcategory]
      pathname.match(/^\/[^/]+\/[^/]+\/[^/]+$/)       // 👈 /[category]/[subcategory]/[product]
    );

  if (!cart.length) return null;
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-b from-purple-100 to-white px-4 py-3 flex justify-between items-center shadow-lg z-50">
      <div>
        <p className="text-md font-semibold">
          {cart.length} item{cart.length > 1 ? "s" : ""}
        </p>
        <p className="text-sm">₹{total}</p>
      </div>
      <button
        onClick={() => setShowCart(true)}
        className="bg-white text-purple-700 border border-purple-500 px-4 py-2 rounded-full font-semibold"
      >
        View Cart →
      </button>
    </div>
  );
}