"use client";

import { Suspense } from "react";
import BlogContent from "./BlogContent";

function BlogLoading() {
  return (
    <main className="min-h-screen bg-[#F5EBE0]">
      <div className="gradient-mesh fixed inset-0 -z-10" />
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="h-8 w-48 mx-auto bg-[#E5E0D8] rounded animate-pulse mb-4" />
          <div className="h-12 w-96 mx-auto bg-[#E5E0D8] rounded animate-pulse mb-8" />
          <div className="h-14 w-full max-w-xl mx-auto bg-[#E5E0D8] rounded-full animate-pulse" />
        </div>
      </section>
    </main>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogContent />
    </Suspense>
  );
}
