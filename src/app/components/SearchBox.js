"use client"
import { useEffect, useState } from "react";

const placeholders = [
  "Search facewash",
  "Search tea",
  "Search dettol",
  "Search biscuits",
  "Search shampoo",
];

export default function SearchBox({ search, setSearch }) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % placeholders.length);
        setAnimate(true);
      }, 200);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mb-3">

      {/* 🔍 ICON */}
      <span className="absolute left-3 top-2.5 text-gray-400">
        🔍
      </span>

      {/* INPUT */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 bg-gray-50 text-black rounded-md pl-10 pr-8 py-2"
      />

      {/* ANIMATED PLACEHOLDER */}
      {!search && (
        <span
          className={`absolute left-10 text-gray-400 pointer-events-none transition-all duration-300 ${
            animate
              ? "top-2 opacity-100"
              : "top-6 opacity-0"
          }`}
        >
          {placeholders[index]}
        </span>
      )}

      {/* ❌ CLEAR */}
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-2 text-gray-500"
        >
          ✕
        </button>
      )}
    </div>
  );
}