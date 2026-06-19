"use client";
import { useState } from "react";
import { supabase } from "../utils/supabase";
import Master from "../components/Master";
import { Search, Package, Clock } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-blue-50 text-blue-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Error fetching orders");
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  };

  return (
    <Master>
      <div className="max-w-2xl min-h-[79vh] mx-auto mt-28 p-4 pb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Track your order
        </h1>

        {/* SEARCH CARD */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
          <p className="text-[13px] font-medium text-gray-500 mb-2">
            Enter the phone number used while ordering
          </p>
          <div className="flex gap-2">
            <input
              placeholder="Phone number"
              className="flex-1 text-sm text-gray-700 px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
              value={phone}
              type="tel"
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-800 text-white px-5 rounded-lg text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Search size={15} />
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* EMPTY STATE */}
        {searched && orders.length === 0 && !loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Package size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No orders found for this number</p>
          </div>
        )}

        {/* ORDERS LIST */}
        <div className="space-y-3">
          {orders.map((order) => {
            const statusClass = STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600";
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* HEADER: order id + status */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{order.order_id}</p>
                    <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                      <Clock size={11} />
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md capitalize ${statusClass}`}>
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="px-4 py-3 border-b border-gray-100 space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-[13px] text-gray-600">
                      {item.name}
                      {item.variant && item.variant !== "Default" ? ` (${item.variant})` : ""} × {item.qty}
                    </p>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between items-center px-4 py-2.5">
                  <span className="text-[12px] text-gray-400">Total</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Master>
  );
}
