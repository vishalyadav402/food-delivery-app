"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/"); // ✅ better than push for redirect
  }, [router]);

  return null;
};

export default Page;