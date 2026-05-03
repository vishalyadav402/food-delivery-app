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
    if (pathname === "/s/" && inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, [pathname]);

  // 🔍 SUPABASE SEARCH
  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,image,price,variants")
        .ilike("name", `%${search}%`)
        .limit(6);

      if (!error) {
        setResults(data || []);
      }
    }, 100);

    return () => clearTimeout(delay);
  }, [search]);

  // 👉 select product
 const handleSelect = (item) => {
  localStorage.setItem("searchQuery", item.name);
  router.push("/s");
  setResults([]);
};

  return (
    <div className="px-4 pb-3 relative">

      {/* INPUT */}
      <div
        // onClick={() => {
        //   if (!isFocused) router.push("/s");
        // }}
        className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200 cursor-text"
      >
        <span className="text-gray-500 mr-2">🔍</span>

        <input
          ref={inputRef}
          value={search}
          onChange={(e) => {
            if (isFocused) setSearch(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
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

      {/* 🔥 DROPDOWN RESULTS */}
      {results.length > 0 && isFocused && (
        <div className="absolute left-4 right-4 mt-1 bg-white shadow-lg rounded-lg z-50 max-h-[300px] overflow-y-auto">

          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={item.image || "/images/icon-vegacart.png"}
                className="w-10 h-10 object-cover rounded"
              />

              <div>
                <p className="text-sm text-black">{item.name}</p>
                <p className="text-xs text-gray-500">₹{item?.variants?.[0]?.price || item.price}</p>
              </div>
            </div>
          ))}

          {/* VIEW ALL */}
          <div
  onClick={() => {
    localStorage.setItem("searchQuery", search);
    router.push("/s");
  }}
  className="p-2 text-center text-green-600 text-sm cursor-pointer border-t"
>
  View all results →
</div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;