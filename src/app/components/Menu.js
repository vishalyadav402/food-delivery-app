"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabase";

export default function Menu({ cart = [], addToCart, updateQty, cartCount, onCartClick }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) console.error(error);
      else setProducts(data || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  // ✅ Set default variants
  useEffect(() => {
    const initial = {};
    products.forEach((p) => {
      initial[p.id] =
        p.variants && p.variants.length > 0
          ? p.variants[0]
          : {
              label: "Default",
              price: p.price || 0,
            };
    });
    setSelectedVariants(initial);
  }, [products]);

  // ✅ Categories
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category || "General")),
  ];

  // ✅ Filter
  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <>
      {/* Category Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto px-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 mb-2 rounded-full whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((item) => {
          const variant =
            selectedVariants[item.id] ||
            (item.variants?.length > 0
              ? item.variants[0]
              : { label: "Default", price: item.price || 0 });

          // ✅ Find item in cart
        const currentVariantLabel = variant?.label || "Default";

const cartItem = (cart || []).find(
  (c) =>
    c.name === item.name &&
    (c.variant || "Default") === currentVariantLabel
);

          return (
            
            <div
  key={item.id}
  className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col h-full"
>
  {/* Image */}
  <Image
    src={item.image || "/images/icon-vegacart.png"}
    alt={item.name}
    width={200}
    height={150}
    className="rounded-t-xl w-full h-32 object-contain"
  />

  {/* Content */}
  <div className="p-2 flex flex-col justify-between">

    {/* TOP CONTENT */}
    <div>
      <h4 className="text-sm font-semibold text-center">
        {item.name}
      </h4>

      {/* Variants */}
      {item.variants?.length > 1 && (
        <div className="flex gap-1 justify-center mt-1 flex-wrap">
          {item.variants.map((v, i) => (
            <button
              key={i}
              onClick={() =>
                setSelectedVariants((prev) => ({
                  ...prev,
                  [item.id]: v,
                }))
              }
              className={`text-xs px-2 border rounded ${
                variant.label === v.label
                  ? "bg-green-500 text-white"
                  : ""
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* Price */}
      <p className="text-green-600 font-bold mt-1 text-center">
        ₹{variant.price}
      </p>
    </div>

    {/* 🔥 BOTTOM FIXED SECTION */}
    <div className="mt-2">
      {cartItem ? (
        <div className="flex justify-center gap-2">
          <button
            onClick={() =>
              updateQty(
                item.name,
                variant.label,
                cartItem.qty - 1
              )
            }
            className="bg-gray-300 px-2 rounded"
          >
            -
          </button>
          <span>{cartItem.qty}</span>
          <button
            onClick={() =>
              addToCart({
                name: item.name,
                variant: variant.label,
                price: variant.price,
              })
            }
            className="bg-green-500 text-white px-2 rounded"
          >
            +
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
          className="bg-green-500 text-white w-full py-1 rounded"
        >
          ADD
        </button>
      )}
    </div>
  </div>
</div>
          );
        })}
      </div>

      {/* 🛒 Floating Bottom Cart */}
{cart && cart.length > 0 && (
  <div className="fixed bottom-0 left-0 w-full bg-green-600 text-white px-4 py-3 flex justify-between items-center shadow-lg z-50">
    
    {/* Left: items + total */}
    <div>
      <p className="text-sm font-semibold">
        {cart.length} item{cart.length > 1 ? "s" : ""}
      </p>
      <p className="text-xs">
        ₹
        {cart.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        )}
      </p>
    </div>

    {/* Right: button */}
    <button
      onClick={onCartClick}
      className="bg-white text-green-700 px-4 py-2 rounded-full font-semibold"
    >
      View Cart →
    </button>
    
  </div>
)}
    </>
  );
}