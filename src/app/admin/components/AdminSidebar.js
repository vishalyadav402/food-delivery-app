"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Gauge, ListPlus } from "lucide-react";

const AdminSidebar = ({ open, setOpen }) => {
  const router = useRouter();

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 font-bold text-lg border-b">
        Kirana Admin
      </div>

      {/* Links */}
      <div className="flex flex-col p-4 gap-3">
         <button onClick={() => router.push("/admin/")} className="text-left flex gap-4">
          <Gauge /> Dashboard
        </button>
        <button onClick={() => router.push("/admin/products")} className="text-left flex gap-4">
          <ListPlus /> Products
        </button>

        <button onClick={() => router.push("/admin/orders")} className="text-left flex gap-4">
          <ArrowUpDown /> Orders
        </button>

        <button onClick={() => router.push("/admin/categories")} className="text-left flex gap-4">
          <ArrowUpDown /> Categories
        </button>
      </div>

      {/* Close */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-3 right-3"
      >
        ✖
      </button>
    </div>
  );
};

export default AdminSidebar;