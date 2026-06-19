"use client";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useLocation } from "../context/LocationContext";
import Cart from "./Cart";
import { calculateDelivery } from "../utils/deliveryConfig";
import { MapPin, IndianRupee, Banknote } from "lucide-react";

export default function CartDrawer() {
  const { cart, updateQty, removeItem, total, showCart, setShowCart } = useCart();
  const { location, setShowLocationModal } = useLocation();
  const router = useRouter();

  const delivery = calculateDelivery(total);
  const finalTotal = total + (delivery.charge || 0);

  const goToCheckout = () => {
    if (!cart.length) return alert("Cart empty");
    if (!delivery.allowed) return; // 👈 hard guard, button is disabled anyway
    setShowCart(false);
    router.push("/checkout");
  };

  if (!showCart) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-end z-[99]"
      onClick={() => setShowCart(false)}
    >
      <div
        className="bg-gray-50 w-full md:max-w-md flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mx-3 my-2 flex-shrink-0">
          <p className="text-xl font-bold my-2">Cart</p>
          <button onClick={() => setShowCart(false)} className="text-xl">
            ✖
          </button>
        </div>

        {/* SCROLLABLE CART CONTENT */}
        <Cart
          cart={cart}
          updateQty={updateQty}
          removeItem={removeItem}
          setShowCart={setShowCart}
        />

        {/* SINGLE STICKY CHECKOUT BAR */}
{cart.length > 0 && (
  <div className="flex-shrink-0 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">

    {/* DELIVERING TO */}
    <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-100">
      <div className="flex items-center gap-2 min-w-0">
        <MapPin size={16} className="text-gray-500 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] text-gray-400 leading-tight">Delivering to</p>
          <p className="text-[13px] font-medium text-gray-900 truncate max-w-[200px]">
            {location || "Select location"}
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowLocationModal(true)}
        className="text-[13px] font-semibold text-purple-600 flex-shrink-0"
      >
        Change
      </button>
    </div>

    {/* PAY USING + TOTAL/PLACE ORDER */}
    <div className="flex justify-between items-center px-4 py-2.5">

      {/* PAY USING (left) */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Banknote size={14} className="text-green-600 flex-shrink-0" />
          <span className="text-[11px] font-semibold text-gray-400 tracking-wide">PAY USING</span>
        </div>
        <p className="text-[13px] font-medium text-gray-900">Cash on Delivery</p>
      </div>

      {/* TOTAL + PLACE ORDER (right, combined button) */}
      {delivery.allowed ? (
        <button
          onClick={goToCheckout}
          className="flex items-center gap-3.5 bg-gray-900 hover:bg-gray-800 rounded-lg px-5 py-2.5 flex-shrink-0 transition"
        >
          <div className="text-left">
            <p className="text-[9px] text-white/60 leading-tight">Total</p>
            <p className="text-[15px] font-semibold text-white leading-tight">
              ₹{finalTotal.toFixed(2)}
            </p>
          </div>
          <span className="w-px h-6 bg-white/25" />
          <span className="text-[13px] font-semibold text-white">Place order</span>
        </button>
      ) : (
        <button
          disabled
          className="bg-gray-200 text-gray-400 rounded-lg px-5 py-2.5 text-[13px] font-semibold cursor-not-allowed flex-shrink-0 max-w-[160px] text-right"
        >
          {delivery.message}
        </button>
      )}
    </div>

  </div>
)}
      </div>
    </div>
  );
}
