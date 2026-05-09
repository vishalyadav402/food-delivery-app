"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductCard = ({
  item,
  variant,
  cartItem,
  addToCart,
  updateQty,
  onVariantChange,
}) => {
   const router= useRouter();
  return (
    <div className="bg-white min-w-[150px] min-h-[270px] rounded-xl shadow-sm p-2 flex flex-col justify-between hover:shadow-md transition">

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
          onClick={()=>router.push("/"+category_slug+"/"+subcategory_slug+"/"+slug)}
        />
      </div>

      {/* NAME */}
      <p className="text-sm text-black font-medium mt-2 line-clamp-2 min-h-[32px]">
        {item?.name}
      </p>

      {/* ✅ VARIANTS (FIXED) */}
      {item?.variants?.length > 1 && (
        <div className="flex gap-1 flex-wrap mt-1">
          {item.variants.map((v, i) => (
            <button
              key={i}
              onClick={() => onVariantChange?.(v)}
              className={`text-[11px] px-2 py-[2px] rounded ${
                variant?.label === v.label
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* PRICE + CART */}
      <div className="flex justify-between items-center mt-2">

        {/* PRICE */}
        <div className="flex flex-col">
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
        {cartItem ? (
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-2 text-sm font-bold">
            
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

            <span className="text-black">{cartItem.qty}</span>

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
            className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold"
          >
            ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;