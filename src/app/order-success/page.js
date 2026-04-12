"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ✅ INNER COMPONENT (uses hooks)
function OrderSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("id");

  return (
    <>
      <Header />
      <div className="flex min-h-[79vh] flex-col items-center justify-center text-center p-6">
        <div className="text-green-500 text-6xl mb-4">✅</div>

        <h1 className="text-2xl font-bold mb-2">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mb-4">
          Thank you for your order 🙏
        </p>

        {orderId && (
          <p className="bg-gray-100 px-4 py-2 rounded mb-4">
            Order ID: <strong>{orderId}</strong>
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Back to Home
          </button>

          <button
            onClick={() => router.push("/track-order")}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Track Order
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

// ✅ OUTER COMPONENT (Suspense wrapper)
export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <OrderSuccessContent />
    </Suspense>
  );
}