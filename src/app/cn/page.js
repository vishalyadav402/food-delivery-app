"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase";
import ProductCard from "@/app/components/Productcard";

export default function Page() {
  const { name } = useParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    fetchData();
  }, [name]);

  const fetchData = async () => {
    if (!name) return;

    // 🔍 find category
    const { data: cat } = await supabase
      .from("categories")
      .select("*")
      .ilike("name", decodeURIComponent(name))
      .single();

    if (!cat) return;

    setCategory(cat);

    // 📦 get products
    const { data: prod } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", cat.id);

    setProducts(prod || []);
  };

  // default variants
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

      {/* TITLE */}
      <h1 className="text-lg font-semibold mb-4 capitalize">
        {decodeURIComponent(name)}
      </h1>

      {/* PRODUCTS */}
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
        <div className="text-center text-gray-500 mt-10">
          No products found 😔
        </div>
      )}
    </div>
  );
}