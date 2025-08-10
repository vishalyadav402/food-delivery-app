import React from "react";

const Cart = ({ cart, goToCheckout, updateQty, removeItem }) => {
  return (
    <div>
      {cart.length === 0 ? (
        <p className="text-gray-300">Cart is empty</p>
      ) : (
        <ul className="mb-4 max-h-96 overflow-auto">
          {cart.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <span className="font-semibold">{item.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.name, item.qty - 1)}
                  disabled={item.qty <= 1}
                  className="bg-gray-700 disabled:opacity-50 text-white px-2 rounded"
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => updateQty(item.name, item.qty + 1)}
                  className="bg-gray-700 text-white px-2 rounded"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span>₹{item.price * item.qty}</span>
                <button
                  onClick={() => removeItem(item.name)}
                  className="text-red-500 font-bold"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between items-center">
        <strong>
          Total: ₹
          {cart.reduce((sum, i) => sum + i.price * i.qty, 0)}
        </strong>
        <button
          onClick={goToCheckout}
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
