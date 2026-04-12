"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [variant, setVariant] = useState({ label: "", price: "" });

  const [form, setForm] = useState({
    name: "",
    category: "",
    image: "/images/icon-vegacart.png",
    variants: [],
  });

  const [editId, setEditId] = useState(null);

  // ✅ Fetch Products
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) console.error(error);
    else setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Add / Update Product
  const handleAddOrUpdate = async () => {
    if (!form.name) return alert("Enter product name");

    const productData = {
      name: form.name,
      category: form.category,
      image: form.image,
      variants: form.variants,
    };

    if (editId) {
      await supabase.from("products").update(productData).eq("id", editId);
    } else {
      await supabase.from("products").insert([productData]);
    }

    fetchProducts();
    resetForm();
  };

  // ✅ Reset Form
  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      image: "/images/icon-vegacart.png",
      variants: [],
    });
    setEditId(null);
  };

  // ✅ Edit
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      image: product.image,
      variants: product.variants || [],
    });
    setEditId(product.id);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  // ✅ Image Upload + Compression
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new window.Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const maxWidth = 300;
      const scale = Math.min(maxWidth / img.width, 1);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressed = canvas.toDataURL("image/jpeg", 0.6);

      setForm((prev) => ({
        ...prev,
        image: compressed,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ✅ Add Variant
  const addVariant = () => {
    if (!variant.label || !variant.price) return;

    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { label: variant.label, price: Number(variant.price) },
      ],
    }));

    setVariant({ label: "", price: "" });
  };

  // ✅ Remove Variant
  const removeVariant = (index) => {
    const updated = form.variants.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, variants: updated }));
  };

  return (
    <div className="p-6 mx-auto max-w-md bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Image Upload */}
      <label htmlFor="Uploadimg" className="cursor-pointer">
  <p>Upload a product image</p>

  <input
    id="Uploadimg"
    type="file"
    hidden
    accept="image/*"
    onChange={handleImageUpload}
  />

  <div className="relative">
    <span className="absolute bottom-2 left-7 underline text-gray-600">
      edit
    </span>

    {form.image && (
      <img src={form.image} className="w-20 h-20 mt-2 rounded" />
    )}
  </div>
</label>
      {/* Product Fields */}
      <input
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="p-2 w-full border mt-2 text-black"
      />

      <select
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  className="p-2 w-full border mt-2 text-black"
>
  <option value="">Select Category</option>
  <option value="Grocery">Grocery</option>
  <option value="Snacks">Snacks</option>
  <option value="Cold Drinks">Cold Drinks</option>
  <option value="Dairy">Dairy</option>
  <option value="Personal Care">Personal Care</option>
  <option value="Household">Household</option>
  <option value="Stationery">Stationery</option>
</select>

      {/* Variants */}
      <div className="mt-4">
        <h3 className="font-semibold">Variants</h3>

        <div className="flex gap-2">
          <input
            placeholder="Size (1kg)"
            value={variant.label}
            onChange={(e) =>
              setVariant({ ...variant, label: e.target.value })
            }
            className="p-2 border w-full text-black"
          />

          <input
            placeholder="Price"
            value={variant.price}
            onChange={(e) =>
              setVariant({ ...variant, price: e.target.value })
            }
            className="p-2 border w-full text-black"
          />

          <button onClick={addVariant} className="bg-blue-500 px-2">
            Add
          </button>
        </div>

        {form.variants.map((v, i) => (
          <div key={i} className="flex justify-between mt-2">
            <span>
              {v.label} - ₹{v.price}
            </span>
            <button onClick={() => removeVariant(i)} className="text-red-400">
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleAddOrUpdate}
          className="bg-green-500 px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button
            onClick={resetForm}
            className="bg-gray-500 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="mt-6">
        {products.map((p) => (
          <div key={p.id} className="flex justify-between py-2 border-b">
            <div className="flex gap-2">
              <Image
                src={p.image || "/images/icon-vegacart.png"}
                width={40}
                height={40}
                alt=""
              />
              <div>
                <p>{p.name}</p>
                <p className="text-xs text-gray-400">
                  {p.variants?.map((v) => v.label).join(", ")}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}