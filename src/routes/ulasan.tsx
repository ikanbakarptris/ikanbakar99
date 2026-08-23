import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CustomerReviews } from "@/components/CustomerReviews";
import { reviewsQueryOptions } from "@/lib/reviews";
import { siteSettingsQueryOptions } from "@/lib/site-settings";

export const Route = createFileRoute("/ulasan")({
  component: UlasanPage,
  head: () => ({
    meta: [
      {
        title: "Ulasan Pelanggan Ikan Bakar P. Tris — Puri Delta Sidoarjo",
      },
      {
        name: "description",
        content: "Lihat galeri menu dan ulasan asli pelanggan Ikan Bakar P. Tris, rumah makan ikan bakar di Perumahan Puri Delta, Sidoarjo.",
      },
    ],
  }),
});

function UlasanPage() {
  const { data: reviewsData = [], isLoading: isLoadingReviews } = useQuery(reviewsQueryOptions);
  const { data: settings } = useQuery(siteSettingsQueryOptions);
  
  const shopName = settings?.shop_name || "Ikanbakar99";
  const headerSubtitle = settings?.header_subtitle || "Rumah makan ikan bakar · Puri Delta";

  // Hitung rata-rata rating
  const totalReviews = reviewsData.length;
  const averageRating = totalReviews > 0 
    ? (reviewsData.reduce((acc, rev) => acc + (rev.stars || 5), 0) / totalReviews).toFixed(1)
    : "5.0";

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <p className="truncate font-display text-xl font-bold tracking-tight text-foreground">
                {shopName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {headerSubtitle}
              </p>
            </Link>
          </div>
          <div>
            <Link to="/" className="text-sm font-semibold text-primary hover:underline">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 pb-20">
        <section className="bg-primary/5 py-12 md:py-16 border-b border-border/50">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary mb-4">
              ⭐ Kepercayaan Pelanggan
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl font-display text-foreground mb-4">
              Apa Kata Mereka?
            </h1>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto leading-relaxed">
              Berdasarkan <strong className="text-foreground">{totalReviews} ulasan</strong> otentik, 
              pelanggan kami memberikan rata-rata kepuasan <strong className="text-foreground">⭐ {averageRating}/5.0</strong>. 
              Berikut adalah bukti nyata dokumentasi hasil servis kami.
            </p>
          </div>
        </section>

        <div className="py-4">
          <CustomerReviews
            reviews={reviewsData}
            isLoading={isLoadingReviews}
            heading="Semua Ulasan"
            description={`Menampilkan ${reviewsData.length} ulasan pelanggan setia.`}
          />
        </div>
        <section className="mx-auto max-w-3xl px-4 py-8 pb-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 text-center shadow-lift">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            
            <span className="inline-flex items-center justify-center size-12 rounded-full bg-primary/20 mb-4">
              <svg viewBox="0 0 24 24" className="size-6 text-primary fill-current" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </span>
            <h2 className="text-2xl font-bold md:text-3xl font-display mb-3 text-foreground">
              Jadilah Bagian dari Bukti Kami!
            </h2>
            <p className="text-muted-foreground md:text-lg mb-6 leading-relaxed max-w-xl mx-auto">
              Sudah mencoba ikan bakar kami? Tulis ulasan jujur Anda di Google Maps, 
              tunjukkan saat kunjungan berikutnya, dan dapatkan <strong className="text-primary font-bold">Diskon Khusus 10%</strong> untuk pesanan berikutnya!
            </p>
            
            <a 
              href={settings?.maps_url || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lift transition-all hover:-translate-y-1 hover:shadow-xl hover:bg-primary/90"
            >
              Tulis Ulasan di Google Maps
              <svg viewBox="0 0 24 24" className="ml-2 size-4 fill-current" aria-hidden="true"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
