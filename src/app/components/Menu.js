"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabase";
import ProductCard from "./Productcard";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { useCart } from "../context/CartContext";

export default function Menu({ onCartClick }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
// Remove from props: cart, addToCart, updateQty
// Add at top:
const { cart, addToCart, updateQty } = useCart();
  useEffect(() => {
    const fetchData = async () => {
      const { data: prod } = await supabase
        .from("products")
        .select(`*, categories(id,name)`);
      const { data: cat } = await supabase.from("categories").select("*");
      setProducts(prod || []);
      setCategories(cat || []);
      setTimeout(() => setLoading(false), 200);
    };
    fetchData();
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

  const categoryList = [{ id: "all", name: "All" }, ...categories];

  const filtered = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" || p.category_id === selectedCategory;
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const groupedProducts = categories.map((cat) => ({
    ...cat,
    items: products.filter(
      (p) =>
        p.category_id === cat.id &&
        p.name?.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  const router = useRouter();

  if (loading) {
    return (
      <div className="md:p-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2 my-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 animate-pulse rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-2 animate-pulse">
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded mt-3" />
              <div className="h-3 bg-gray-200 rounded mt-2 w-1/2 mx-auto" />
              <div className="h-8 bg-gray-200 rounded mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto md:p-3 py-3 max-w-6xl">

      {/* 🔥 CATEGORY ICONS */}
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        slidesPerView="auto"
        spaceBetween={12}
        className="mb-4"
      >
        {categoryList.map((cat) => (
          <SwiperSlide key={cat.id} style={{ width: "auto" }}>
            <div
              onClick={() => router.push(`/${cat.slug}`)}
              className="flex flex-col items-center cursor-pointer w-[70px]"
            >
              <div className={`w-14 h-14 rounded-xl overflow-hidden ${
                selectedCategory === cat.id ? "ring-2 ring-green-500" : ""
              }`}>
                <Image
                  src={cat.image || "/images/icon-vegacart.png"}
                  alt={cat.name}
                  width={60}
                  height={60}
                />
              </div>
              <p className="text-xs text-center text-black mt-1">{cat.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔥 FEATURED CATEGORY SECTIONS */}
      {groupedProducts.map((cat) => {
        if (!cat.items.length) return null;

        const prevClass = `prev-${cat.id}`;
        const nextClass = `next-${cat.id}`;

        return (
          <div key={cat.id} className="mb-6">
            <div className="flex justify-between items-center py-2 mb-2">
              <h2 className="font-semibold text-black">{cat.name}</h2>
            </div>

            <div className="relative px-6">

              {/* Left Arrow */}
              <button
                className={`${prevClass} absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <Swiper
                modules={[FreeMode, Navigation]}
                freeMode={true}
                slidesPerView="auto"
                spaceBetween={12}
                navigation={{
                  prevEl: `.${prevClass}`,
                  nextEl: `.${nextClass}`,
                }}
                onSwiper={(swiper) => {
                  // Re-init navigation after mount so it finds the buttons
                  setTimeout(() => swiper.navigation.init(), 0);
                }}
              >
                {cat.items.map((item) => {
                  const variant = selectedVariants[item.id];
                  const cartItem = cart.find(
                    (c) => c.name === item.name && c.variant === variant?.label
                  );

                  return (
                    <SwiperSlide key={item.id} style={{ width: "192px" }}>
                      <div className="py-2">
                        <ProductCard
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
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Right Arrow */}
              <button
                className={`${nextClass} absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

            </div>
          </div>
        );
      })}

      {/* 🔥 GRID (WHEN CATEGORY SELECTED) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {filtered.map((item) => {
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
        })}
      </div>

      {/* 🛒 Floating Bottom Cart */}
      {cart && cart.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-green-600 text-white px-4 py-3 flex justify-between items-center shadow-lg z-50">
          <div>
            <p className="text-md font-semibold">
              {cart.length} item{cart.length > 1 ? "s" : ""}
            </p>
            <p className="text-sm">
              ₹{cart.reduce((sum, item) => sum + item.price * item.qty, 0)}
            </p>
          </div>
          <button
            onClick={onCartClick}
            className="bg-white text-green-700 px-4 py-2 rounded-full font-semibold"
          >
            View Cart →
          </button>
        </div>
      )}
    </div>
  );
}