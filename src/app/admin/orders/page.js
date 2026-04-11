"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setOrders(data || []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Update status
  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error updating status");
    } else {
      fetchOrders(); // refresh
    }
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {orders.map((order) => (
    <div
      key={order.id}
      className="border p-4 rounded shadow bg-white"
    >
      <p className="text-sm"><strong>ID:</strong> {order.order_id}</p>
      <p className="text-sm"><strong>Name:</strong> {order.name}</p>
      <p className="text-sm"><strong>Phone:</strong> {order.phone}</p>

      <p className="text-sm mt-1">
        <strong>Status:</strong>{" "}
        <span
          className={`px-2 py-1 rounded text-white text-xs ${
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
      <div className="mt-2 text-xs">
        <strong>Items:</strong>
        {order.items.map((item, i) => (
          <div key={i}>
            {item.name} ({item.variant}) x {item.qty}
          </div>
        ))}
      </div>

      <p className="mt-2 font-bold text-sm">
        ₹{order.total}
      </p>

      {/* Buttons */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {order.status === "pending" && (
          <>
            <button
              onClick={() =>
                updateStatus(order.id, "accepted")
              }
              className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
            >
              Accept
            </button>

            <button
              onClick={() =>
                updateStatus(order.id, "rejected")
              }
              className="bg-red-500 text-white px-2 py-1 text-xs rounded"
            >
              Reject
            </button>
          </>
        )}

        {order.status === "accepted" && (
          <button
            onClick={() =>
              updateStatus(order.id, "delivered")
            }
            className="bg-green-600 text-white px-2 py-1 text-xs rounded"
          >
            Deliver
          </button>
        )}
      </div>

      <p className="text-[10px] text-gray-400 mt-2">
        {new Date(order.created_at).toLocaleString()}
      </p>
    </div>
  ))}
</div>
    </div>
  );
}