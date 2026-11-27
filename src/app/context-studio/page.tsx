"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProofCraftContextStudio from "@/components/ProofCraftContextStudio";

function ContextStudioInner() {
  const params = useSearchParams();
  const isFloating = params.get("floating") === "1";

  return (
    <main className={isFloating ? "min-h-screen bg-slate-950 p-2" : "min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8"}>
      {isFloating && (
        <style>{`header, nav, footer { display: none !important; }`}</style>
      )}
      <div className={isFloating ? "w-full" : "mx-auto max-w-6xl space-y-6"}>
        <ProofCraftContextStudio embeddedInMethod={false} />
      </div>
    </main>
  );
}

export default function ContextStudioPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950 px-4 py-8"><div className="mx-auto max-w-6xl text-slate-300 text-sm">Loading Context Packet Studio...</div></main>}>
      <ContextStudioInner />
    </Suspense>
  );
}