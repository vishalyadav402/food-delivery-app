import React from "react";
import { calculateDelivery, DELIVERY_RULES } from "../utils/deliveryConfig";
import Image from "next/image";
import { Trash2, Minus, Plus, Zap, Banknote, CheckCircle2 } from "lucide-react";

const Cart = ({
  cart = [],
  updateQty,
  removeItem,
  setShowCart,
}) => {
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.qty),
    0
  );

  const totalMrp = cart.reduce(
    (sum, item) => sum + Number(item.mrp ?? item.price) * Number(item.qty),
    0
  );

  const youSaved = Math.max(totalMrp - total, 0);
  const delivery = calculateDelivery(total);
  const finalTotal = total + (delivery.charge || 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <p className="text-gray-400 text-center mt-8">🛒 Your cart is empty</p>
        <button
          className="bg-purple-500 p-2 px-5 m-auto rounded my-5 cursor-pointer text-white text-md max-w-[300px]"
          onClick={() => setShowCart(false)}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pt-3 pb-5 px-4">

      {/* CART ITEMS CARD */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-1">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Delivery within day</p>
            <p className="text-xs text-gray-500">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <ul className="divide-y divide-gray-100">
          {cart.map((item, index) => (
            <li key={`${item.slug}-${item.variant}-${index}`} className="flex gap-3 py-2.5">
              <div className="w-[52px] h-[52px] rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                <Image
                  src={item?.image || "/images/icon-vegacart.png"}
                  alt={item?.name || "product"}
                  width={52}
                  height={52}
                  className="object-contain h-full w-auto"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-medium text-gray-900 truncate">{item.name}</h3>
                {item.variant && item.variant !== "Default" && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.variant}</p>
                )}
                <button
                  onClick={() => removeItem(item.slug, item.variant)}
                  className="flex items-center gap-1 text-[12px] text-red-500 mt-1.5"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>

              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                  <button
                    onClick={() => updateQty(item.slug, item.variant, item.qty - 1)}
                    disabled={item.qty <= 1}
                    className="w-6 h-6 flex items-center justify-center bg-gray-50 text-gray-700 disabled:opacity-50"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-[13px] font-medium">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.slug, item.variant, item.qty + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-gray-50 text-gray-700"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[13px] font-semibold text-gray-900">
                    ₹{(item.price * item.qty)}
                  </span>
                  {item.mrp && Number(item.mrp) !== Number(item.price) && (
                    <span className="block text-[11px] text-gray-400 line-through">
                      ₹{(item.mrp * item.qty).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* BILL DETAILS */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-1">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-green-600" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Bill details</p>
        </div>

        <div className="flex justify-between text-[13px] py-1.5">
          <span className="text-gray-500">Items total</span>
          <span className="text-gray-900">₹{(Number(total) || 0).toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-[13px] py-1.5">
          <span className="text-gray-500">Delivery charge</span>
          <span className={(Number(delivery?.charge) || 0) === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
            {(Number(delivery?.charge) || 0) === 0 ? "FREE" : `₹${(Number(delivery?.charge) || 0).toFixed(2)}`}
          </span>
        </div>

        {delivery?.allowed && Number(delivery?.charge) > 0 && (
          <p className="text-[11px] text-purple-700 -mt-0.5 mb-1">
            Add ₹{((Number(DELIVERY_RULES?.freeDeliveryAbove) || 0) - (Number(total) || 0)).toFixed(2)} more for FREE delivery
          </p>
        )}

        <div className="border-t border-gray-100 my-1.5" />

        <div className="flex justify-between text-[14px] font-semibold py-1">
          <span>Grand total</span>
          <span>₹{(Number(finalTotal) || 0).toFixed(2)}</span>
        </div>

        {Number(youSaved) > 0 && (
          <p className="text-[12px] text-green-600 font-medium mt-1.5">
            You saved ₹{(Number(youSaved) || 0).toFixed(2)} on this order
          </p>
        )}
      </div>

      {/* PAY USING */}
      <div className="bg-white rounded-xl border-2 border-purple-200 px-4 py-3">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-1">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-green-600" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Pay using</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Banknote size={18} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-gray-900">Cash on delivery</p>
            <p className="text-[12px] text-gray-500">Pay with cash at delivery time</p>
          </div>
          <CheckCircle2 size={20} className="text-purple-600" />
        </div>
      </div>

    </div>
  );
};

export default Cart;
