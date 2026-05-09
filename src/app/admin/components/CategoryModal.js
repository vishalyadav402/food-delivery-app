"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabase";

export default function CategoryModal({
  open,
  onClose,
  fetchData,
  editData,
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
const [slug, setSlug] = useState("");

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

 useEffect(() => {
  if (editData) {
    setName(editData.name || "");
    setSlug(editData.slug || ""); // ✅ NEW
    setImage(null);
  } else {
    setName("");
    setSlug("");
    setImage(null);
  }
}, [editData, open]);

  const toBase64 = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result);
      reader.readAsDataURL(file);
    });

  const handleSave = async () => {
    if (!name) {
      alert("Enter category name");
      return;
    }

    try {
      let imageUrl = editData?.image || null;

      if (image) {
        imageUrl = await toBase64(image);
      }

      if (editData) {
        // UPDATE
        const { error } = await supabase
          .from("categories")
          .update({
            name,
            slug,
            image: imageUrl,
          })
          .eq("id", editData.id);
          
console.log("updated:", name, slug)
        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase.from("categories").insert([
          {
            name,
            slug,
            image: imageUrl,
          },
          
        ]);

        if (error) throw error;
      }

      fetchData();
      onClose();
    } catch (err) {
      console.error("Category Save Error:", err);
      alert(err.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80">

        <h2 className="font-bold mb-2">
          {editData ? "Edit Category" : "New Category"}
        </h2>

        {/* NAME */}
        <input
          placeholder="Category Name"
          value={name}
          onChange={(e) => {
            const value = e.target.value;
            setName(value);
            setSlug(generateSlug(value)); // 🔥 auto slug
          }}
          className="border p-2 w-full mb-2"
        />

        {/* SLUG */}
        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        {/* IMAGE */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* PREVIEW */}
        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="w-16 h-16 mt-2 object-cover"
          />
        )}

        {/* BUTTONS */}
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 mt-3 w-full"
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full border"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}