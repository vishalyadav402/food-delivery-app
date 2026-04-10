"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabase";

export default function Menu({ cart, addToCart }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  const initial = {};
  products.forEach((p) => {
    if (p.variants?.length > 0) {
      initial[p.id] = p.variants[0];
    }
  });
  setSelectedVariants(initial);
}, [products]);

  // ✅ Fetch products
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error(error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // ✅ Categories
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category || "General")),
  ];

  // ✅ Filter products
  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <>
      {/* 🔥 Category Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto px-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🔥 Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((item) => {
          // ✅ Safe variant handling
         const variant =
  selectedVariants[item.id] ||
  (item.variants && item.variants.length > 0
    ? item.variants[0]
    : {
        label: "Default",
        price: item.price || 0, // fallback price
      });

          // ✅ Check cart
          const inCart = cart.some(
            (c) =>
              c.name === item.name &&
              c.variant === variant?.label
          );



          return (
            <div
              key={item.id}
              className="bg-white/10 relative rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform"
            >
              {/* Image */}
              <div className="h-[200px] w-full">
                <Image
                  src={item.image || "/images/icon-vegacart.png"}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Content */}
              <div className="p-3 text-center bg-black/40 backdrop-blur-sm">
                <h4 className="text-sm font-semibold">{item.name}</h4>

                {/* Variant Dropdown */}
                {item.variants && item.variants.length > 0 ? (
                  <select
                    value={variant?.label}
                    onChange={(e) => {
                      const v = item.variants.find(
                        (x) => x.label === e.target.value
                      );

                      setSelectedVariants((prev) => ({
                        ...prev,
                        [item.id]: v,
                      }));
                    }}
                    className="mt-1 text-black px-2 py-1 rounded w-full"
                  >
                    {item.variants.map((v, i) => (
                      <option key={i} value={v.label}>
                        {v.label} - ₹{v.price}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">
                  Standard Item
                </p>
                )}

                {/* Price */}
                <p className="text-green-400 font-semibold mt-1">
                ₹{variant?.price || 0}
              </p>

                {/* Button */}
                <button
                  onClick={() =>
                  addToCart({
                    name: item.name,
                    variant: variant?.label || "Default",
                    price: variant?.price || 0,
                    image: item.image,
                  })
                }
                  disabled={inCart}
                  className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    !variant
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : inCart
                      ? "bg-gray-400 text-white"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {!variant
                    ? "Out of Stock"
                    : inCart
                    ? "Added"
                    : "Add"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}