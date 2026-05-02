"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabase";
import ProductCard from "./Productcard";

export default function Menu({ cart = [], addToCart, updateQty, onCartClick }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ DB categories
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ Fetch products + categories
  useEffect(() => {
    const fetchData = async () => {
      const { data: prod } = await supabase
        .from("products")
        .select(`*, categories(id,name)`);

      const { data: cat } = await supabase
        .from("categories")
        .select("*");

      setProducts(prod || []);
      setCategories(cat || []);
      setTimeout(() => setLoading(false), 300);
    };

    fetchData();
  }, []);

  // ✅ Default variants
  useEffect(() => {
    const initial = {};
    products.forEach((p) => {
      initial[p.id] =
        p.variants?.[0] || {
          label: "Default",
          price: p.price || 0,
          mrp: p.mrp || p.price || 0,
        };
    });
    setSelectedVariants(initial);
  }, [products]);

  // ✅ Category list
  const categoryList = [{ id: "all", name: "All" }, ...categories];

  // ✅ Filtered products
  const filtered = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" ||
      p.category_id === selectedCategory;

    const matchSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  // ✅ Grouped products (Featured sections)
  const groupedProducts = categories.map((cat) => ({
    ...cat,
    items: products.filter(
      (p) =>
        p.category_id === cat.id &&
        p.name?.toLowerCase().includes(search.toLowerCase())
    ),
  }));

   if (loading) {
  return (
    <div className="md:p-4 mx-auto max-w-6xl">
      {/* Category Skeleton */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2 my-3">
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
    <div className="mx-auto p-3 max-w-6xl">

      {/* 🔍 SEARCH */}
      <div className="sticky top-[60px] z-40 bg-white border-green-200 outline-green-200 py-2 shadow-none">
      <div className="relative mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full border rounded-full px-4 py-2"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-2"
          >
            ✕
          </button>
        )}
      </div>
      </div>


      {/* 🔥 CATEGORY ICONS */}
      <div className="flex gap-3 overflow-x-auto mb-4">
        {categoryList.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="flex flex-col items-center cursor-pointer min-w-[70px]"
          >
            <div className={`w-14 h-14 rounded-xl overflow-hidden ${
              selectedCategory === cat.id ? "ring-2 ring-green-500" : ""
            }`}>
              {cat.id === "all" ? (
                <div className="flex items-center justify-center h-full">🛒</div>
              ) : (
                <Image
                  src={cat.image || "/images/icon-vegacart.png"}
                  alt={cat.name}
                  width={60}
                  height={60}
                />
              )}
            </div>

            <p className="text-xs mt-1">{cat.name}</p>
          </div>
        ))}
      </div>

      {/* 🔥 FEATURED CATEGORY SECTIONS */}
      {selectedCategory === "all" &&
        groupedProducts.map((cat) => {
          if (!cat.items.length) return null;

          return (
            <div key={cat.id} className="mb-6">

              {/* HEADER */}
              <div className="flex justify-between items-center py-2 mb-2">
                <h2 className="font-semibold">{cat.name}</h2>
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className="text-green-600 text-sm"
                >
                  see all
                </button>
              </div>

              {/* HORIZONTAL SCROLL */}
              <div className="flex gap-3 overflow-x-auto">
                {cat.items.map((item) => {
                  const variant = selectedVariants[item.id];
                  const cartItem = cart.find(
                    (c) =>
                      c.name === item.name &&
                      c.variant === variant?.label
                  );

                  return (
                    <div key={item.id} className="py-2">
                      <ProductCard
                        item={item}
                        variant={variant}
                        cartItem={cartItem}
                        addToCart={addToCart}
                        updateQty={updateQty}
                        onVariantChange={(v) =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [item.id]: v,
                          }))
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* 🔥 GRID (WHEN CATEGORY SELECTED) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {filtered.map((item) => {
          const variant = selectedVariants[item.id];
          const cartItem = cart.find(
            (c) =>
              c.name === item.name &&
              c.variant === variant?.label
          );

          return (
            <>
            <ProductCard
              key={item.id}
              item={item}
              variant={variant}
              cartItem={cartItem}
              addToCart={addToCart}
              updateQty={updateQty}
              onVariantChange={(v) =>
                setSelectedVariants((prev) => ({
                  ...prev,
                  [item.id]: v,
                }))
              }
            />

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
                
        })}
      </div>
    </div>
  );
}