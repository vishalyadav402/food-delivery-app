"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase";
import ProductCard from "../components/Productcard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Master from "../components/Master";

export default function Page() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  // get query from localStorage
  useEffect(() => {
    const storedQuery = localStorage.getItem("searchQuery") || "";
    setQuery(storedQuery);
  }, []);

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;

      const { data } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${query}%`);

      setProducts(data || []);
    };

    fetchProducts();
  }, [query]);

  // default variant
  useEffect(() => {
    const initial = {};
    products.forEach((p) => {
      initial[p.id] =
        p.variants?.[0] || {
          label: "Default",
          price: p.price,
          mrp: p.mrp || p.price,
        };
    });
    setSelectedVariants(initial);
  }, [products]);

  return (
    <>
<Master>
    <div className="p-4 max-w-6xl mt-32 min-h-screen mx-auto">
      {query && (
        <p className="mb-3 text-gray-800 font-semibold">
          Showing results for:{" "}
          <span className="text-green-600">"{query}"</span>
        </p>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((item, index) => {
            const variant = selectedVariants[item.id];

            return (
              <ProductCard
                key={item.id || index}
                item={item}
                variant={variant}
                cartItem={null}
                addToCart={() => {}}
                updateQty={() => {}}
                onVariantChange={(v) =>
                  setSelectedVariants((prev) => ({
                    ...prev,
                    [item.id]: v,
                  }))
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-500">
          No results found 😔
        </div>
      )}


    </div>
</Master>
</>
  );
}