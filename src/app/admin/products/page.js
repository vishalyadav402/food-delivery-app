"use client";
import { supabase } from "@/app/utils/supabase";
import Image from "next/image";
import { useState, useEffect } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminLayout from "../components/AdminLayout";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [variant, setVariant] = useState({ label: "", price: "", mrp: "" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
  name: "",
  slug: "", // ✅ NEW
  category_id: "",
  subcategory_id: "",
  image: "/images/icon-vegacart.png",
  variants: [],
  is_active: false,
});

  const [editId, setEditId] = useState(null);

  const fetchAllData = async () => {
  const { data: prod } = await supabase.from("products").select("*");
  const { data: cat } = await supabase.from("categories").select("*");
  const { data: sub } = await supabase.from("subcategories").select("*");

  setProducts(prod || []);
  setCategories(cat || []);
  setSubcategories(sub || []);
};

const generateSlug = (text) =>
     text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

useEffect(() => {
  fetchAllData();
}, []);

useEffect(() => {
  const delay = setTimeout(() => {
    fetchAllData(search);
  }, 400);

  return () => clearTimeout(delay);
}, [search]);


useEffect(() => {
  const filtered = subcategories.filter(
    (s) => s.category_id === form.category_id
  );
  setFilteredSubs(filtered);
}, [form.category_id, subcategories]);

const handleAddOrUpdate = async () => {
  if (!form.name) return alert("Enter product name");

  setLoading(true);
  setMessage("");

  const productData = {
  name: form.name,
  slug: form.slug, // ✅ ADD THIS
  category_id: form.category_id,
  subcategory_id: form.subcategory_id,
  image: form.image,
  variants: form.variants,
  is_active: form.is_active,
};

  try {
    let error;

    if (editId) {
      ({ error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editId));

      if (!error) {
        setMessage("✅ Product updated successfully");
      }
    } else {
      ({ error } = await supabase
        .from("products")
        .insert([productData]));

      if (!error) {
        setMessage("✅ Product added successfully");
      }
    }

    if (error) {
      console.error(error);
      setMessage("❌ Something went wrong");
      return;
    }

    fetchAllData();
    resetForm();

    // auto clear message
    setTimeout(() => setMessage(""), 2000);

  } catch (err) {
    console.error(err);
    setMessage("❌ Server error");
  } finally {
    setLoading(false);
  }
};

  // ✅ Reset Form
 const resetForm = () => {
  setForm({
  name: "",
  slug: "", // ✅ ADD
  category_id: "",
  subcategory_id: "",
  image: "/images/icon-vegacart.png",
  variants: [],
  is_active: false,
});
  setEditId(null);
};


  // ✅ Edit
const handleEdit = (product) => {
  setForm({
  name: product.name,
  slug: product.slug || "", // ✅ ADD
  category_id: product.category_id || "",
  subcategory_id: product.subcategory_id || "",
  image: product.image,
  variants: product.variants || [],
  is_active: product.is_active ?? false,
});

  setEditId(product.id);
  setShowModal(true);
};


  // ✅ Delete
  const handleDelete = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    fetchAllData();
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

  const addVariant = () => {
  if (!variant.label || !variant.price) return;

  setForm((prev) => ({
    ...prev,
    variants: [
      ...prev.variants,
      {
        label: variant.label,
        price: Number(variant.price),
        mrp: Number(variant.mrp) || Number(variant.price), // ✅ FIX
      },
    ],
  }));

  setVariant({ label: "", price: "", mrp: "" }); // reset
};

  // ✅ Remove Variant
  const removeVariant = (index) => {
    const updated = form.variants.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, variants: updated }));
  };

  return (
    <>
    <AdminLayout>
    <div className="md:p-6 mx-auto max-w-md">
      
      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        + Add New Product
      </button>

<input
  type="text"
  placeholder="Search product..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border p-2 w-full mb-3"
/>

      {/* Product List */}
      <div className="mt-6">
        {(products || [])
  .filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )
  .map((p) => (
          <div key={p.id} className="flex justify-between items-center py-2 border-b">
            <div className="flex gap-2">
              <Image
                src={p.image || "/images/icon-vegacart.png"}
                width={60}
                height={60}
                alt=""
              />
            </div>
              <div className="text-sm">
                {p.name}
              </div>

              <div className="flex gap-2">
  <button className="underline" onClick={() => handleEdit(p)}>Edit</button>
  <button className="underline" onClick={() => handleDelete(p.id)}>Delete</button>

  {/* ✅ ONLINE/OFFLINE TOGGLE */}
  <div>
  <button
    onClick={async () => {
      await supabase
        .from("products")
        .update({ is_active: !p.is_active })
        .eq("id", p.id);

      fetchAllData();
    }}
    className={`text-xs px-2 py-1 rounded ${
      p.is_active ? "bg-green-500 text-white" : "bg-gray-400 text-white"
    }`}
  >
    {p.is_active ? "Online" : "Offline"}
  </button>
  </div>
</div>
            </div>
        ))}
      </div>


{/* product add/update popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-0">
              <h2 className="text-xl font-bold">
                {editId ? "Update Product" : "Add Product"}
              </h2>
              <button onClick={() => setShowModal(false)}>✖</button>
            </div>

            {/* Image Upload */}
            <div>
            <label htmlFor="Uploadimg" className="cursor-pointer p-2">
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
            </div>
            {/* Product Fields */}
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => {
                const value = e.target.value;
                setForm({
                  ...form,
                  name: value,
                  slug: generateSlug(value), // ✅ auto slug
                });
              }}
              className="p-2 w-full border mt-2 text-black"
            />

<input
  placeholder="Slug"
  value={form.slug}
  onChange={(e) =>
    setForm({ ...form, slug: e.target.value })
  }
  className="p-2 w-full border mt-2 text-black"
/>

            <select
  value={form.category_id}
  onChange={(e) =>
    setForm({ ...form, category_id: e.target.value, subcategory_id: "" })
  }
  className="p-2 w-full border mt-2 text-black"
>
  <option value="">Select Category</option>
  {(categories || []).map((c) => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ))}
            </select>

            <select
              value={form.subcategory_id}
              onChange={(e) =>
                setForm({ ...form, subcategory_id: e.target.value })
              }
              className="p-2 w-full border mt-2 text-black"
            >
              <option value="">Select Subcategory</option>
              {(filteredSubs || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

        <div className="flex items-center justify-between mt-3">
        <label className="font-medium">Product Status</label>

        <button
            onClick={() =>
            setForm((prev) => ({
                ...prev,
                is_active: !prev.is_active,
            }))
            }
            className={`px-4 py-1 rounded-full text-white ${
            form.is_active ? "bg-green-500" : "bg-gray-400"
            }`}
        >
            {form.is_active ? "Online" : "Offline"}
        </button>
        </div>

            {/* Variants */}
            <div className="mt-4">
              <h3 className="font-semibold">Variants</h3>

              <div className="flex gap-2">
                <input
                  placeholder="Size (1kg)"
                  value={variant.label || ""}
                  onChange={(e) =>
                    setVariant({ ...variant, label: e.target.value })
                  }
                  className="p-2 border w-full text-black"
                />
                <input
                  placeholder="MRP (₹)"
                  value={variant.mrp || ""}
                  onChange={(e) =>
                    setVariant({ ...variant, mrp: e.target.value })
                  }
                  className="p-2 border w-full text-black"
                />
                <input
                  placeholder="Price"
                  value={variant.price || ""}
                  onChange={(e) =>
                    setVariant({ ...variant, price: e.target.value })
                  }
                  className="p-2 border w-full text-black"
                />

                <button
                  onClick={addVariant}
                  className="bg-blue-500 text-white rounded-md px-2"
                >
                  Add
                </button>
              </div>

              {form.variants.map((v, i) => (
                <div key={i} className="flex justify-between mt-2">
                  <span>
                    {v.label} - ₹{v.price}
                    {v.mrp && (
                      <span className="line-through text-gray-400 text-xs ml-2">
                        ₹{v.mrp}
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => removeVariant(i)}
                    className="text-red-400"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddOrUpdate}
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                    loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                }`}
                >
                {loading ? "Saving..." : editId ? "Update" : "Add"}
                </button>

              {editId && (
                <button
                  onClick={resetForm}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>

            {message && (
            <div className="my-2 text-center text-sm font-medium text-green-600">
                {message}
            </div>
            )}
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
    </>
  );
}