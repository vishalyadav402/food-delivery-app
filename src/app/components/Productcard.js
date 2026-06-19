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
  const router = useRouter();

  // ✅ fallback chain for price
  const displayPrice = variant?.price || item?.variants?.[0]?.price || item?.price || 0;
  const displayMrp = variant?.mrp || item?.variants?.[0]?.mrp || item?.mrp || displayPrice;
  const displayLabel = variant?.label || item?.variants?.[0]?.label || "Default";

  const discount = displayMrp > displayPrice
    ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100)
    : 0;

  const handleProductClick = () => {
    if (item?.slug) {
      router.push(
        `/${item.categories?.slug || item.category_slug || "c"}/${item.subcategories?.slug || item.subcategory_slug || "s"}/${item.slug}`
      );
    }
  };

  return (
    <div className="bg-white min-w-[100px] min-h-[270px] rounded-xl shadow-sm p-2 flex flex-col justify-between hover:shadow-md transition">

      {/* IMAGE */}
      <div className="relative h-28 flex justify-center cursor-pointer" onClick={handleProductClick}>
        {discount > 0 && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-1 rounded z-10">
            {discount}% OFF
          </span>
        )}
        <Image
          src={item?.image || "/images/icon-vegacart.png"}
          alt={item?.name || "product"}
          width={120}
          height={100}
          className="object-contain h-full w-auto"
        />
      </div>

      {/* NAME */}
      <p className="text-sm text-black font-medium mt-2 line-clamp-2 min-h-[32px]">
        {item?.name}
      </p>

      {/* VARIANTS */}
      {item?.variants?.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-1">
          {item.variants.map((v, i) => (
            <button
              key={i}
              onClick={() => onVariantChange?.(v)}
              className={`text-[11px] px-2 py-[2px] rounded ${
                displayLabel === v.label
                  ? "bg-purple-500 text-white"
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
          <span className="text-purple-600 text-[15px] font-bold">
            ₹{displayPrice}  {/* ✅ single price, no duplicate */}
          </span>
          {displayMrp > displayPrice && (
            <span className="text-gray-400 line-through text-[12px]">
              ₹{displayMrp}
            </span>
          )}
        </div>

        {/* BUTTON / QTY */}
        {cartItem ? (
          <div className="flex items-center gap-2 border border-purple-500 rounded-full px-2 py-0.5 text-sm font-bold">
            <button onClick={() => updateQty(item.slug, displayLabel, cartItem.qty - 1)}>
              <Minus size={14} className="text-purple-600" />
            </button>
            <span className="text-black w-4 text-center">{cartItem.qty}</span>
            <button
              onClick={() => addToCart({
                slug: item.slug,
                name: item.name,
                image: item.image,
                variant: displayLabel,
                price: displayPrice,
              })}
              className="text-purple-600"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart({
              slug: item.slug,
              name: item.name,
              image: item.image,
              variant: displayLabel,
              price: displayPrice,
              mrp:displayMrp,
            })}
            className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold"
          >
            ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;