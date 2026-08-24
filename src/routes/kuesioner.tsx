import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const KuesionerPage = lazy(() => import("@/components/KuesionerPage"));

export const Route = createFileRoute("/kuesioner")({
  component: () => (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          Memuat kuesioner...
        </div>
      }
    >
      <KuesionerPage />
    </Suspense>
  ),
  ssr: false,
});
