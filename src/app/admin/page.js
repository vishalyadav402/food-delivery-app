"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminLayout from "./components/AdminLayout";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Products
    const { data: products } = await supabase
      .from("products")
      .select("*");

    // Orders
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(ordersData || []);

    const revenue =
      ordersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

    setStats({
      products: products?.length || 0,
      orders: ordersData?.length || 0,
      revenue,
    });
  };

  // 📊 Chart Data (last 7 orders)
  const chartData = orders.slice(0, 7).map((o, i) => ({
    name: `#${i + 1}`,
    total: o.total,
  }));

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Products" value={stats.products} />
        <Card title="Orders" value={stats.orders} />
        <Card title="Revenue" value={`₹${stats.revenue}`} />
        <Card title="Customers" value={stats.orders} />
      </div>

      {/* 📊 Chart */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">Sales Trend</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🧾 Recent Orders */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Recent Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Order ID</th>
                <th>Name</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-b">
                  <td className="py-2">{o.order_id}</td>
                  <td>{o.name}</td>
                  <td>₹{o.total}</td>
                  <td>
                    <span className="text-yellow-600">
                      {o.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

/* 🔹 Reusable Card */
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}