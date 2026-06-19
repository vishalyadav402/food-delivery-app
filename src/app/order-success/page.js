"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Check, Zap, MessageCircle } from "lucide-react";

// ✅ INNER COMPONENT (uses hooks)
function OrderSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("id");

useEffect(() => {
  const hasReloaded = sessionStorage.getItem("hasReloaded");

  if (!hasReloaded) {
    sessionStorage.setItem("hasReloaded", "true");
    window.location.reload();
  }
}, []);


  return (
    <>
      <Header />
      <div className="flex min-h-[79vh] bg-gray-50 flex-col items-center justify-center text-center p-6">
        <div className="w-full max-w-sm">

          {/* SUCCESS ICON */}
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" strokeWidth={2.5} />
          </div>

          <h1 className="text-lg font-semibold text-gray-900 mb-1">
            Order placed successfully
          </h1>
          <p className="text-[13px] text-gray-500 mb-6">
            Thank you for your order
          </p>

          {/* ORDER ID + ETA CARD */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-left mb-4">
            {orderId && (
              <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 mb-2.5">
                <span className="text-[13px] text-gray-500">Order ID</span>
                <span className="text-[13px] font-semibold text-gray-900">{orderId}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-green-600" />
              <span className="text-[13px] text-gray-700">Will Arrive within same day</span>
            </div>
          </div>

          {/* WHATSAPP NOTICE */}
          <div className="bg-blue-50 rounded-xl p-3.5 text-left mb-6 flex gap-2.5">
            <MessageCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-blue-700 leading-relaxed">
              We've sent your order details on WhatsApp. Our team will confirm shortly.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2.5">
            <button
              onClick={() => router.push("/")}
              className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Back to home
            </button>

            <button
              onClick={() => router.push("/track-order")}
              className="flex-1 py-3 rounded-lg bg-gray-900 text-[13px] font-semibold text-white hover:bg-gray-800 transition"
            >
              Track order
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

// ✅ OUTER COMPONENT (Suspense wrapper)
export default function Page() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-gray-400">Loading...</p>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
