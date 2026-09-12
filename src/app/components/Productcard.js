"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/app/context/CartContext"; // adjust path to yours

// ─── Variant Picker Modal (portaled to document.body) ─────────
function VariantPickerModal({ item, onClose, onAdd, cartItems, updateQty }) {
  const getCartItem = (label) =>
    cartItems?.find((c) => c.slug === item.slug && c.variant === label);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xs px-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-md">

        {/* Floating close button above modal */}
        <button
          onClick={onClose}
          className="absolute -top-13 left-1/2 -translate-x-1/2 w-11 h-11 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg z-10"
        >
          <X size={20} />
        </button>

        {/* Modal box */}
        <div
          className="bg-white w-full rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Product name header */}
          <div className="px-4 pt-5 pb-3 border-b border-gray-100">
            <p className="font-bold text-gray-800 text-sm leading-snug">{item?.name}</p>
          </div>

          {/* Variant rows */}
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-50">
            {item.variants?.map((v, i) => {
              const cartItem = getCartItem(v.label);
              const discount = v.mrp > v.price
                ? Math.round(((v.mrp - v.price) / v.mrp) * 100)
                : 0;

              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3">

                  {/* Image with discount badge */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    {discount > 0 && (
                      <span className="absolute top-0 left-0 bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded z-10 leading-tight">
                        {discount}%<br />OFF
                      </span>
                    )}
                    <Image
                      src={item?.image || "/images/icon-vegacart.png"}
                      alt={v.label}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 font-medium">{v.label}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0 mr-3">
                    <p className="text-sm font-bold text-gray-800">₹{v.price}</p>
                    {v.mrp > v.price && (
                      <p className="text-xs text-gray-400 line-through">₹{v.mrp}</p>
                    )}
                  </div>

                  {/* ADD / qty control */}
                  {cartItem ? (
                    <div className="flex items-center gap-2 h-10 border-2 border-green-600 bg-green-500 rounded-lg px-2 flex-shrink-0">
                      <button
                        onClick={() => updateQty(item.slug, v.label, cartItem.qty - 1)}
                        className="text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-white w-4 text-center text-sm">
                        {cartItem.qty}
                      </span>
                      {/* ✅ + uses updateQty to increment, not onAdd */}
                      <button
                        onClick={() => updateQty(item.slug, v.label, cartItem.qty + 1)}
                        className="text-white">
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAdd({
                        slug: item.slug,
                        name: item.name,
                        image: item.image,
                        variant: v.label,
                        price: v.price,
                        mrp: v.mrp,
                      })}
                      className="border-2 border-green-500 text-green-600 font-bold text-sm px-4 h-10 rounded-lg flex-shrink-0 transition-colors"
                    >
                      ADD
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Product Card ─────────────────────────────────────────────
const ProductCard = ({ item, variant, addToCart, updateQty, onVariantChange }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const displayPrice = variant?.price || item?.variants?.[0]?.price || item?.price || 0;
  const displayMrp = variant?.mrp || item?.variants?.[0]?.mrp || item?.mrp || displayPrice;
  const displayLabel = variant?.label || item?.variants?.[0]?.label || "Default";
  const hasMultipleVariants = item?.variants?.length > 1;

  const discount = displayMrp > displayPrice
    ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100)
    : 0;

  // Total qty across all variants of this product
  const { cart } = useCart();

const totalCartQty = cart
  ?.filter((c) => c.slug === item.slug)
  .reduce((sum, c) => sum + c.qty, 0) || 0;

const cartItem = cart?.find(
  (c) => c.slug === item.slug &&
  (c.variant || "Default") === (displayLabel || "Default")
);

  const handleProductClick = () => {
    if (item?.slug) {
      router.push(
        `/${item.categories?.slug || item.category_slug || "c"}/${item.subcategories?.slug || item.subcategory_slug || "s"}/${item.slug}`
      );
    }
  };

  const handleAddClick = () => {
    if (hasMultipleVariants) {
      setShowModal(true);
    } else {
      addToCart({
        slug: item.slug,
        name: item.name,
        image: item.image,
        variant: displayLabel,
        price: displayPrice,
        mrp: displayMrp,
      });
    }
  };

  return (
    <>
      <div className="bg-white min-w-[100px] min-h-[250px] rounded-xl shadow-sm p-2 flex flex-col justify-between hover:shadow-md transition">

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
        <p className="text-sm text-black capitalize font-medium mt-2 line-clamp-2 min-h-[32px]">
          {item?.name}
        </p>

        {/* Single variant chips */}
        {!hasMultipleVariants && item?.variants?.length > 0 && (
          <div className="flex flex-wrap">
            {item.variants.map((v, i) => (
              <button
                key={i}
                onClick={() => onVariantChange?.(v)}
                className="text-[11px] text-gray-500"
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        {/* Multi variant — show selected label */}
        {hasMultipleVariants && (
          <div className="flex">
            <span className="text-[11px] text-gray-500">
              {displayLabel}
            </span>
          </div>
        )}

        {/* PRICE + CART */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-gray-600 text-[15px] font-bold">₹{displayPrice}</span>
            {displayMrp > displayPrice && (
              <span className="text-gray-400 line-through text-[12px]">₹{displayMrp}</span>
            )}
          </div>

          {/* ✅ Multi-variant: show - qty + on card when in cart, else ADD */}
          {hasMultipleVariants ? (
            <div className="flex flex-col">
              {totalCartQty > 0 ? (
                <div className="border-2 border-green-600 bg-green-500 flex flex-col items-center rounded-md">
                  <div className="flex items-center overflow-hidden">
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-2 text-white"
                    >
                      <Minus size={13} />
                    </button>
                    <span
                      onClick={() => setShowModal(true)}
                      className="px-2 text-sm font-bold text-white cursor-pointer"
                    >
                      {totalCartQty}
                    </span>
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-2 text-white"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-[10px] text-white">
                    {item.variants.length} options
                  </span>

                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex h-10 flex-col items-center border-2 border-green-500 text-green-600 px-3 rounded-lg text-sm font-bold  transition-colors"
                >
                  <span>ADD</span>
                  <span className="text-[10px] font-normal text-green-500">
                    {item.variants.length} options
                  </span>
                </button>
              )}
            </div>
          ) : cartItem ? (
            <div className="flex h-10 items-center bg-green-500 border-2 border-green-600 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQty(item.slug, displayLabel, cartItem.qty - 1)}
              className="px-2 text-white "
            >
              <Minus size={13} />
            </button>
            <span className="px-2 text-sm font-bold text-white">
              {cartItem.qty}
            </span>
            <button
              onClick={() => updateQty(item.slug, displayLabel, cartItem.qty + 1)}
              className="px-2 text-white "
            >
              <Plus size={13} />
            </button>
          </div>
          ) : (
            <button
            onClick={handleAddClick}
            className="border-2 border-green-600 h-10 text-green-600 font-bold text-sm px-4 rounded-lg  transition-colors"
          >
            ADD
          </button>
          )}
        </div>
      </div>

      {/* VARIANT MODAL — portaled outside card DOM */}
      {showModal && (
        <VariantPickerModal
          item={item}
          cartItems={cart}
          onClose={() => setShowModal(false)}
          onAdd={addToCart}
          updateQty={updateQty}
        />
      )}
    </>
  );
};

export default ProductCard;
