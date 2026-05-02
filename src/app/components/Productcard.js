"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";

const ProductCard = ({
  item,
  variant,
  cartItem,
  addToCart,
  updateQty,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-2 flex flex-col justify-between hover:shadow-md transition">

      {/* IMAGE */}
      <div className="relative h-28 flex justify-center">

        {/* Discount badge */}
        {variant?.mrp > variant?.price && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-1 rounded">
            {Math.round(((variant.mrp - variant.price) / variant.mrp) * 100)}% OFF
          </span>
        )}

        <Image
          src={item?.image || "/images/icon-vegacart.png"}
          alt={item?.name}
          width={120}
          height={100}
          className="object-contain"
        />
      </div>

      {/* NAME */}
      <p className="text-sm text-black font-medium mt-2 line-clamp-2 min-h-[32px]">
        {item?.name}
      </p>

      <div className="flex justify-between">

        {/* PRICE */}
        <div className="flex flex-col mt-1">
          <span className="text-green-600 text-[15px] font-bold">
            ₹{variant?.price}
          </span>

          {variant?.mrp > variant?.price && (
            <span className="text-gray-600 line-through text-[12px]">
              ₹{variant?.mrp}
            </span>
          )}
        </div>

        {/* BUTTON / QTY */}
        <div className="flex items-center self-center">

          {cartItem ? (
            <div className="flex items-center justify-center text-gray-500 gap-2 border border-gray-300 rounded-full w-[80px] text-md font-bold">
              
              <button
                onClick={() =>
                  updateQty(
                    item.name,
                    variant.label,
                    cartItem.qty - 1
                  )
                }
              >
                <Minus size={14} />
              </button>

              <span className="text-md text-black">
                {cartItem.qty}
              </span>

              <button
                onClick={() =>
                  addToCart({
                    name: item.name,
                    variant: variant.label,
                    price: variant.price,
                  })
                }
                className="text-green-600"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                addToCart({
                  name: item.name,
                  variant: variant.label,
                  price: variant.price,
                })
              }
              className="bg-green-500 text-white w-[80px] rounded-full text-md font-bold text-center"
            >
              ADD
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductCard;