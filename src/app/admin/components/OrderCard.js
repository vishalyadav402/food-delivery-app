"use client";

import { useState } from "react";

export default function OrderCard({
  order,
  onAccept,
  onReject,
  onDeliver,
  onDelete,
  onEdit,
  onPrint,
}) {
  const [showItems, setShowItems] = useState(false);

  const totalQty = order.items.reduce(
    (sum, item) => sum + Number(item.qty),
    0
  );

  const badge = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    delivered: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

      {/* Header */}

      <div className="flex justify-between items-center p-4 border-b">

        <div>

          <div className="font-bold text-lg">
            {order.order_id}
          </div>

          <div className="text-xs text-gray-500">
            {new Date(order.created_at).toLocaleString()}
          </div>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            badge[order.status] ||
            "bg-gray-200 text-gray-700"
          }`}
        >
          {order.status}
        </span>

      </div>

      {/* Customer */}

      <div className="p-4 space-y-2">

        <div className="flex justify-between">

          <span className="text-gray-500">
            Customer
          </span>

          <span className="font-medium">
            {order.name}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-500">
            Phone
          </span>

          <span>
            {order.phone || "-"}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-500">
            Address
          </span>

          <span>
            {order.address}
          </span>

        </div>

        <hr />

        <div className="grid grid-cols-3 text-center">

          <div>

            <div className="text-xl font-bold">
              {order.items.length}
            </div>

            <div className="text-xs text-gray-500">
              Items
            </div>

          </div>

          <div>

            <div className="text-xl font-bold">
              {totalQty}
            </div>

            <div className="text-xs text-gray-500">
              Qty
            </div>

          </div>

          <div>

            <div className="text-xl font-bold text-green-700">
              ₹{order.total}
            </div>

            <div className="text-xs text-gray-500">
              Total
            </div>

          </div>

        </div>

      </div>

      {/* Items */}

      <div className="px-4 pb-4">

        <button
          onClick={() =>
            setShowItems(!showItems)
          }
          className="text-blue-600 text-sm font-medium"
        >
          {showItems
            ? "Hide Items ▲"
            : `View Items (${order.items.length}) ▼`}
        </button>

        {showItems && (

          <div className="mt-3 overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="bg-gray-100">

                  <th className="text-left p-2">
                    Item
                  </th>

                  <th className="text-center">
                    Variant
                  </th>

                  <th className="text-center">
                    Qty
                  </th>

                  <th className="text-right">
                    Price
                  </th>

                  <th className="text-right">
                    Total
                  </th>

                </tr>

              </thead>

              <tbody>

                {order.items.map((item, i) => (

                  <tr
                    key={i}
                    className="border-b"
                  >

                    <td className="p-2">
                      {item.name}
                    </td>

                    <td className="text-center">
                      {item.selectedVariant ||
                        "-"}
                    </td>

                    <td className="text-center">
                      {item.qty}
                    </td>

                    <td className="text-right">
                      ₹{item.price}
                    </td>

                    <td className="text-right font-medium">
                      ₹
                      {item.total ??
                        item.qty * item.price}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Footer */}

      <div className="border-t p-4">

        <div className="flex flex-wrap gap-2">

          {order.status === "pending" && (

            <>
              <button
                onClick={onAccept}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
              >
                Accept
              </button>

              <button
                onClick={onReject}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
              >
                Reject
              </button>
            </>

          )}

          {order.status === "accepted" && (

            <button
              onClick={onDeliver}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
            >
              Complete
            </button>

          )}

          <button
            onClick={onPrint}
            className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded text-sm"
          >
            Print
          </button>

          <button
            onClick={onEdit}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded text-sm"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}