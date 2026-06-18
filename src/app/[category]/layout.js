"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/app/utils/supabase";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import Master from "../components/Master";

function CategorySkeleton() {
  return (
    <div className="flex items-center gap-8 px-2">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="h-6 w-[100px] bg-gray-200 animate-pulse rounded-full" />
      ))}
    </div>
  );
}

function SubcategorySkeleton() {
  return (
    <div className="flex flex-col gap-2 p-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1 p-2">
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-md" />
          <div className="w-12 h-2 bg-gray-200 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

export default function CategoryLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentSubcategory, setCurrentSubcategory] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  const subcategoryCache = useRef({});
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // 👈 detect product detail route: /[category]/[subcategory]/[productdetail] = 3 segments
  const pathSegments = pathname.split("/").filter(Boolean);
  const isProductDetailPage = pathSegments.length >= 3;

  useEffect(() => {
    setCurrentCategory(pathSegments[0] || "");
    setCurrentSubcategory(pathSegments[1] || "");
  }, [pathname]);

  // FETCH CATEGORIES — once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const { data } = await supabase.from("categories").select("*");
      setCategories(data || []);
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  // FETCH SUBCATEGORIES — cached per category
  useEffect(() => {
    if (!currentCategory) return;

    if (subcategoryCache.current[currentCategory]) {
      setSubcategories(subcategoryCache.current[currentCategory]);
      return;
    }

    let cancelled = false;

    const fetchSubcategories = async () => {
      setLoadingSubcategories(true);
      const { data: subs } = await supabase
        .from("subcategories")
        .select("*, categories!inner(slug)")
        .eq("categories.slug", currentCategory);

      if (cancelled) return;

      const result = subs || [];
      subcategoryCache.current[currentCategory] = result;
      setSubcategories(result);
      setLoadingSubcategories(false);
    };

    fetchSubcategories();
    return () => { cancelled = true; };
  }, [currentCategory]);

  const activeIndex = categories.findIndex((c) => c.slug === currentCategory);

  useEffect(() => {
    if (!swiperRef.current || activeIndex < 0) return;
    const total = categories.length;
    const indexToShow =
      activeIndex === 0 ? 0
      : activeIndex === total - 1 ? total - 1
      : activeIndex - 1;
    swiperRef.current.slideTo(indexToShow);
  }, [activeIndex, categories]);

  const handleCategoryClick = useCallback((slug) => {
    if (slug === currentCategory) return;
    router.push(`/${slug}`);
  }, [currentCategory, router]);

  const handleSubcategoryClick = useCallback((slug) => {
    if (slug === currentSubcategory) return;
    router.push(`/${currentCategory}/${slug}`);
  }, [currentCategory, currentSubcategory, router]);

  // 👈 PRODUCT DETAIL PAGE: skip all the chrome, just render children inside Master
  if (isProductDetailPage) {
    return (
      <Master>
        <div className="px-0 mt-28 md:px-4">
          {children}
        </div>
      </Master>
    );
  }

  return (
    <Master>
      <div className="px-0 mt-28 md:px-4">

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

          {loadingCategories ? (
            <CategorySkeleton />
          ) : (
            <Swiper
              slidesPerView="auto"
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat.id} className="!w-auto">
                  <div
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`px-3 py-1 text-sm cursor-pointer ${
                      currentCategory === cat.slug ? "bg-purple-100 text-purple-700" : ""
                    }`}
                  >
                    {cat.name}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {!isEnd && !loadingCategories && (
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

          {/* LEFT SIDEBAR */}
          <div className="col-span-1 bg-white max-h-[75vh] overflow-auto">
            {loadingSubcategories ? (
              <SubcategorySkeleton />
            ) : (
              subcategories.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleSubcategoryClick(sub.slug)}
                  className={`p-2 cursor-pointer ${
                    currentSubcategory === sub.slug
                      ? "border-r-4 border-purple-600 bg-purple-50"
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
              ))
            )}
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-span-4 bg-gray-100 p-3 h-[75vh] overflow-auto">
            {children}
          </div>

        </div>
      </div>
    </Master>
  );
}