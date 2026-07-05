"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

export default function EditOrderModal({
  order,
  onClose,
  refresh,
}) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    status: "pending",
    discount: 0,
    total: 0,
  });

  useEffect(() => {
    if (order) {
      setForm({
        name: order.name || "",
        phone: order.phone || "",
        address: order.address || "",
        status: order.status || "pending",
        discount: Number(order.discount || 0),
        total: Number(order.total || 0),
      });
    }
  }, [order]);

  if (!order) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveOrder = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("orders")
        .update({
          name: form.name,
          phone: form.phone,
          address: form.address,
          status: form.status,
          discount: form.discount,
          total: form.total,
        })
        .eq("id", order.id);

      if (error) throw error;

      refresh();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b p-5">

          <h2 className="text-2xl font-bold">
            Edit Order
          </h2>

          <div className="text-gray-500 mt-1">
            {order.order_id}
          </div>

        </div>

        <div className="p-6 space-y-5">

          <div>
            <label className="font-medium">
              Customer Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg w-full mt-2 p-3"
            />
          </div>

          <div>
            <label className="font-medium">
              Phone
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border rounded-lg w-full mt-2 p-3"
            />
          </div>

          <div>
            <label className="font-medium">
              Address
            </label>

            <textarea
              rows={3}
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border rounded-lg w-full mt-2 p-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <label className="font-medium">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border rounded-lg w-full mt-2 p-3"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="font-medium">
                Discount
              </label>

              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                className="border rounded-lg w-full mt-2 p-3"
              />
            </div>

          </div>

          <div>
            <label className="font-medium">
              Total
            </label>

            <input
              type="number"
              name="total"
              value={form.total}
              onChange={handleChange}
              className="border rounded-lg w-full mt-2 p-3"
            />
          </div>

        </div>

        <div className="border-t p-5 flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={saving}
            className="border rounded-lg px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={saveOrder}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 flex items-center gap-2"
          >
            {saving && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>
    </div>
  );
}