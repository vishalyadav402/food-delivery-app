"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import CategoryLayout from "@/app/components/CategoryLayout";
import ProductCard from "@/app/components/Productcard";
import ProductCardSkeleton from "@/app//components/skelton/ProductCardSkeleton";

export default function Page() {
  const { category, subcategory } = useParams();

  const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*");

      // filter by category
      if (category) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", category)
          .single();

        if (cat) query = query.eq("category_id", cat.id);
      }

      // filter by subcategory
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

  return (
    <CategoryLayout>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {loading ? (
          <>
          {[...Array(4)].map((_, i) => (
              <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 gap-3">
              <ProductCardSkeleton key={i} />
              </div>
            ))}
            </>
        ) : products.length > 0 ? (
          products.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found 😔
          </p>
        )}

      </div>
    </CategoryLayout>
  );
}