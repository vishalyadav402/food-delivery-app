"use client";
import React from "react";
import { Menu } from "lucide-react";

const AdminHeader = ({ toggleSidebar }) => {
  return (
    <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center shadow-md">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar}>
          <Menu size={22} />
        </button>
        <h1 className="font-bold text-lg">Admin Panel</h1>
      </div>

      {/* Right */}
      <div className="text-sm">
        👤 Admin
      </div>
    </div>
  );
};

export default AdminHeader;