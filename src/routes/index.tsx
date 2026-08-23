import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteSettingsQueryOptions } from "@/lib/site-settings";
import TemplateModern from "@/components/templates/TemplateModern";

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    // Pre-fetch settings and reviews so SSR HTML has the correct image and no flash occurs
    await queryClient.ensureQueryData(siteSettingsQueryOptions);
    const { reviewsQueryOptions } = await import("@/lib/reviews");
    await queryClient.ensureQueryData(reviewsQueryOptions);
  },
  head: () => ({
    meta: [
      { title: "Ikan Bakar P. Tris — Ikan Bakar Puri Delta Sidoarjo" },
      {
        name: "description",
        content:
          "Lele bakar Rp10rb, ayam bule Rp10rb, nila Rp17rb, gurameh Rp30rb. Sambal terasi atau bawang, gratis antar area Puri Delta Sidoarjo.",
      },
      { property: "og:title", content: "Ikan Bakar P. Tris — Puri Delta Sidoarjo" },
      {
        property: "og:description",
        content:
          "Ikan bakar bumbu meresap, dibakar dadakan setelah pesanan masuk. Pesan lewat WhatsApp, diantar hangat ke rumah.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),

  component: Index,
});

function Index() {
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  
  // Future fallback logic can be added here
  // const activeTemplate = settings?.active_template || 'modern';
  // if (activeTemplate === 'classic') return <TemplateClassic />;
  
  return <TemplateModern />;
}
