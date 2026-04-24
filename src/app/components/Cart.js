import React from "react";
import { calculateDelivery, DELIVERY_RULES } from "../utils/deliveryConfig";

const Cart = ({
  cart = [],
  goToCheckout,
  updateQty,
  removeItem,
  setShowCart,
}) => {
  // ✅ Total
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.qty),
    0
  );

  // ✅ Delivery logic
  const delivery = calculateDelivery(total);
  const finalTotal = total + (delivery.charge || 0);

  return (
    <div className="flex flex-col h-full">

      {/* 🛒 EMPTY */}
      {cart.length === 0 ? (
        <p className="text-gray-50 text-center mt-8">
          🛒 Your cart is empty
        </p>
      ) : (
        <ul className="space-y-4 flex-1 overflow-y-auto scrollbar-hide max-h-[65vh]">
          {cart.map((item, index) => (
            <li
              key={`${item.name}-${item.variant}-${index}`} // ✅ FIX KEY
              className="flex items-center justify-between border-b border-green-800 pb-3"
            >
              {/* LEFT */}
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-white">
                  {item.name}
                </h3>

                <p className="text-gray-400 text-xs">
                  ₹{item.price} each
                </p>

                {/* QTY */}
                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      updateQty(
                        item.name,
                        item.variant,
                        item.qty - 1
                      )
                    }
                    disabled={item.qty <= 1}
                    className="bg-gray-200 text-red-700 font-bold px-2 rounded disabled:opacity-50"
                  >
                    -
                  </button>

                  <span className="px-3 text-white">
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(
                        item.name,
                        item.variant,
                        item.qty + 1
                      )
                    }
                    className="bg-gray-200 text-red-700 font-bold px-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-end gap-2">
                <span className="font-semibold text-white">
                  ₹{item.price * item.qty}
                </span>

                <button
                  onClick={() =>
                    removeItem(item.name, item.variant)
                  }
                  className="text-gray-400 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 🔥 BOTTOM SECTION */}
      <div className="sticky bottom-2 hidden mt-4">

        {total > 0 ? (
          <div className="bg-green-400/90 backdrop-blur-sm p-3 rounded-md">

            {/* 🚚 DELIVERY INFO */}
            <div className="text-sm text-gray-800 mb-2">

              {!delivery.allowed ? (
                <p className="text-red-700 font-medium">
                  {delivery.message}
                </p>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>₹{total}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>
                      {delivery.charge === 0
                        ? "FREE 🎉"
                        : `₹${delivery.charge}`}
                    </span>
                  </div>

                  {/* Free delivery hint */}
                  {delivery.charge > 0 && (
                    <p className="text-xs text-yellow-800 mt-1">
                      Add ₹
                      {DELIVERY_RULES.freeDeliveryAbove - total} more for FREE delivery
                    </p>
                  )}

                  <hr className="my-2 border-gray-300" />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </>
              )}
            </div>

            {/* 🛒 BUTTON */}
            <div className="flex justify-between items-center">
              <strong className="text-gray-800">
                ₹{finalTotal}
              </strong>

              <button
                onClick={goToCheckout}
                disabled={!delivery.allowed}
                className={`px-4 py-2 rounded-full ${
                  delivery.allowed
                    ? "bg-green-700 text-white hover:bg-green-900"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {delivery.allowed ? "Checkout" : "Min Order"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-3">
            <button
              onClick={() => setShowCart(false)}
              className="bg-green-700 text-white px-4 py-2 rounded-full"
            >
              Go to menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;