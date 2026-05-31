"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useRouter } from "next/navigation";



export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (!auth) router.replace("/admin/login"); // 👈 redirect if not logged in
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">

      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <AdminHeader toggleSidebar={() => setSidebarOpen(true)} />

        {/* Page Content (IMPORTANT) */}
        <div className="p-4 md:p-6">
          {children} {/* ✅ THIS IS HOW CHILDREN WORK */}
        </div>
      </div>
    </div>
  );
}