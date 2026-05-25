"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import CategoryLayout from "@/app/components/CategoryLayout";
import ProductCard from "@/app/components/Productcard";
import ProductCardSkeleton from "@/app/components/skelton/ProductCardSkeleton";
import { useCart } from "@/app/context/CartContext"; // 👈

export default function Page() {
  const { category, subcategory } = useParams();
  const { cart, addToCart, updateQty } = useCart(); // 👈

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState({}); // 👈

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*");

      if (category) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", category)
          .single();

        if (cat) query = query.eq("category_id", cat.id);
      }

      if (subcategory) {
        const { data: sub } = await supabase
          .from("subcategories")
          .select("id")
          .eq("slug", subcategory)
          .single();

        if (sub) query = query.eq("subcategory_id", sub.id);
      }

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [category, subcategory]);

  // 👈 set default variants when products load
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

  return (
    <CategoryLayout>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
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
                addToCart={addToCart}
                updateQty={updateQty}
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