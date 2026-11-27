"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProofCraftContextStudio from "@/components/ProofCraftContextStudio";

function FloatingModeDetector({ onDetect }: { onDetect: (v: boolean) => void }) {
  const params = useSearchParams();
  React.useEffect(() => {
    onDetect(params.get("floating") === "1");
  }, [params, onDetect]);
  return null;
}

export default function ContextStudioPage() {
  const [isFloating, setIsFloating] = useState(false);

  return (
    <main className={isFloating ? "min-h-screen bg-slate-950 p-2" : "min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8"}>
      <Suspense fallback={null}>
        <FloatingModeDetector onDetect={setIsFloating} />
      </Suspense>
      {isFloating && <style>{`header, nav, footer { display: none !important; }`}</style>}
      <div className={isFloating ? "w-full" : "mx-auto max-w-6xl space-y-6"}>
        <ProofCraftContextStudio embeddedInMethod={false} />
      </div>
    </main>
  );
}