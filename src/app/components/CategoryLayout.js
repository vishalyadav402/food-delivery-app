"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/utils/supabase";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Master from "../components/Master";
import { useRouter } from "next/navigation";

const CategoryLayout = ({ children }) => {
 
const { category, subcategory } = useParams();
const router = useRouter();

const selectedCategory = category;
const selectedSubcategory = subcategory;

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const activeIndex = categories.findIndex(
  (c) => c.slug === selectedCategory
);

useEffect(() => {
  if (!swiperRef.current || activeIndex < 0) return;

  const total = categories.length;

  // center item (smart offset)
  const indexToShow =
    activeIndex === 0
      ? 0
      : activeIndex === total - 1
      ? total - 1
      : activeIndex - 1;

  swiperRef.current.slideTo(indexToShow);
}, [activeIndex, categories]);



  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  // FETCH SUBCATEGORIES
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchSub = async () => {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", selectedCategory)
        .single();

      if (!cat) return;

      const { data: subs } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", cat.id);

      setSubcategories(subs || []);
    };

    fetchSub();
  }, [selectedCategory]);

  return (
    <Master>
      <div className="px-0 mt-25 md:px-4">

        {/* CATEGORY */}
        <div className="relative flex items-center md:mb-2 h-10 bg-white">

          {!isBeginning && (
            <button
              className="absolute left-0 z-10 bg-white shadow p-1 rounded-full"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ChevronLeft />
            </button>
          )}

          <Swiper
            slidesPerView={"auto"}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id} className="!w-auto">
                <div
                  onClick={() => {
                    router.push(`/${cat.slug}`);
                    }}
                  className={`px-3 py-1 text-sm cursor-pointer ${
                    selectedCategory === cat.slug
                      ? "bg-purple-100 text-purple-700"
                      : ""
                  }`}
                >
                  {cat.name}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {!isEnd && (
            <button
              className="absolute right-0 z-10 bg-white shadow p-1 rounded-full"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ChevronRight />
            </button>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-5">

          {/* LEFT */}
          <div className="col-span-1 bg-white max-h-[75vh] overflow-auto">
            {subcategories.map((sub) => (
              <div
                key={sub.id}
                    onClick={() =>
                    router.push(`/${selectedCategory}/${sub.slug}`)
                    }
                className={`p-2 cursor-pointer ${
                  selectedSubcategory === sub.slug
                    ? "border-r-4 border-purple-600"
                    : ""
                }`}
              >
                <div className="self-center">
                <Image
                  src={sub.image || "/images/placeholder-icon.png"}
                  width={50}
                  height={50}
                  alt={sub.name}
                />
                </div>
                <p className="text-xs">{sub.name}</p>
              </div>
            ))}
          </div>

          {/* RIGHT (DYNAMIC CONTENT) */}
          <div className="col-span-4 bg-gray-100 p-3 h-[75vh] overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </Master>
  );
};

export default CategoryLayout;