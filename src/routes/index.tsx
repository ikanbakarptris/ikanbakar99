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
      { title: "Agung Bike Station — Bengkel Sepeda Bandungan | Servis & Setel Velg" },
      {
        name: "description",
        content:
          "Bengkel sepeda Bandungan: servis ringan, setel velg/jari-jari, upgrade, perakitan, cek unit. Rating 5.0 dari 130 ulasan. Layanan antar-jemput sepeda.",
      },
      { property: "og:title", content: "Agung Bike Station — Bengkel Sepeda Bandungan" },
      {
        property: "og:description",
        content:
          "Servis sepeda presisi di Bandungan. Rating 5.0 (130 ulasan), antar-jemput sepeda, konsultasi via WhatsApp.",
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
