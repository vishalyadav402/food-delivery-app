"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/policies/about");
  }, [router]);

  return null; // Return null since the page redirects immediately
};

export default Page;
