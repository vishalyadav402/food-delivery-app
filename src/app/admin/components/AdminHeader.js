"use client";
import React from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

const AdminHeader = ({ toggleSidebar }) => {

  const router = useRouter();
  const handleLogout = () => {
  sessionStorage.removeItem("admin_auth");
  router.push("/admin/login");
};



  return (
    <div className="bg-purple-600 text-white px-4 py-3 flex justify-between items-center shadow-md">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar}>
          <Menu size={22} />
        </button>
        <h1 className="font-bold text-lg">Admin Panel</h1>
      </div>

      {/* Right */}
      <div onClick={handleLogout} className="text-sm cursor-pointer">
        👤 Logout
      </div>
    </div>
  );
};

export default AdminHeader;