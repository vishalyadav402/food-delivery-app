"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabase";
import { Minus, Plus } from "lucide-react";
import ProductCard from "./Productcard";

export default function Menu({ cart = [], addToCart, updateQty, cartCount, onCartClick }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ NEW
  const [selectedCategory, setSelectedCategory] = useState("all"); // ✅ FIXED
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ Fetch products + categories
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories(id, name)
        `);

      const { data: catData } = await supabase
        .from("categories")
        .select("*");

      if (error) console.error(error);
      else {
        setProducts(data || []);
        setCategories(catData || []);
      }

      setTimeout(() => setLoading(false), 300);
    };

    fetchData();
  }, []);

  // ✅ Default variants
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

  // ✅ CATEGORY LIST (FROM DB)
  const categoryList = [
    { id: "all", name: "All" },
    ...(categories || []),
  ];

  // ✅ FILTER FIXED
  const filtered = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" ||
      p.category_id === selectedCategory;

    const matchSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const groupedProducts = (categories || []).map((cat) => ({
  ...cat,
  items: (products || []).filter(
    (p) =>
      p.category_id === cat.id &&
      p.name?.toLowerCase().includes(search.toLowerCase())
  ),
}));

  if (loading) {
  return (
    <div className="mx-auto max-w-6xl">

      {/* Category Skeleton */}
      <div className="flex gap-3 mb-4 overflow-x-auto px-0">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center min-w-[70px]">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-3 w-12 bg-gray-200 mt-2 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Product Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white p-2 rounded-lg shadow animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 mt-2 rounded"></div>
            <div className="h-3 bg-gray-200 mt-1 w-1/2 rounded"></div>
            <div className="h-8 bg-gray-200 mt-3 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

  return (
    <div className="mx-auto p-3 px-0 max-w-6xl">
     <div className="sticky top-[50px] z-40 py-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white text-gray-600 border rounded-full px-4 py-2 pr-10 focus:outline-none"
        />

        {/* 🔍 Icon */}
        <span className="absolute right-8 top-2 text-gray-400">🔍</span>

        {/* ❌ Clear */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1.5 text-gray-500"
          >
            ✕
          </button>
        )}
      </div>
    </div>


      {/* 🔥 Categories */}
      <div className="flex gap-3 mb-4 overflow-x-auto px-0 no-scrollbar">
  {categoryList.map((cat) => (
    <div
      key={cat.id}
      onClick={() => setSelectedCategory(cat.id)}
      className="flex flex-col items-center cursor-pointer min-w-[70px]"
    >

      {/* ICON */}
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden shadow-sm transition ${
          selectedCategory === cat.id
            ? "ring-2 ring-green-500 scale-95"
            : "bg-white"
        }`}
      >
        {cat.id === "all" ? (
          <span className="text-lg">🛒</span>
        ) : (
          <Image
            src={cat.image || "/images/icon-vegacart.png"}
            alt={cat.name}
            width={50}
            height={50}
            className="object-contain"
          />
        )}
      </div>

      {/* NAME */}
      <p
        className={`text-[12px] mt-1 text-center ${
          selectedCategory === cat.id
            ? "text-green-600 font-medium"
            : "text-gray-500"
        }`}
      >
        {cat.name}
      </p>
    </div>
  ))}
</div>




<div className="space-y-6 mt-4">

  {groupedProducts.map((cat) => {
    if (!cat.items.length) return null;

    return (
      <div key={cat.id}>

        {/* 🔥 CATEGORY HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Image
              src={cat.image || "/images/icon-vegacart.png"}
              alt={cat.name}
              width={50}
              height={50}
            />
            {cat.name}
          </h2>

          <button
            onClick={() => setSelectedCategory(cat.id)}
            className="text-green-600 text-sm"
          >
            see all
          </button>
        </div>

        {/* 🔥 HORIZONTAL PRODUCTS */}
        <div className="flex gap-3 overflow-x-auto px-0 no-scrollbar py-5">

          {cat.items.slice(0, 10).map((item) => {
            const variant =
              selectedVariants[item.id] ||
              item.variants?.[0] || {
                label: "Default",
                price: item.price || 0,
              };

            const cartItem = (cart || []).find(
              (c) =>
                c.name === item.name &&
                (c.variant || "Default") === variant.label
            );

            return (
             <div className="w-3xs h-full">
            <ProductCard
                  key={item.id}
                  item={item}
                  variant={variant}
                  cartItem={cartItem}
                  addToCart={addToCart}
                  updateQty={updateQty}
                />
                </div>
            );
          })}
        </div>
      </div>
    );
  })}

</div>

      {/* 🛍 Products */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
       {filtered.map((item) => {
  const variant =
    selectedVariants[item.id] ||
    item.variants?.[0] || {
      label: "Default",
      price: item.price || 0,
      mrp: item.mrp || item.price || 0,
    };

  const cartItem = (cart || []).find(
    (c) =>
      c.name === item.name &&
      (c.variant || "Default") === variant.label
  );

  return (
    <ProductCard
      key={item.id}
      item={item}
      variant={variant}
      cartItem={cartItem}
      addToCart={addToCart}
      updateQty={updateQty}
    />
  );
})}
      </div>
    </div>
  );
}