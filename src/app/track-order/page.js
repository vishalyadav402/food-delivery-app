"use client";
import { useState } from "react";
import { supabase } from "../utils/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch orders
  const handleSearch = async () => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    setLoading(true);

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
    <>
    <Header/>
    <div className="max-w-2xl min-h-[79vh] mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mt-15 mb-4">
        Track Your Order
      </h1>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Enter your phone number"
          className="w-full p-2 border"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* Orders */}
      {orders.length === 0 && !loading && (
        <p className="text-gray-500">
          No orders found
        </p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border p-4 rounded shadow"
          >
            <p>
              <strong>Order ID:</strong> {order.order_id}
            </p>

            {/* Status */}
            <p className="mt-1">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white text-sm ${
                  order.status === "pending"
                    ? "bg-yellow-500"
                    : order.status === "accepted"
                    ? "bg-blue-500"
                    : order.status === "delivered"
                    ? "bg-green-600"
                    : "bg-red-500"
                }`}
              >
                {order.status}
              </span>
            </p>

            {/* Items */}
            <div className="mt-2 text-sm">
              <strong>Items:</strong>
              {order.items.map((item, i) => (
                <div key={i}>
                  {item.name} ({item.variant}) x {item.qty}
                </div>
              ))}
            </div>

            <p className="mt-2 font-bold">
              Total: ₹{order.total}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
}