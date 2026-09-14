"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchFresh = async () => {
      const [{ data: prod }, { data: cat }] = await Promise.all([
        supabase.from("products").select("*, categories(id,name)").eq("is_active", true),
        supabase.from("categories").select("*"),
      ]);
      if (prod) {
        setProducts(prod);
        setCategories(cat || []);
        localStorage.setItem("products_cache", JSON.stringify({
          products: prod, categories: cat || [], timestamp: Date.now(),
        }));
      }
      setLoaded(true);
    };

    // step 1 — show cache instantly
    const cached = localStorage.getItem("products_cache");
    if (cached) {
      const { products, categories, timestamp } = JSON.parse(cached);
      setProducts(products);
      setCategories(categories);
      setLoaded(true);
      // step 2 — refresh if older than 5 mins
      if (Date.now() - timestamp > 5 * 60 * 1000) fetchFresh();
    } else {
      fetchFresh();
    }
  }, []);

  // step 3 — realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" },
        () => {
          // clear cache and refetch when admin updates anything
          localStorage.removeItem("products_cache");
          supabase.from("products").select("*, categories(id,name)").eq("is_active", true)
            .then(({ data }) => { if (data) setProducts(data); });
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <ProductsContext.Provider value={{ products, categories, loaded }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);