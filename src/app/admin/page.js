"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [variant, setVariant] = useState({ label: "", price: "" });
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "/images/icon-vegacart.png",
  });

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("products");
    if (data) setProducts(JSON.parse(data));
  }, []);

  const saveProducts = (data) => {
    setProducts(data);
    localStorage.setItem("products", JSON.stringify(data));
  };

  const handleAddOrUpdate = () => {
  if (!form.name || !form.price) return alert("Fill all fields");

  const productData = {
    ...form,
    price: Number(form.price),
    category: form.category || "General",
    image: form.image || "/images/icon-vegacart.png",
  };

  if (editIndex !== null) {
    const updated = [...products];
    updated[editIndex] = productData;
    saveProducts(updated);
    setEditIndex(null);
  } else {
    const newProducts = [...products, productData];
    saveProducts(newProducts);
  }

  resetForm();
};
const resetForm = () => {
  setForm({
    name: "",
    price: "",
    category: "",
    image: "/images/icon-vegacart.png",
  });
};

 const handleEdit = (index) => {
  const product = products[index];

  setForm({
    name: product.name || "",
    price: product.price || "",
    category: product.category || "",
    image: product.image || "/images/icon-vegacart.png",
  });

  setEditIndex(index);
};

  // ✅ Delete
  const handleDelete = (index) => {
    const updated = products.filter((_, i) => i !== index);
    saveProducts(updated);
  };

  // ✅ Cancel edit
  const handleCancel = () => {
    setEditIndex(null);
    setForm({
      name: "",
      price: "",
      category: "",
      image: "/images/icon-vegacart.png",
    });
  };

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

    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);

    setForm((prev) => ({
      ...prev,
      image: compressedBase64,
    }));
  };

  reader.readAsDataURL(file);
};

  return (
    <div className="p-6 mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Form */}
      <div className="space-y-2 mb-6">
        <p className="text-xs text-gray-500">
        {editIndex !== null ? "Upload to replace image" : "Upload product image"}
        </p>
        <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            className="p-2 w-full border"
            />

            {/* Preview */}
            {form.image && (
            <img
                src={form.image}
                alt="preview"
                className="w-24 h-24 object-cover rounded border mt-2"
            />
            )}
            <button
            onClick={() =>
                setForm((prev) => ({
                ...prev,
                image: "/images/icon-vegacart.png",
                }))
            }
            className="text-sm text-red-500"
            >
            Remove Image
            </button>
            
        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 w-full border"
        />

        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="p-2 w-full border"
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="p-2 w-full border"
        />

        <div className="flex gap-2">
          <button
            onClick={handleAddOrUpdate}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {editIndex !== null ? "Update Product" : "Add Product"}
          </button>

          {editIndex !== null && (
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {products.map((p, i) => (
        <div key={i} className="flex justify-between items-center border-b py-2">
            <div className="h-10 w-10">
                <Image
            src={p.image || "/images/icon-vegacart.png"}
            alt={p.name}
            width={50}
            height={50}
            className="object-cover w-full h-full"
            />
            
            </div>
          <span>
            {p.name} - ₹{p.price}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(i)}
              className="text-blue-500"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(i)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}