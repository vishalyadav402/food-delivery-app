"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabase";

export default function Menu({ cart = [], addToCart, updateQty }) {
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
            className={`px-4 py-1 mb-1 rounded-full whitespace-nowrap ${
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
              className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition"
            >
              {/* Image */}
              <div className="h-[200px] w-full">
                <Image
                  src={item.image  || "/images/icon-vegacart.png"}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Content */}
              <div className="py-3 text-center bg-black">
                <h4 className="text-sm font-semibold">
                  {item.name}
                </h4>

                {/* Variant */}
              {/* Variant Handling */}
              {item.variants?.length > 1 ? (
                // 🔹 Multiple variants → show dropdown
                <select style={{width:'130px'}}
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
                  className="mt-1 text-black px-2 py-1 rounded border-amber-100 w-full"
                >
                  {item.variants.map((v, i) => (
                    <option key={i} value={v.label}>
                      {v.label} - ₹{v.price}
                    </option>
                  ))}
                </select>
              ) : item.variants?.length === 1 ? (
                // 🔹 Single variant → show simple label
                <p className="text-md mt-1">
                  {item.variants[0].label}
                </p>
              ) : (
                //  No variants
                <p className="text-xs text-gray-500 mt-1">
                  Standard Item
                </p>
              )}

                {/* Price */}
                <p className="text-green-400 font-semibold mt-1">
                  ₹{variant?.price || 0}
                </p>

                {/* ✅ Add / Qty Controls */}
                {cartItem ? (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQty(
                          item.name,
                          currentVariantLabel,
                          cartItem.qty - 1
                        )
                      }
                      className="bg-gray-400 text-white px-2 rounded"
                    >
                      -
                    </button>

                    <span className="text-whitesmoke">
                      {cartItem.qty}
                    </span>

                    <button
                      onClick={() => {
                      const latestVariant =
                        selectedVariants[item.id] ||
                        item.variants?.[0] || {
                          label: "Default",
                          price: item.price || 0,
                        };

                      addToCart({
                        name: item.name,
                        variant: latestVariant.label,
                        price: latestVariant.price,
                        image: item.image,
                      });
                    }}
                      
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
                        image: item.image,
                      })
                    }
                    className="mt-2 px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}