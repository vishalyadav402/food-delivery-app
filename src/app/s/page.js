"use client";

import { Suspense } from "react";
import Master from "../components/Master";
import SearchContent from "../components/Searchcontent";

export default function Page() {
  return (
    <Master>
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <SearchContent />
      </Suspense>
    </Master>
  );
}