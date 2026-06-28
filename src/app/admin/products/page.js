"use client";
import { supabase } from "@/app/utils/supabase";
import Image from "next/image";
import AdminLayout from "../components/AdminLayout";
import { useState, useRef, useEffect, useMemo } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

function ProductRow({ p, profits, handleEdit, handleDelete, fetchAllData, expandedId, setExpandedId }) {
  const expanded = expandedId === p.id;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* MAIN ROW */}
      <div className="flex items-center py-2 px-2 gap-2 bg-white">
        <Image
          src={p.image || "/images/icon-vegacart.png"}
          width={50}
          height={50}
          alt=""
          className="rounded object-cover flex-shrink-0"
        />

        <div className="flex-1 text-sm min-w-0">
          <p className="font-medium truncate">{p.name}</p>
          <p className="font-medium font-mono text-xs">{p.barcode || "—"}</p>
          <div className="flex gap-3 flex-wrap">
            {p.stock != null && (
              <p className={`text-xs ${p.stock <= 5 ? "text-red-500" : "text-gray-400"}`}>
                Stock: {p.stock} {p.stock <= 5 ? "⚠️" : ""}
              </p>
            )}
            {p.expiry_date && (
              <p className="text-xs text-orange-400">Exp: {p.expiry_date}</p>
            )}
            {profits.length > 0 && (
              <p className="text-xs text-purple-600">
                Profit: ₹{profits[0].profit} ({profits[0].margin}%)
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center flex-shrink-0">
          <button
            onClick={() => setExpandedId(expanded ? null : p.id)}
            className="text-xs text-blue-500 border border-blue-300 px-2 py-1 rounded"
          >
            {expanded ? "▲" : "▼"}
          </button>
          <button className="underline text-sm" onClick={() => handleEdit(p)}>Edit</button>
          <button className="underline text-sm text-red-500" onClick={() => handleDelete(p.id)}>Del</button>
          <button
            onClick={async () => {
              await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
              fetchAllData();
            }}
            className={`text-xs px-2 py-1 rounded ${p.is_active ? "bg-purple-500 text-white" : "bg-gray-400 text-white"}`}
          >
            {p.is_active ? "Online" : "Offline"}
          </button>
        </div>
      </div>

      {/* EXPANDED DETAILS */}
      {expanded && (
        <div className="bg-gray-50 border-t px-3 py-3 text-sm space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white rounded p-2 border">
              <p className="text-gray-400">Slug</p>
              <p className="font-medium truncate">{p.slug || "—"}</p>
            </div>
            <div className="bg-white rounded p-2 border">
              <p className="text-gray-400">Status</p>
              <p className={`font-medium ${p.is_active ? "text-purple-600" : "text-gray-400"}`}>
                {p.is_active ? "● Online" : "● Offline"}
              </p>
            </div>
            <div className="bg-white rounded p-2 border">
              <p className="text-gray-400">Stock</p>
              <p className={`font-medium ${p.stock <= 5 ? "text-red-500" : "text-gray-700"}`}>
                {p.stock ?? "—"} {p.stock <= 5 && p.stock != null ? "⚠️ Low" : ""}
              </p>
            </div>
            <div className="bg-white rounded p-2 border">
              <p className="text-gray-400">Expiry</p>
              <p className="font-medium text-orange-500">{p.expiry_date || "—"}</p>
            </div>
          </div>

          {p.variants?.length > 0 ? (
            <div>
              <p className="font-semibold text-gray-700 mb-1">Variants</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border rounded overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-2 border-b">Size</th>
                      <th className="text-right p-2 border-b">CP ₹</th>
                      <th className="text-right p-2 border-b">MRP ₹</th>
                      <th className="text-right p-2 border-b">Price ₹</th>
                      <th className="text-right p-2 border-b">Profit ₹</th>
                      <th className="text-right p-2 border-b">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.variants.map((v, i) => {
                      const profit = v.cp ? v.price - v.cp : null;
                      const margin = profit ? ((profit / v.price) * 100).toFixed(1) : null;
                      return (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-2 font-medium">{v.label}</td>
                          <td className="p-2 text-right text-gray-500">{v.cp ? `₹${v.cp}` : "—"}</td>
                          <td className="p-2 text-right text-gray-400 line-through">{v.mrp ? `₹${v.mrp}` : "—"}</td>
                          <td className="p-2 text-right text-purple-600 font-semibold">₹{v.price}</td>
                          <td className="p-2 text-right text-blue-600 font-semibold">
                            {profit != null ? `₹${profit}` : "—"}
                          </td>
                          <td className="p-2 text-right">
                            {margin != null ? (
                              <span className={`px-1.5 py-0.5 rounded text-white text-[10px] ${
                                Number(margin) >= 20 ? "bg-purple-500"
                                : Number(margin) >= 10 ? "bg-yellow-500"
                                : "bg-red-400"
                              }`}>
                                {margin}%
                              </span>
                            ) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {p.variants.some((v) => v.cp) && (
                    <tfoot className="bg-purple-50">
                      <tr>
                        <td className="p-2 font-semibold" colSpan={4}>Avg Profit</td>
                        <td className="p-2 text-right font-bold text-purple-700">
                          ₹{(p.variants.filter(v => v.cp).reduce((s, v) => s + (v.price - v.cp), 0) / p.variants.filter(v => v.cp).length).toFixed(0)}
                        </td>
                        <td className="p-2 text-right font-bold text-purple-700">
                          {(p.variants.filter(v => v.cp).reduce((s, v) => s + ((v.price - v.cp) / v.price * 100), 0) / p.variants.filter(v => v.cp).length).toFixed(1)}%
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No variants added</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [variant, setVariant] = useState({ label: "", price: "", mrp: "", cp: "" });
  const [showModal, setShowModal] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [search, setSearch] = useState("");
  const [editVariantIndex, setEditVariantIndex] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const barcodeVideoRef = useRef(null);
  const barcodeControlsRef = useRef(null);

const [form, setForm] = useState({
  name: "", slug: "", category_id: "", subcategory_id: "",
  image: "/images/icon-vegacart.png", variants: [],
  is_active: false, stock: "", expiry_date: "",
  barcode: "", // ✅ add this
});

  const [editId, setEditId] = useState(null);

  const fetchAllData = async () => {
    setFetching(true);
    const { data: prod } = await supabase.from("products").select("*");
    const { data: cat } = await supabase.from("categories").select("*");
    const { data: sub } = await supabase.from("subcategories").select("*");
    setProducts(prod || []);
    setCategories(cat || []);
    setSubcategories(sub || []);
    setFetching(false);
  };

  const generateSlug = (text) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  
useEffect(() => {
  if (!showBarcodeScanner) return;

  const codeReader = new BrowserMultiFormatReader(); // ✅ same as POS

  const startScanner = async () => {
    try {
      barcodeControlsRef.current = await codeReader.decodeFromVideoDevice(
        null,
        barcodeVideoRef.current,
        (result, err) => {
          if (result) {
            const scannedCode = result.getText();
            setForm((prev) => ({ ...prev, barcode: scannedCode }));
            barcodeControlsRef.current?.stop();
            barcodeControlsRef.current = null;
            setShowBarcodeScanner(false);
          }
        }
      );
    } catch (err) {
      alert("Camera access denied or not available");
      setShowBarcodeScanner(false);
    }
  };

  startScanner();

  return () => {
    barcodeControlsRef.current?.stop();
    barcodeControlsRef.current = null;
  };
}, [showBarcodeScanner]);

  useEffect(() => { fetchAllData(); }, []);

  // ✅ REMOVED — the debounced refetch-on-search effect that was here is gone.
  // Search is now a pure client-side filter via `filteredProducts` below,
  // with zero network calls on keystroke.

  useEffect(() => {
    const filtered = subcategories.filter((s) => s.category_id === form.category_id);
    setFilteredSubs(filtered);
  }, [form.category_id, subcategories]);

  const calcProfit = (v) => {
    if (!v.cp || !v.price) return null;
    const profit = Number(v.price) - Number(v.cp);
    const margin = ((profit / Number(v.price)) * 100).toFixed(1);
    return { profit, margin };
  };

  const handleAddOrUpdate = async () => {
    if (!form.name) return alert("Enter product name");
    setLoading(true);
    setMessage("");

   const productData = {
  name: form.name, slug: form.slug,
  category_id: form.category_id, subcategory_id: form.subcategory_id,
  image: form.image, variants: form.variants, is_active: form.is_active,
  stock: form.stock ? Number(form.stock) : null,
  expiry_date: form.expiry_date || null,
  barcode: form.barcode || null, // ✅ add this
};

    try {
      let error;
      if (editId) {
        ({ error } = await supabase.from("products").update(productData).eq("id", editId));
        if (!error) setMessage("✅ Product updated successfully");
      } else {
        ({ error } = await supabase.from("products").insert([productData]));
        if (!error) setMessage("✅ Product added successfully");
      }

      if (error) {
        console.error("Supabase error:", JSON.stringify(error));
        setMessage("❌ " + (error.message || "Something went wrong"));
        return;
      }

      fetchAllData();
      resetForm();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "", slug: "", category_id: "", subcategory_id: "",
      image: "/images/icon-vegacart.png", variants: [],
      is_active: false, stock: "", expiry_date: "",
      barcode: ""
    });
    setEditId(null);
    setShowMore(false);
    setEditVariantIndex(null);
    setVariant({ label: "", price: "", mrp: "", cp: "" });
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      slug: product.slug || "",
      category_id: product.category_id || "",
      subcategory_id: product.subcategory_id || "",
      image: product.image,
      variants: product.variants || [],
      is_active: product.is_active ?? false,
      stock: product.stock ?? "",
      expiry_date: product.expiry_date || "",
      barcode: product.barcode || "", // ✅ add this
    });

    const filtered = subcategories.filter(
      (s) => s.category_id === product.category_id
    );
    setFilteredSubs(filtered);

    setEditId(product.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    setDeleteConfirmId(null);
    fetchAllData();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (event) => { img.src = event.target.result; };
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 300;
      const scale = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setForm((prev) => ({ ...prev, image: canvas.toDataURL("image/jpeg", 0.6) }));
    };
    reader.readAsDataURL(file);
  };

  const addVariant = () => {
    if (!variant.label || !variant.price) return;
    const newVariant = {
      label: variant.label,
      price: Number(variant.price),
      mrp: Number(variant.mrp) || Number(variant.price),
      cp: Number(variant.cp) || 0,
    };
    if (editVariantIndex !== null) {
      const updated = [...form.variants];
      updated[editVariantIndex] = newVariant;
      setForm((prev) => ({ ...prev, variants: updated }));
      setEditVariantIndex(null);
    } else {
      setForm((prev) => ({ ...prev, variants: [...prev.variants, newVariant] }));
    }
    setVariant({ label: "", price: "", mrp: "", cp: "" });
  };

  const handleEditVariant = (index) => {
    const v = form.variants[index];
    setVariant({ label: v.label, price: v.price, mrp: v.mrp || "", cp: v.cp || "" });
    setEditVariantIndex(index);
  };

  const resetVariant = () => {
    setVariant({ label: "", price: "", mrp: "", cp: "" });
    setEditVariantIndex(null);
  };

  const removeVariant = (index) => {
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const filteredProducts = useMemo(
    () => products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  return (
    <AdminLayout>
      <div className="md:p-6 mx-auto max-w-lg">
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
        >
          + Add New Product
        </button>

        {/* Sticky Search with Clear Button */}
        <div className="sticky top-0 z-30 bg-gray-100 py-2 -mx-4 px-4 md:-mx-6 md:px-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md p-2 w-full pr-8"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Product List */}
        <div className="mt-4 space-y-2">
          {fetching ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 bg-white border rounded-lg p-3">
                <div className="w-12 h-12 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="w-16 h-7 bg-gray-200 rounded" />
              </div>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No products found</div>
          ) : (
            filteredProducts.map((p) => {
              const profits = (p.variants || [])
                .filter((v) => v.cp)
                .map((v) => ({
                  profit: v.price - v.cp,
                  margin: (((v.price - v.cp) / v.price) * 100).toFixed(1),
                }));

              return (
                <ProductRow
                  key={p.id}
                  p={p}
                  profits={profits}
                  handleEdit={handleEdit}
                  handleDelete={() => setDeleteConfirmId(p.id)}
                  fetchAllData={fetchAllData}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                />
              );
            })
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg p-6 rounded-lg overflow-y-auto max-h-[90vh]">

              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold">{editId ? "Update Product" : "Add Product"}</h2>
                <button onClick={() => setShowModal(false)}>✖</button>
              </div>

              {/* Image */}
              <label htmlFor="Uploadimg" className="cursor-pointer">
                <input id="Uploadimg" type="file" hidden accept="image/*" onChange={handleImageUpload} />
                <div className="relative inline-block">
                  <img src={form.image} className="w-20 h-20 mt-2 rounded object-cover" />
                  <span className="absolute bottom-1 left-1 text-xs underline text-gray-600">edit</span>
                </div>
              </label>

              {/* Name + Slug */}
              <input
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({ ...form, name: value, slug: generateSlug(value) });
                }}
                className="p-2 w-full border mt-2 text-black rounded"
              />

              <input
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="p-2 w-full border mt-2 text-black rounded"
              />
{/* Barcode */}
<div className="flex gap-2 mt-2">
  <input
    placeholder="Barcode (scan or type)"
    value={form.barcode}
    onChange={(e) => setForm({ ...form, barcode: e.target.value })}
    className="p-2 flex-1 border text-black rounded"
  />
  <button
    type="button"
    onClick={() => setShowBarcodeScanner(true)}
    className="px-3 py-2 bg-gray-800 text-white rounded flex items-center gap-1 text-sm"
  >
    📷 Scan
  </button>
</div>
              {/* Category / Subcategory */}
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value, subcategory_id: "" })}
                className="p-2 w-full border mt-2 text-black rounded"
              >
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select
                value={form.subcategory_id}
                onChange={(e) => setForm({ ...form, subcategory_id: e.target.value })}
                className="p-2 w-full border mt-2 text-black rounded"
              >
                <option value="">Select Subcategory</option>
                {filteredSubs.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              {/* Status */}
              <div className="flex items-center justify-between mt-3">
                <label className="font-medium">Product Status</label>
                <button
                  onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
                  className={`px-4 py-1 rounded-full text-white ${form.is_active ? "bg-purple-500" : "bg-gray-400"}`}
                >
                  {form.is_active ? "Online" : "Offline"}
                </button>
              </div>

              {/* MORE OPTIONS */}
              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-4 text-sm text-blue-500 underline"
              >
                {showMore ? "▲ Hide options" : "▼ More options"}
              </button>

              {showMore && (
                <div className="mt-3 border rounded p-3 bg-gray-50 space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="p-2 w-full border mt-1 text-black rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Expiry Date <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="date"
                      value={form.expiry_date}
                      onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                      className="p-2 w-full border mt-1 text-black rounded"
                    />
                  </div>
                </div>
              )}

              {/* Variants */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Variants</h3>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Size (1kg)"
                    value={variant.label}
                    onChange={(e) => setVariant({ ...variant, label: e.target.value })}
                    className="p-2 border text-black rounded"
                  />
                  <input
                    placeholder="Cost Price (CP) ₹"
                    value={variant.cp}
                    onChange={(e) => setVariant({ ...variant, cp: e.target.value })}
                    className="p-2 border text-black rounded"
                  />
                  <input
                    placeholder="MRP ₹"
                    value={variant.mrp}
                    onChange={(e) => setVariant({ ...variant, mrp: e.target.value })}
                    className="p-2 border text-black rounded"
                  />
                  <input
                    placeholder="Selling Price ₹"
                    value={variant.price}
                    onChange={(e) => setVariant({ ...variant, price: e.target.value })}
                    className="p-2 border text-black rounded"
                  />
                </div>

                {/* Live profit preview */}
                {variant.cp && variant.price && (
                  <div className="mt-2 text-sm bg-purple-50 border border-purple-200 rounded p-2">
                    <span className="text-purple-700 font-medium">
                      Profit: ₹{Number(variant.price) - Number(variant.cp)} &nbsp;
                      ({(((Number(variant.price) - Number(variant.cp)) / Number(variant.price)) * 100).toFixed(1)}% margin)
                    </span>
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={addVariant}
                    className="bg-blue-500 text-white rounded px-4 py-2 flex-1"
                  >
                    {editVariantIndex !== null ? "✅ Update Variant" : "+ Add Variant"}
                  </button>
                  {(variant.label || variant.price || editVariantIndex !== null) && (
                    <button
                      onClick={resetVariant}
                      className="bg-gray-300 text-gray-700 rounded px-4 py-2"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {form.variants.map((v, i) => {
                  const p = calcProfit(v);
                  return (
                    <div key={i} className="flex justify-between items-center mt-2 bg-gray-50 p-2 rounded border">
                      <div className="text-sm">
                        <span className="font-medium">{v.label}</span>
                        <span className="ml-2 text-purple-600">₹{v.price}</span>
                        {v.mrp > v.price && <span className="ml-1 line-through text-gray-400 text-xs">₹{v.mrp}</span>}
                        {v.cp > 0 && <span className="ml-1 text-gray-500 text-xs">CP: ₹{v.cp}</span>}
                        {p && (
                          <span className="ml-2 text-xs text-purple-600 font-medium">
                            Profit: ₹{p.profit.toFixed(1)} ({p.margin}%)
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditVariant(i)} className="text-blue-500 text-xs underline">Edit</button>
                        <button onClick={() => removeVariant(i)} className="text-red-400 text-sm">❌</button>
                      </div>
                    </div>
                  );
                })}

                {form.variants.some((v) => v.cp) && (
                  <div className="mt-3 bg-purple-100 rounded p-3 text-sm">
                    <p className="font-semibold text-purple-800">Profit Summary</p>
                    {form.variants.filter((v) => v.cp).map((v, i) => {
                      const p = calcProfit(v);
                      return p ? (
                        <p key={i} className="text-purple-700">
                          {v.label}: ₹{p.profit} profit ({p.margin}% margin)
                        </p>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddOrUpdate}
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white flex-1 ${loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"}`}
                >
                  {loading ? "Saving..." : editId ? "Update" : "Add"}
                </button>
                {editId && (
                  <button onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                )}
              </div>

              {message && (
                <div className="my-2 text-center text-sm font-medium text-purple-600">{message}</div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full shadow-xl">
              <div className="text-center">
                <div className="text-4xl mb-3">🗑️</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Delete Product?</h3>
                <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>







      {/* Barcode Scanner Modal */}
{showBarcodeScanner && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
    <div className="bg-gray-900 rounded-xl p-4 w-[340px] relative">
      <button
        onClick={() => {
          barcodeControlsRef.current?.stop();
          setShowBarcodeScanner(false);
        }}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
      >
        ✖
      </button>
      <h2 className="text-white text-lg font-semibold mb-3 text-center">
        📷 Scan Product Barcode
      </h2>
      <video
        ref={barcodeVideoRef}
        className="w-full rounded-lg border border-gray-600"
        style={{ height: "240px", objectFit: "cover" }}
      />
      <p className="text-xs text-gray-400 text-center mt-2">
        Point camera at barcode — auto-detects
      </p>
      <button
        onClick={() => {
          barcodeControlsRef.current?.stop();
          setShowBarcodeScanner(false);
        }}
        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm"
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </AdminLayout>
  );
}