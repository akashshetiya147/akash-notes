"use client";

import { useApp } from "@/context/AppContext";
// import { getContent } from "@/lib/data"; // Removed to prevent fs error in client component 
// getContents uses fs, so it Must be server component or passed prop.
// app/page.tsx is server component by default. But need useApp content context?
// Actually we passed content to Layout, maybe we can just re-fetch in server component page? 
// Yes, server component can fetch.
// But we need 'selectedSemester' from client context.
// Mixed mode.
// Let's make this page client side for interaction logic or use a redirect.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { selectedSemester } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (selectedSemester) {
      router.replace(`/${selectedSemester}`);
    }
  }, [selectedSemester, router]);

  return (
    <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
