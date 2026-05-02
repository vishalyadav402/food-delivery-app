"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase";
import CategoryModal from "../components/CategoryModal";
import SubCategoryModal from "../components/SubCategoryModal";
import AdminLayout from "../components/AdminLayout";

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [catModal, setCatModal] = useState(false);
  const [subModal, setSubModal] = useState(false);

  const [editCat, setEditCat] = useState(null);
  const [editSub, setEditSub] = useState(null);

  const fetchData = async () => {
    try {
      const { data: cat } = await supabase.from("categories").select("*");
      const { data: sub } = await supabase.from("subcategories").select("*");

      setCategories(cat || []);
      setSubcategories(sub || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setCategories([]);
      setSubcategories([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCategory = async (id) => {
    await supabase.from("categories").delete().eq("id", id);
    fetchData();
  };

  const deleteSub = async (id) => {
    await supabase.from("subcategories").delete().eq("id", id);
    fetchData();
  };

  const [openRows, setOpenRows] = useState({});

const toggleRow = (id) => {
  setOpenRows((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};


  return (
    <AdminLayout>
    <div className="md:p-6 mx-auto max-w-lg">

      {/* BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => {
            setEditCat(null);
            setCatModal(true);
          }}
          className="bg-green-500 text-white px-4 py-2"
        >
          New Category
        </button>

        <button
          onClick={() => {
            setEditSub(null);
            setSubModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2"
        >
          New Subcategory
        </button>
      </div>

    <table className="w-full border">
  <thead>
    <tr className="bg-gray-200 text-left">
      <th></th>
      <th>Name</th>
      <th>Image</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {(categories || []).map((cat) => {
      const subs = (subcategories || []).filter(
        (s) => s.category_id === cat.id
      );

      return (
       <React.Fragment key={cat.id}>
          {/* CATEGORY ROW */}
          <tr key={cat.id} className="border bg-gray-50">
            <td className="text-center">
              <button onClick={() => toggleRow(cat.id)}>
                {openRows[cat.id] ? "▼" : "▶"}
              </button>
            </td>

            <td className="font-semibold">{cat.name} ({subs.length})</td>

            <td>
              <img
                src={cat.image || "https://via.placeholder.com/40"}
                className="w-10 h-10"
              />
            </td>

            <td>
              <button
                onClick={() => {
                  setEditCat(cat);
                  setCatModal(true);
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteCategory(cat.id)}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            </td>
          </tr>

          {/* SUBCATEGORY ROWS */}
          {openRows[cat.id] &&
            subs.map((s) => (
              <tr key={s.id} className="border bg-white">
                <td></td>

                <td className="pl-6">↳ {s.name}</td>

                <td>
                  <img
                    src={s.image || "https://via.placeholder.com/40"}
                    className="w-8 h-8"
                  />
                </td>

                <td>
                  <button
                    onClick={() => {
                      setEditSub(s);
                      setSubModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteSub(s.id)}
                    className="text-red-500 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </React.Fragment>
      );
    })}
  </tbody>
</table>

      {/* MODALS */}
      <CategoryModal
        open={catModal}
        onClose={() => setCatModal(false)}
        fetchData={fetchData}
        editData={editCat}
      />

      <SubCategoryModal
        open={subModal}
        onClose={() => setSubModal(false)}
        categories={categories || []}
        fetchData={fetchData}
        editData={editSub}
      />
    </div>
    </AdminLayout>
  );
}