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
      { title: "Ikanbakar99 — Ikan Bakar Ungaran | Spesialis Ikan Bakar & Ayam Bakar" },
      {
        name: "description",
        content:
          "Ikan Bakar Ungaran: pesanan Ikan Bakar, Ayam Bakar, Nila, Gurameh. Rating 5.0 dari 130 ulasan. Layanan antar-jemput pesanan.",
      },
      { property: "og:title", content: "Ikanbakar99 — Ikan Bakar Ungaran" },
      {
        property: "og:description",
        content:
          "Servis pesanan presisi di Ungaran. Rating 5.0 (130 ulasan), antar-jemput pesanan, konsultasi via WhatsApp.",
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
