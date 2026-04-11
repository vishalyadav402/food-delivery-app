"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Content() {
  const params = useSearchParams();
  const orderId = params.get("id");

  return <div>Order ID: {orderId}</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Content />
    </Suspense>
  );
}