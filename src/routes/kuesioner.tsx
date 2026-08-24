import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const KuesionerPage = lazy(() => import("@/components/KuesionerPage"));

export const Route = createFileRoute("/kuesioner")({
  component: () => (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex flex-col items-center justify-center gap-3 p-4">
          <span className="text-4xl animate-bounce">🏅</span>
          <p className="text-sm text-amber-600 font-semibold">Memuat petualangan rasa...</p>
        </div>
      }
    >
      <KuesionerPage />
    </Suspense>
  ),
  ssr: false,
});
