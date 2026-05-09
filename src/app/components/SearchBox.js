"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/app/utils/supabase";

const placeholderTexts = [
  'Search "diaper"',
  'Search "facewash"',
  'Search "powder"',
  'Search "oil"',
  'Search "cream"',
];

const SearchBox = ({ search, setSearch }) => {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef(null);

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState([]);

const [suggestions, setSuggestions] = useState([]);
const [categories, setCategories] = useState([]);

  // 🔁 Placeholder animation
  useEffect(() => {
    if (search) return;

    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [search]);

  // 🔥 Auto focus
  useEffect(() => {
    if (pathname === "/s" && inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, [pathname]);

  // 🔍 SUPABASE SEARCH
 useEffect(() => {
  if (!search || search.length < 2) {
    setResults([]);
    setSuggestions([]);
    setCategories([]);
    return;
  }

  const delay = setTimeout(async () => {
    // 🔥 PRODUCTS
    const { data } = await supabase
      .from("products")
      .select("id,name,slug,image,variants")
      .ilike("name", `%${search}%`)
      .limit(6);

    setResults(data || []);

    // 🔥 CATEGORY MATCH
    const { data: catData } = await supabase
      .from("categories")
      .select("id,name,slug,image")
      .ilike("name", `%${search}%`)
      .limit(5);

    setCategories(catData || []);

    // 🔥 SUGGESTIONS (FROM PRODUCT NAMES)
    const uniqueSuggestions = [...new Set(data?.map((p) => p.name))];
    setSuggestions(uniqueSuggestions.slice(0, 6));

  }, 300);

  return () => clearTimeout(delay);
}, [search]);

  // 👉 select product
  const handleSelect = (item) => {
    router.push(`/s?q=${item.name}`);
    setResults([]);
  };

  return (
    <div className="relative w-full">

      {/* INPUT */}
      <div
        onClick={() => {
          if (!isFocused) router.push("/s");
        }}
        className="flex items-center w-full bg-white rounded-lg px-3 py-2 border border-gray-200 cursor-text"
      >
        <span className="text-gray-500 mr-2">🔍</span>

        <input
          ref={inputRef}
          value={search}
          onChange={(e) => {
            if (isFocused) setSearch(e.target.value);
          }}
          onFocus={() => {
            if (pathname !== "/s") {
              sessionStorage.setItem("focusSearch", "true"); // 🔥 remember focus
              router.push("/s");
            } else {
              setIsFocused(true);
            }
          }}
          placeholder={placeholderTexts[currentPlaceholder]}
          className="w-full bg-transparent outline-none text-sm text-black"
        />

        {/* CLEAR */}
        {search && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearch("");
              setResults([]);
            }}
            className="text-gray-500 ml-2"
          >
            ✕
          </button>
        )}
      </div>

      {(suggestions.length > 0 || categories.length > 0) && isFocused && (
  <div className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-lg z-50 p-2">

    {/* 🔥 SUGGESTIONS */}
    {suggestions.length > 0 && (
      <>
        <p className="text-xs text-gray-400 mb-1">Suggestions</p>
        {suggestions.map((s, i) => (
          <div
            key={i}
            onClick={() => {
              setSuggestions([]); // 🔥 hide suggestions
              router.push(`/s?q=${encodeURIComponent(s)}`);
            }}
            className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
          >
            🔍 {s}
          </div>
        ))}
      </>
    )}

    {/* 🔥 CATEGORIES */}
    {categories.length > 0 && (
      <>
        <p className="text-xs text-gray-400 mt-2 mb-1">Categories</p>
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => router.push(`/${encodeURIComponent(cat.slug)}`)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
          >
            <img
              src={cat.image || "/images/icon-vegacart.png"}
              className="w-8 h-8 rounded"
            />
            <span className="text-sm">{cat.name}</span>
          </div>
        ))}
      </>
    )}

  </div>
)}
    </div>
  );
};

export default SearchBox;