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
 
  const [form, setForm] = useState({
    name: "",
    category: "",
    image: "/images/icon-vegacart.png",
    variants: [],
    is_active: false, // ✅ default OFFLINE
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
      is_active: form.is_active, // ✅ ADD THIS
    };

    if (editId) {
      await supabase.from("products").update(productData).eq("id", editId);
      console.log(form.variants);
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
    is_active: false, // ✅ IMPORTANT
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
    is_active: product.is_active ?? false, // ✅ FIX
  });
  setEditId(product.id);
  setShowModal(true);
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

      {/* Product List */}
      <div className="mt-6">
        {products.map((p) => (
          <div key={p.id} className="flex justify-between items-center py-2 border-b">
            <div className="flex gap-2">
              <Image
                src={p.image || "/images/icon-vegacart.png"}
                width={60}
                height={60}
                alt=""
              />
            </div>
<div className="text-sm">{p.name}</div>

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

      fetchProducts();
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
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-2 w-full border mt-2 text-black"
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="p-2 w-full border mt-2 text-black"
            >
              <option value="">Select Category</option>

              {/* <!-- Daily / Quick Needs --> */}
              <option value="Daily Essentials">Daily Essentials</option>
              <option value="Fruits & Vegetables">Fruits & Vegetables</option>

              {/* <!-- Grocery --> */}
              <option value="Grocery & Staples">Grocery & Staples</option>
              <option value="Atta & Flour">Atta & Flour</option>
              <option value="Rice & Grains">Rice & Grains</option>
              <option value="Dal & Pulses">Dal & Pulses</option>
              <option value="Oil & Ghee">Oil & Ghee</option>
              <option value="Spices & Masala">Spices & Masala</option>
              <option value="Dry Fruits & Nuts">Dry Fruits & Nuts</option>
              <option value="Salt, Sugar & Jaggery">
                Salt, Sugar & Jaggery
              </option>
              <option value="Sweet & Celebration">Sweet & Celebration</option>
              {/* <!-- Snacks --> */}
              <option value="Snacks">Snacks</option>
              <option value="Biscuits & Cookies">Biscuits & Cookies</option>
              <option value="Chips & Namkeen">Chips & Namkeen</option>
              <option value="Chocolates & Sweets">Chocolates & Sweets</option>

              {/* <!-- Beverages --> */}
              <option value="Water">Water</option>
              <option value="Cold Drinks">Cold Drinks</option>
              <option value="Beverages">Beverages</option>
              <option value="Tea & Coffee">Tea & Coffee</option>
              <option value="Juices">Juices</option>
              <option value="Energy Drinks">Energy Drinks</option>

              {/* <!-- Dairy --> */}
              <option value="Dairy">Dairy</option>
              <option value="Milk">Milk</option>
              <option value="Curd & Paneer">Curd & Paneer</option>
              <option value="Butter & Cheese">Butter & Cheese</option>
              <option value="Bread & Eggs">Bread & Eggs</option>

              {/* <!-- Ready Food --> */}
              <option value="Instant Food">Instant Food</option>
              <option value="Ready-to-Eat">Ready-to-Eat</option>
              <option value="Ready-to-Cook">Ready-to-Cook</option>
              <option value="Frozen Food">Frozen Food</option>

              {/* <!-- Personal Care --> */}
              <option value="Personal Care">Personal Care</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Skin Care">Skin Care</option>
              <option value="Oral Care">Oral Care</option>
              <option value="Men Grooming">Men Grooming</option>
              <option value="Feminine Hygiene">Feminine Hygiene</option>

              {/* <!-- Household --> */}
              <option value="Household">Household</option>
              <option value="Cleaning Supplies">Cleaning Supplies</option>
              <option value="Dishwash & Laundry">Dishwash & Laundry</option>
              <option value="Kitchen Utilities">Kitchen Utilities</option>

              {/* <!-- Baby Care --> */}
              <option value="Baby Care">Baby Care</option>
              <option value="Diapers & Wipes">Diapers & Wipes</option>
              <option value="Baby Food">Baby Food</option>

              {/* <!-- Health --> */}
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Medicines">Medicines</option>
              <option value="First Aid">First Aid</option>

              {/* <!-- Others --> */}
              <option value="Stationery">Stationery</option>
              <option value="Pooja Items">Pooja Items</option>
              <option value="Pet Care">Pet Care</option>
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
                onClick={() => {
                  handleAddOrUpdate();
                  setShowModal(false);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {editId ? "Update" : "Add"}
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
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
    </>
  );
}