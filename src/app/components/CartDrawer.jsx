"use client";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";
import { calculateDelivery, DELIVERY_RULES } from "../utils/deliveryConfig";

export default function CartDrawer() {
  const { cart, updateQty, removeItem, total, showCart, setShowCart } = useCart();
  if (!showCart) return null; // 👈 this line needs showCart defined above first
  
  const router = useRouter();

  const delivery = calculateDelivery(total);
  const finalTotal = total + (delivery.charge || 0);

  const goToCheckout = () => {
    if (!cart.length) return alert("Cart empty");
    setShowCart(false);
    router.push("/checkout");
  };

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-end z-50">
      <div className="bg-green-900 w-full md:max-w-md p-4 flex flex-col">

        <div className="flex justify-between">
          <p className="text-white text-xl font-bold my-2">My Cart</p>
          <button
            onClick={() => setShowCart(false)}
            className="text-white text-xl self-end mb-2"
          >
            ✖
          </button>
        </div>

        <Cart
          cart={cart}
          updateQty={updateQty}
          removeItem={removeItem}
          setShowCart={setShowCart}
        />

        <div className="sticky bottom-2 bg-green-400/10 backdrop-blur-sm p-3 rounded-md">
          <div className="mt-2 bg-white/10 p-3 rounded text-white text-sm">
            {!delivery.allowed ? (
              <p className="text-red-300">{delivery.message}</p>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Items</span><span>₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{delivery.charge === 0 ? "FREE 🎉" : `₹${delivery.charge}`}</span>
                </div>
                {delivery.charge > 0 && (
                  <p className="text-yellow-300 text-xs mt-1">
                    Add ₹{DELIVERY_RULES.freeDeliveryAbove - total} more for FREE delivery
                  </p>
                )}
                <hr className="my-2 border-white/20" />
                <div className="flex justify-between font-bold">
                  <span>Total</span><span>₹{finalTotal}</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={goToCheckout}
            disabled={!delivery.allowed}
            className={`mt-4 w-full py-2 rounded ${
              delivery.allowed ? "bg-green-600" : "bg-gray-50 cursor-not-allowed"
            }`}
          >
            {delivery.allowed ? "Proceed to Checkout" : "Minimum Order Required"}
          </button>
        </div>

      </div>
    </div>
  );
}