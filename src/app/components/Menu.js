"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabase";

export default function Menu({ cart = [], addToCart, updateQty, cartCount, onCartClick }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const activeProducts = products.filter((p) => p.is_active);
  // ✅ Fetch products
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) console.error(error);
      else 
        setProducts(data || []); // show immediately
setTimeout(() => setLoading(false), 300); // small delay for smoothness
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
  const filtered = activeProducts.filter((p) => {
  const matchCategory =
    selectedCategory === "All" || p.category === selectedCategory;

  const matchSearch = p.name
    .toLowerCase()
    .includes(search.toLowerCase());

  return matchCategory && matchSearch;
});

  if (loading) {
  return (
    <div className="p-4">
      {/* Category Skeleton */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"
          ></div>
        ))}
      </div>

      {/* Product Skeleton Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-2 animate-pulse"
          >
            {/* Image */}
            <div className="h-32 bg-gray-200 rounded"></div>

            {/* Text */}
            <div className="h-4 bg-gray-200 rounded mt-3"></div>
            <div className="h-3 bg-gray-200 rounded mt-2 w-1/2 mx-auto"></div>

            {/* Button */}
            <div className="h-8 bg-gray-200 rounded mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

  return (
    <>

    {/* 🔍 Sticky Search */}
<div className="sticky top-[70px] z-40 bg-none px-3 py-2 shadow-none">
  <div className="relative">
    <input
      type="text"
      placeholder="Search for products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full bg-white text-gray-600 border rounded-full px-4 py-2 pr-10 focus:outline-none"
    />

    <span className="absolute right-3 top-2 text-gray-400">
      🔍
    </span>
     {/* ❌ Clear Button */}
    {search && (
      <button
        onClick={() => {
          setSearch("")
          inputRef.current?.focus();
        }
        }
        className="absolute right-10 top-2 text-gray-400 hover:text-black"
      >
        ✖
      </button>
    )}
  </div>
</div>

      {/* Category Filter */}
    {/* 🔥 Category Section */}
<div
  className={`transition-all duration-300 ${
    loading ? "opacity-50" : "opacity-100"
  }`}
>
  {loading ? (
    <div className="flex gap-3 mb-4 overflow-x-auto px-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col items-center min-w-['70px']">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-3 w-12 bg-gray-200 mt-2 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex gap-3 mb-4 overflow-x-auto px-2 no-scrollbar">
      
      {/* Dynamic categories */}
      {categories.map((cat) => (
        <div
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`flex flex-col items-center min-w-['70px'] cursor-pointer transition ${
            selectedCategory === cat ? "scale-90" : "opacity-80"
          }`}
        >
          <div
            className={`w-12 h-12 text-gray-600 rounded-full flex items-center justify-center text-sm ${
              selectedCategory === cat
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {cat[0]} {/* first letter */}
          </div>
          <p className="text-xs text-black mt-1 text-center">{cat}</p>
        </div>
      ))}
    </div>
  )}
</div>

<div className={`transition-opacity duration-300 ${
    loading ? "opacity-50" : "opacity-100"
  }`}
>
      {/* Products */}
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {loading
    ? [...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow p-2 animate-pulse"
        >
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 mt-3 rounded"></div>
          <div className="h-3 bg-gray-200 mt-2 w-1/2 mx-auto rounded"></div>
          <div className="h-8 bg-gray-200 mt-4 rounded"></div>
        </div>
      ))
        :filtered.map((item) => {
          const variant =
  selectedVariants[item.id] ||
  (item.variants?.length > 0
    ? item.variants[0]
    : {
        label: "Default",
        price: item.price || 0,
        mrp: item.mrp || item.price || 0, // ✅ ADD THIS LINE
      });

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
  className="bg-white text-black rounded-xl shadow hover:shadow-lg transition flex flex-col h-full overflow-hidden"
>
  {/* IMAGE + BADGES */}
  <div className="relative p-2 flex justify-center items-center h-28">

    {/* 🔥 Discount Badge */}
    {variant.mrp > variant.price && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-[2px] rounded shadow">
        {Math.round(
          ((variant.mrp - variant.price) / variant.mrp) * 100
        )}% OFF
      </span>
    )}

    {/* ⭐ Best Deal */}
    {variant.mrp > variant.price &&
      ((variant.mrp - variant.price) / variant.mrp) * 100 >= 20 && (
        <span className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] px-2 py-[2px] rounded font-semibold">
          Best
        </span>
      )}

    <Image
      src={item.image || "/images/icon-vegacart.png"}
      alt={item.name}
      width={200}
      height={150}
      className="h-20 object-contain"
      loading="lazy"
      placeholder="blur"
      blurDataURL="/images/icon-vegacart.png"
    />
  </div>

  {/* CONTENT */}
  <div className="flex flex-col justify-between flex-1 px-2 pb-2">

    {/* TOP */}
    <div>
      <h4 className="text-sm font-semibold text-center line-clamp-2 min-h-[32px]">
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
              className={`text-[10px] px-2 border rounded ${
                variant.label === v.label
                  ? "bg-green-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* PRICE */}
      <div className="flex justify-center items-center gap-1 mt-1">
        <span className="text-green-600 font-bold text-sm">
          ₹{variant.price}
        </span>

        {variant.mrp > variant.price && (
          <span className="text-gray-400 line-through text-xs">
            ₹{variant.mrp}
          </span>
        )}
      </div>

      {/* SAVE */}
      {variant.mrp > variant.price && (
        <p className="text-[10px] text-green-600 text-center">
          Save ₹{variant.mrp - variant.price}
        </p>
      )}
    </div>

    {/* 🔥 BOTTOM FIXED */}
    <div className="mt-2">
      {cartItem ? (
        <div className="flex justify-between items-center border rounded-full px-2 py-1">
          <button
            onClick={() =>
              updateQty(
                item.name,
                variant.label,
                cartItem.qty - 1
              )
            }
            className="px-2 text-lg"
          >
            -
          </button>

          <span className="text-sm font-semibold">
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
            className="px-2 text-lg text-green-600"
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
          className="bg-green-500 text-white w-full py-1.5 rounded-full text-sm font-semibold hover:bg-green-600"
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
</div>


      {/* 🛒 Floating Bottom Cart */}
{cart && cart.length > 0 && (
  <div className="md:hidden fixed bottom-0 left-0 w-full bg-green-600 text-white px-4 py-3 flex justify-between items-center shadow-lg z-50">
    
    {/* Left: items + total */}
    <div>
      <p className="text-md font-semibold">
        {cart.length} item{cart.length > 1 ? "s" : ""}
      </p>
      <p className="text-sm">
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