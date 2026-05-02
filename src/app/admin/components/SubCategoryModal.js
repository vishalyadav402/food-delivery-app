"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabase";

export default function SubCategoryModal({
  open,
  onClose,
  categories = [],
  fetchData,
  editData,
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setCategoryId(editData.category_id || "");
      setImage(null);
    } else {
      setName("");
      setCategoryId("");
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
    if (!name || !categoryId) {
      alert("Fill all fields");
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
          .from("subcategories")
          .update({
            name,
            category_id: categoryId,
            image: imageUrl,
          })
          .eq("id", editData.id);

        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase.from("subcategories").insert([
          {
            name,
            category_id: categoryId,
            image: imageUrl,
          },
        ]);

        if (error) throw error;
      }

      fetchData();
      onClose();
    } catch (err) {
      console.error("Save Error:", err);
      alert(err.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80">

        <h2 className="font-bold mb-2">
          {editData ? "Edit Subcategory" : "New Subcategory"}
        </h2>

        {/* NAME */}
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        {/* CATEGORY SELECT */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="">Select Category</option>

          {(categories || []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

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
          className="bg-blue-500 text-white px-4 py-2 mt-3 w-full"
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