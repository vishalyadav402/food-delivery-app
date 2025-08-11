import React from "react";

const Cart = ({ cart, goToCheckout, updateQty, removeItem, setShowCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <div>
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">🛒 Your cart is empty</p>
      ) : (
        <ul className="space-y-4 h-[75vh] overflow-y-auto scrollbar-hide">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between border-b pb-3 last:border-b-0"
              >
                {/* Item Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-gray-400 text-xs">₹{item.price} each</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQty(item.name, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="bg-gray-200 text-red-700 font-bold px-2 rounded disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-3">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.name, item.qty + 1)}
                      className="bg-gray-200 font-bold text-red-700 px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold">₹{item.price * item.qty}</span>
                  <button
                    onClick={() => removeItem(item.name)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
      )}

      {/* Total & Checkout Button */}
{/* Footer */}
      <div className="sticky bottom-0 bg-yellow-400/90 backdrop-blur-sm p-3 mt-4 rounded-md">
        {total > 0 ? (
          <div className="flex justify-between items-center">
            <strong className="text-gray-800 font-semibold">
              Total: ₹{total}
            </strong>
            <button
              onClick={goToCheckout}
              className="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-900"
            >
              Checkout
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setShowCart(false)}
              className="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-900"
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
