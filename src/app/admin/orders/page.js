"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../utils/supabase";
import AdminLayout from "../components/AdminLayout";

import OrderCard from "../components/OrderCard";
import DeleteModal from "../components/DeleteModal";
import EditOrderModal from "../components/EditOrderModal";
import { printInvoice } from "../../utils/printInvoice";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editOrder, setEditOrder] = useState(null);

  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setOrders(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("orders")
      .update({
        status,
      })
      .eq("id", id);

    if (!error) {
      fetchOrders();
    }
  }

  const deleteOrder = async () => {
  try {
    setDeleteLoading(true);

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", deleteOrderId);

    if (error) throw error;

    setDeleteOrderId(null);

    fetchOrders();

  } catch (err) {
    alert(err.message);
  } finally {
    setDeleteLoading(false);
  }
};

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        order.order_id.toLowerCase().includes(keyword) ||
        order.name.toLowerCase().includes(keyword) ||
        (order.phone || "").includes(keyword);

      const matchStatus =
        statusFilter === "all"
          ? true
          : order.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const pending = orders.filter(
      (o) => o.status === "pending"
    ).length;

    const accepted = orders.filter(
      (o) => o.status === "accepted"
    ).length;

    const delivered = orders.filter(
      (o) => o.status === "completed" ||
      o.status === "delivered"
    ).length;

    const rejected = orders.filter(
      (o) => o.status === "rejected"
    ).length;

    const revenue = orders.reduce(
      (sum, o) => sum + Number(o.total),
      0
    );

    return {
      total: orders.length,
      pending,
      accepted,
      delivered,
      rejected,
      revenue,
    };
  }, [orders]);

  return (
    <AdminLayout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          Order Dashboard
        </h1>

        {/* Statistics */}

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-500 text-sm">
              Total Orders
            </div>
            <div className="text-3xl font-bold">
              {stats.total}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <div className="text-yellow-700 text-sm">
              Pending
            </div>
            <div className="text-3xl font-bold">
              {stats.pending}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg shadow p-4">
            <div className="text-blue-700 text-sm">
              Accepted
            </div>
            <div className="text-3xl font-bold">
              {stats.accepted}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg shadow p-4">
            <div className="text-green-700 text-sm">
              Completed
            </div>
            <div className="text-3xl font-bold">
              {stats.delivered}
            </div>
          </div>

          <div className="bg-red-50 rounded-lg shadow p-4">
            <div className="text-red-700 text-sm">
              Rejected
            </div>
            <div className="text-3xl font-bold">
              {stats.rejected}
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg shadow p-4">
            <div className="text-purple-700 text-sm">
              Revenue
            </div>
            <div className="text-3xl font-bold">
              ₹{stats.revenue}
            </div>
          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-lg shadow p-4 mb-6">

          <div className="flex flex-col lg:flex-row gap-4">

            <input
              className="border rounded-lg p-3 flex-1"
              placeholder="Search Order ID, Customer or Phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              className="border rounded-lg p-3 w-56"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>

          </div>

        </div>

        {/* Orders */}

        {loading ? (

          <div className="text-center py-20">

            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <div className="mt-3">
              Loading Orders...
            </div>

          </div>

        ) : (

          <div className="grid xl:grid-cols-2 gap-6">

            {filteredOrders.map((order) => (

              <OrderCard
                key={order.id}
                order={order}
                onAccept={() =>
                  updateStatus(order.id, "accepted")
                }
                onReject={() =>
                  updateStatus(order.id, "rejected")
                }
                onDeliver={() =>
                  updateStatus(order.id, "completed")
                }
                onDelete={() =>
                  setDeleteOrderId(order.id)
                }
                onPrint={() =>
                  printInvoice(order)
                }
                onEdit={() =>
                  setEditOrder(order)
                }
              />

            ))}

          </div>

        )}

      </div>

      <DeleteModal
        open={!!deleteOrderId}
        loading={deleteLoading}
        onClose={() => setDeleteOrderId(null)}
        onConfirm={deleteOrder}
      />

      <EditOrderModal
        order={editOrder}
        onClose={() => setEditOrder(null)}
        refresh={fetchOrders}
      />


      

    </AdminLayout>
  );
}