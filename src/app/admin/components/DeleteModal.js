"use client";

import { useEffect } from "react";

export default function DeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);
  }, [loading, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-[fadeIn_.2s]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">

          <div className="flex justify-center">

            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">

              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 7h12M9 7V4h6v3m-8 0v13a1 1 0 001 1h8a1 1 0 001-1V7"
                />
              </svg>

            </div>

          </div>

          <h2 className="text-2xl font-bold text-center mt-5">
            Delete Order
          </h2>

          <p className="text-center text-gray-500 mt-3">
            This action cannot be undone.
          </p>

          <p className="text-center text-gray-500">
            Are you sure you want to permanently delete this order?
          </p>

          <div className="flex gap-3 mt-8">

            <button
              disabled={loading}
              onClick={onClose}
              className="flex-1 border rounded-lg py-3 font-medium hover:bg-gray-100 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium disabled:bg-red-300 flex justify-center items-center gap-2"
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}

              {loading ? "Deleting..." : "Delete"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}