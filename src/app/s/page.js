"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import ProductCard from "../components/Productcard";
import Header from "../components/Header";
import Footer from "../components/Footer";

function SearchContent() {
const [query, setQuery] = useState("");

useEffect(() => {
  const q = localStorage.getItem("searchQuery") || "";
  setQuery(q);
}, []);

useEffect(() => {
  return () => {
    localStorage.removeItem("searchQuery");
  };
}, []);

useEffect(() => {
  const saved = localStorage.getItem("searchQuery");
  if (saved) setSearch(saved);
}, []);

  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

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
    <div className="p-4 max-w-6xl mx-auto">
      {query && (
        <p className="mb-3 text-gray-800 font-semibold">
          Showing results for:{" "}
          <span className="text-green-600">"{query}"</span>
        </p>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((item) => {
            const variant = selectedVariants[item.id];

            return (
              <ProductCard
                key={item.id}
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
  );
}

export default function Page() {
  return (
    <>
      <Header />

      {/* ✅ Wrap in Suspense */}
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <SearchContent />
      </Suspense>

      <Footer />
    </>
  );
}