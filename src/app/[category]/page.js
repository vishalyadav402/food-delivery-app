"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import ProductCard from "../components/Productcard";
import CategoryLayout from "../components/CategoryLayout";
import ProductCardSkeleton from "../components/skelton/ProductCardSkeleton";

export default function Page() {
  const { category, subcategory } = useParams();
const [selectedVariants, setSelectedVariants] = useState({});
const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subId, setSubId] = useState(null);

  useEffect(() => {
  const updateFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    setSubId(params.get("subId"));
  };

  updateFromUrl();

  window.addEventListener(
    "subcategoryChange",
    updateFromUrl
  );

  return () => {
    window.removeEventListener(
      "subcategoryChange",
      updateFromUrl
    );
  };
}, []);



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

const addToCart = (product) => {
  const existing = cart.find(
    (c) =>
      c.name === product.name &&
      c.variant === product.variant?.label
  );

  if (existing) {
    const updated = cart.map((c) =>
      c.name === product.name &&
      c.variant === product.variant?.label
        ? { ...c, qty: c.qty + 1 }
        : c
    );
    setCart(updated);
  } else {
    setCart([...cart, { ...product, qty: 1 }]);
  }
};

const updateQty = (id, qty) => {
  if (qty <= 0) {
    setCart(cart.filter((c) => c.id !== id));
  } else {
    setCart(
      cart.map((c) =>
        c.id === id ? { ...c, qty } : c
      )
    );
  }
};


  useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);

    let query = supabase.from("products").select("*");

    // category filter
    if (category) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (cat) {
        query = query.eq("category_id", cat.id);
      }
    }

    // subcategory filter
    if (subId) {
      query = query.eq("subcategory_id", subId);
    }

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
          <>
          {[...Array(4)].map((_, i) => (
              <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 gap-3">
              <ProductCardSkeleton key={i} />
              </div>
            ))}
            </>
        ): products.length > 0 ? (
  products.map((item) => {
    const variant = selectedVariants[item.id];

    const cartItem = cart.find(
      (c) =>
        c.name === item.name &&
        c.variant === variant?.label
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