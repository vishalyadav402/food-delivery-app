"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import ProductCard from "../components/Productcard";
import CategoryLayout from "../components/CategoryLayout";
import ProductCardSkeleton from "../components/skelton/ProductCardSkeleton";
import { useCart } from "@/app/context/CartContext"; // 👈

export default function Page() {
  const { category, subcategory } = useParams();
  const { cart, addToCart, updateQty } = useCart(); // 👈 remove local cart state

  const [selectedVariants, setSelectedVariants] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subId, setSubId] = useState(null);

  useEffect(() => {
    const updateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setSubId(params.get("subId"));
    };

    updateFromUrl();
    window.addEventListener("subcategoryChange", updateFromUrl);
    return () => window.removeEventListener("subcategoryChange", updateFromUrl);
  }, []);

  useEffect(() => {
    const initial = {};
    products.forEach((p) => {
      initial[p.id] = p.variants?.[0] || {
        label: "Default",
        price: p.price || 0,
        mrp: p.mrp || p.price || 0,
      };
    });
    setSelectedVariants(initial);
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      let query = supabase.from("products").select("*").eq("is_active", true);

      if (category) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", category)
          .single();

        if (cat) query = query.eq("category_id", cat.id);
      }

      if (subId) query = query.eq("subcategory_id", subId);

      const { data, error } = await query;
      console.log(data, error);
      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [category, subId]);

  return (
    <CategoryLayout>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} /> // 👈 fixed: no extra grid wrapper needed
          ))
        ) : products.length > 0 ? (
          products.map((item) => {
            const variant = selectedVariants[item.id];
            const cartItem = cart.find(
              (c) => c.name === item.name && c.variant === variant?.label
            );

            return (
              <ProductCard
                key={item.id}
                item={item}
                variant={variant}
                cartItem={cartItem}
                addToCart={addToCart} // 👈 from context
                updateQty={updateQty} // 👈 from context
                onVariantChange={(v) =>
                  setSelectedVariants((prev) => ({
                    ...prev,
                    [item.id]: v,
                  }))
                }
              />
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found 😔
          </p>
        )}
      </div>
    </CategoryLayout>
  );
}