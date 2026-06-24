"use client";
import { useCart } from "../context/CartContext";
import { usePathname } from "next/navigation";
import { FaCaretRight } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { useState } from "react";

const HIDDEN_PATHS = ["/checkout", "/cart", "/orders", "/profile", "/admin"];

export default function FloatingCart() {
  const { cart, total, setShowCart } = useCart();
  const pathname = usePathname();
  const [flowtingcart, setfloatingcart] = useState(true);
  const handleCart =()=>{
      setShowCart(true);
    }
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
    <div className="fixed bottom-0 left-0 px-3 py-0 justify-center w-full max-w-sm z-99 md:bottom-6 md:right-6 md:left-auto md:w-auto md:max-w-none">
  
  {/* Mobile: full bar */}
  <div
    onClick={() => handleCart()}
    className="md:hidden rounded-md bg-green-700 text-white px-4 py-1 flex justify-between items-center shadow-lg"
  >
    <div className="flex flex-1 items-center gap-3">
      <div className="p-2 bg-green-600 w-8 h-8 rounded-md"><BsCart3 /></div>
      <div>
        <p className="text-[12px] font-light">
          {cart.length} item{cart.length > 1 ? "s" : ""}
        </p>
        <p className="text-sm">₹ {total}</p>
      </div>
    </div>
    <div className="font-light text-[14px] flex items-center gap-2">
      <span>View Cart</span> <FaCaretRight />
    </div>
  </div>

  {/* Desktop: compact pill */}
  <div
    onClick={() => handleCart()}
    className="hidden md:flex items-center gap-2 bg-green-700 text-white pl-3 pr-4 py-5 rounded-full shadow-xl cursor-pointer hover:bg-green-800 transition"
  >
    <div className="relative">
      <BsCart3 size={20} />
      <span className="absolute -top-2 -right-2 bg-white text-green-700 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
        {cart.length}
      </span>
    </div>
    <span className="text-sm font-medium">₹ {total}</span>
  </div>

</div>
  );
}