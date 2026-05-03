"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase";
import ProductCard from "../components/Productcard";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Page() {
  const params = useSearchParams();
  const query = params.get("q") || "";

  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [query]);

  const fetchProducts = async () => {
    if (!query) return;

    const { data } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${query}%`);

    setProducts(data || []);
  };

  // default variant
  useEffect(() => {
    const initial = {};
    products.forEach((p) => {
      initial[p.id] = p.variants?.[0] || {
        label: "Default",
        price: p.price,
        mrp: p.mrp || p.price,
      };
    });
    setSelectedVariants(initial);
  }, [products]);

  return (
    <>
    <Header/>
    <div className="p-4 max-w-6xl mx-auto">

      {/* 🔥 TITLE */}
      {query && (
          <p className="mb-3 text-gray-800 font-semibold">
          Showing results for:{" "}
          <span className="text-green-600">"{query}"</span>
        </p>
      )}

      {/* 🔥 PRODUCTS */}
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
      <Footer/>
      </>
  );
}