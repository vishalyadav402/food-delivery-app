"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

export default function CategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [icon, setIcon] = useState(null);
  const [banner, setBanner] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📥 Fetch
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("position", { ascending: true });

    if (error) console.error(error);
    else setCategories(data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📤 Upload helper (FIXED)
  const uploadImage = async (file, bucket) => {
    if (!file) return null;

    const fileName = `${bucket}-${Date.now()}-${Math.random()}.jpg`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      alert("Image upload failed");
      return null;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ➕ Add / Update
  const handleSave = async () => {
    if (!form.name) return alert("Enter name");

    setLoading(true);

    const iconUrl = icon
      ? await uploadImage(icon, "category-images")
      : null;

    const bannerUrl = banner
      ? await uploadImage(banner, "category-banners")
      : null;

    if (editId) {
      const { error } = await supabase
        .from("categories")
        .update({
          name: form.name,
          ...(iconUrl && { image: iconUrl }),
          ...(bannerUrl && { banner: bannerUrl }),
        })
        .eq("id", editId);

      if (error) console.error(error);
    } else {
      const { error } = await supabase.from("categories").insert([
        {
          name: form.name,
          image: iconUrl,
          banner: bannerUrl,
          position: categories.length,
        },
      ]);

      if (error) console.error(error);
    }

    // reset
    setForm({ name: "" });
    setIcon(null);
    setBanner(null);
    setEditId(null);
    setLoading(false);

    fetchData();
  };

  // ✏ Edit
  const handleEdit = (cat) => {
    setForm({ name: cat.name });
    setEditId(cat.id);
  };

  // 🗑 Delete
  const handleDelete = async (id) => {
    await supabase.from("categories").delete().eq("id", id);
    fetchData();
  };

  // 🔀 Reorder
  const move = async (i, dir) => {
    const list = [...categories];
    const target = i + dir;

    if (target < 0 || target >= list.length) return;

    [list[i], list[target]] = [list[target], list[i]];
    setCategories(list);

    for (let idx = 0; idx < list.length; idx++) {
      await supabase
        .from("categories")
        .update({ position: idx })
        .eq("id", list[idx].id);
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      {/* Form */}
      <input
        placeholder="Category Name"
        value={form.name}
        onChange={(e) => setForm({ name: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      <label>Icon</label>
      <input type="file" onChange={(e) => setIcon(e.target.files[0])} />

      <label className="mt-2 block">Banner</label>
      <input type="file" onChange={(e) => setBanner(e.target.files[0])} />

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 mt-3 rounded w-full"
      >
        {loading ? "Saving..." : editId ? "Update" : "Add"} Category
      </button>

      {/* List */}
      <div className="mt-6 space-y-3">
        {categories.map((cat, i) => (
          <div
            key={cat.id || i}
            className="border p-3 flex justify-between items-center"
          >
            <div>
              <p>{cat.name}</p>

              {/* FIXED IMAGE DISPLAY */}
              <img
                src={
                  cat.image ||
                  "https://via.placeholder.com/40"
                }
                className="w-10 h-10 object-cover rounded mt-1"
              />
            </div>

            <div className="flex gap-2 text-sm">
              <button onClick={() => move(i, -1)}>⬆</button>
              <button onClick={() => move(i, 1)}>⬇</button>
              <button onClick={() => handleEdit(cat)}>Edit</button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}