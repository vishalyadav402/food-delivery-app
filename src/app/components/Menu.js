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

function CategoryRow({ cat, selectedVariants, setSelectedVariants }) {
  const { cart, addToCart, updateQty } = useCart();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !swiper.navigation) return;
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-sm text-gray-800">{cat.name}</h2>
        <button
          onClick={() => router.push(`/${cat.slug}`)}
          className="text-xs text-purple-600 font-semibold border border-purple-500 px-2 py-0.5 rounded-full hover:bg-purple-50 transition"
        >
          See All →
        </button>
      </div>

      <div className="relative px-6">
        <button ref={prevRef} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <Swiper
          modules={[FreeMode, Navigation]}
          freeMode={true}
          slidesPerView="auto"
          spaceBetween={12}
          navigation={false}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
        >
          {cat.items.map((item) => {
            const variant = selectedVariants[item.id];
            const cartItem = cart.find(
              (c) => c.slug === item.slug && c.variant === variant?.label
            );
            return (
              <SwiperSlide key={item.id} style={{ maxWidth: "150px" }}>
                <div className="py-2">
                  <ProductCard
                    item={item}
                    variant={variant}
                    cartItem={cartItem}
                    addToCart={addToCart}
                    updateQty={updateQty}
                    onVariantChange={(v) =>
                      setSelectedVariants((prev) => ({ ...prev, [item.id]: v }))
                    }
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button ref={nextRef} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: prod } = await supabase
        .from("products")
        .select(`*, categories(id,name)`)
        .eq("is_active", true);
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

  const groupedProducts = categories.map((cat) => ({
    ...cat,
    items: products.filter(
      (p) =>
        p.category_id === cat.id &&
        p.name?.toLowerCase().includes(search.toLowerCase())
    ),
  }));

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
    <div className="mx-auto md:p-3 pb-3 max-w-6xl">

      {/* CATEGORY ICONS */}
      <div className="grid mb-10 grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-4">
        {categoryList.map((cat) => (
          <div
            key={cat.id}
            onClick={() => router.push(`/${cat.slug}`)}
            className="flex flex-col items-center cursor-pointer w-[70px]"
          >
            <div className={`w-14 h-14 rounded-xl overflow-hidden ${
              selectedCategory === cat.id ? "ring-2 ring-purple-500" : ""
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
        ))}
      </div>

      {/* FEATURED CATEGORY SECTIONS */}
      {groupedProducts.map((cat) => {
        if (!cat.items.length) return null;
        return (
          <CategoryRow
            key={cat.id}
            cat={cat}
            selectedVariants={selectedVariants}
            setSelectedVariants={setSelectedVariants}
          />
        );
      })}
    </div>
  );
}
