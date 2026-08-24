import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SHOP, SERVICES } from "@/lib/shop-data";
import { reviewsQueryOptions } from "@/lib/reviews";
import { siteSettingsQueryOptions } from "@/lib/site-settings";
import { resolveMediaUrls } from "@/lib/media";
import { WorkshopSlider } from "@/components/WorkshopSlider";
import { CustomerReviews } from "@/components/CustomerReviews";
import { AnimateIn } from "@/components/AnimateIn";

function Stars() {
  return (
    <span className="text-gold" aria-hidden="true">
      ★★★★★
    </span>
  );
}

function WhatsAppCta({
  className = "",
  url,
  text,
}: {
  className?: string;
  url?: string;
  text?: string;
}) {
  return (
    <a
      href={url || SHOP.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 ${className}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
      <span suppressHydrationWarning>{text || "Konsultasi Servis via WhatsApp"}</span>
    </a>
  );
}

function MapsCta({
  className = "",
  url,
  text,
}: {
  className?: string;
  url?: string;
  text?: string;
}) {
  return (
    <a
      href={url || SHOP.maps}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-base font-semibold text-foreground hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/20 transition-all duration-300 active:scale-95 ${className}`}
    >
      {text || "Petunjuk Arah ke rumah makan"}
    </a>
  );
}

export default function TemplateModern() {
  const { data: reviews, isPending } = useQuery(reviewsQueryOptions);
  const { data: settings } = useQuery(siteSettingsQueryOptions);

  const shopName = settings?.shop_name || "Ikan Bakar P. Tris";
  const shopRating = settings?.shop_rating || 4.9;
  const shopReviewsCount = settings?.shop_reviews_count || 87;
  const shopHours = settings?.shop_hours || "Setiap hari - 10.00-21.00 WIB";
  const shopAddress = settings?.shop_address || "Perumahan Puri Delta Sidoarjo";

  const headerSubtitle = settings?.header_subtitle || "Rumah makan ikan bakar · Puri Delta";
  const servicesTitle = settings?.services_title || "Menu kami";
  const servicesSubtitle =
    settings?.services_subtitle ||
    "Harga jujur, porsi mengenyangkan, dibakar setelah pesanan masuk.";
  const trustRatingText = settings?.trust_rating_text || "ulasan pelanggan";
  const trustPickupTitle = settings?.trust_pickup_title || "Antar & Ambil Sendiri";
  const trustPickupDesc =
    settings?.trust_pickup_desc ||
    "Gratis ongkir untuk area Perumahan Puri Delta. Di luar itu ada tambahan ongkir ringan. Bisa juga ambil sendiri ke rumah makan.";
  const addressTitle = settings?.address_title || "Alamat rumah makan";

  const heroBadge = settings?.hero_badge || "Puri Delta & sekitarnya";
  const heroTitle =
    settings?.hero_title || "Ikan bakar bumbu meresap, dibakar dadakan begitu pesanan masuk.";
  const heroDesc1 =
    settings?.hero_desc_1 ||
    "Ikan segar pilihan, dibumbui sejak dini hari, lalu dibakar di atas bara sampai wangi dan tidak amis.";
  const heroDesc2 =
    settings?.hero_desc_2 ||
    `Pesan lewat WhatsApp, kami antar hangat ke rumah Anda di area Puri Delta dan sekitarnya. Lengkap dengan sambal terasi atau sambal bawang.`;
  const heroStats = settings?.hero_stats || [
    { value: "Rp 10rb", label: "mulai dari" },
    { value: "30 menit", label: "siap diantar" },
    { value: "Gratis", label: "antar area Puri Delta" },
  ];

  const servicesList =
    settings?.services && settings.services.length > 0 ? settings.services : SERVICES;

  const sliderImages = resolveMediaUrls(settings?.carousel_images ?? []);

  let cleanWa = settings?.whatsapp_number?.replace(/[^0-9]/g, "") || "";
  if (cleanWa.startsWith("08")) cleanWa = "628" + cleanWa.slice(2);
  const waText = encodeURIComponent("Halo Pak Tris, saya mau pesan ikan bakar");
  const dynamicWaUrl = cleanWa
    ? "https://wa.me/" + cleanWa + "?text=" + waText
    : SHOP.whatsapp;
  const dynamicMapsUrl = settings?.maps_url || SHOP.maps;
  const ctaWaText = settings?.cta_whatsapp_text || "Pesan via WhatsApp";
  const ctaMapsText = settings?.cta_maps_text || "Petunjuk Arah";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: shopName,
    image: settings?.hero_image || "",
    telephone: "+6282227459399",
    servesCuisine: "Indonesian, Seafood",
    address: {
      "@type": "PostalAddress",
      streetAddress: shopAddress,
      addressLocality: "Sidoarjo",
      addressRegion: "Jawa Timur",
      addressCountry: "ID",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "21:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(shopRating),
      reviewCount: String(shopReviewsCount),
    },
    priceRange: "Rp",
  };

  const finalJsonLd =
    settings?.advanced_json_ld && settings.advanced_json_ld.trim() !== ""
      ? settings.advanced_json_ld
      : JSON.stringify(jsonLd);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: finalJsonLd }} />
      {settings?.advanced_css && (
        <style dangerouslySetInnerHTML={{ __html: settings.advanced_css }} />
      )}
      {settings?.advanced_head_scripts && (
        <div dangerouslySetInnerHTML={{ __html: settings.advanced_head_scripts }} />
      )}
      <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-white/10 shadow-sm supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0 flex items-center gap-8">
            <div>
              <p className="truncate font-display text-xl font-bold tracking-tight">{shopName}</p>
              <p className="truncate text-xs text-muted-foreground">{headerSubtitle}</p>
            </div>
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
              <a href="#layanan" className="hover:text-foreground transition-colors">Menu</a>
              <a href="#reviews-heading" className="hover:text-foreground transition-colors">Ulasan</a>
              <a href="#galeri" className="hover:text-foreground transition-colors">Galeri</a>
              <a href="/kuesioner" className="hover:text-primary transition-colors text-primary font-bold">Kuesioner</a>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <WhatsAppCta className="!min-h-10 !px-5 !py-2.5" url={dynamicWaUrl} text={ctaWaText} />
          </div>
          <span className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold md:hidden">
            <Stars /> {Number(shopRating).toFixed(1)}
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 py-10 md:grid md:grid-cols-2 md:items-center md:gap-10 md:py-16">
          <AnimateIn>
            <p className="inline-flex rounded-full bg-ink text-ink-foreground px-3 py-1 text-xs font-semibold shadow-sm">
              {heroBadge}
            </p>
            <h1 className="mt-4 text-4xl leading-[1.05] tracking-tight font-extrabold md:text-5xl md:leading-[1.1] text-foreground"> {heroTitle}</h1>
            <p className="mt-4 text-[15px] sm:text-base text-foreground/90 font-medium leading-relaxed">
              {heroDesc1}
            </p>
            <p className="mt-3 text-[15px] sm:text-base font-medium text-foreground">{heroDesc2}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppCta className="w-full sm:w-auto" url={dynamicWaUrl} text={ctaWaText} />
              <MapsCta
                className="w-full border-border/80 bg-card text-foreground shadow-sm hover:shadow-md hover:border-primary/40 hover:text-primary sm:w-auto"
                url={dynamicMapsUrl}
                text={ctaMapsText}
              />
            </div>
            <p className="mt-3 text-[13px] font-medium text-muted-foreground opacity-90">
              ✓ Pesan langsung lewat WhatsApp, tanpa aplikasi tambahan. Dibalas cepat oleh Pak Tris.
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              {heroStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-card border border-border border-b-4 border-b-muted-foreground/20 px-2 py-3 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-b-primary/40 transition-all duration-300"
                >
                  <dt className="font-display text-xl font-bold">{stat.value}</dt>
                  <dd className="text-[11px] text-muted-foreground">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </AnimateIn>
          <figure className="mt-8 md:mt-0">
            <img
              src={settings?.hero_image || ""}
              alt={`Ikan bakar khas ${shopName} yang baru matang di atas bara`}
              width={1200}
              height={912}
              fetchPriority="high"
              className="aspect-[1/1.05] w-full rounded-2xl object-cover shadow-lift ring-4 ring-primary/10 hover:ring-primary/30 transition-all duration-500 hover:scale-[1.02]"
            />

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs md:text-sm text-foreground/80 mt-6 px-4 py-3 bg-card rounded-2xl border border-border/40 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-4">
                {settings?.social_facebook && (
                  <a
                    href={settings.social_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:-translate-y-1 hover:text-[#1877F2] hover:drop-shadow-[0_0_8px_rgba(24,119,242,0.8)] flex items-center justify-center p-2.5"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>
                )}
                {settings?.social_instagram && (
                  <a
                    href={settings.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:-translate-y-1 hover:text-[#F56040] hover:drop-shadow-[0_0_8px_rgba(245,96,64,0.8)] flex items-center justify-center p-2.5"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {settings?.social_tiktok && (
                  <a
                    href={settings.social_tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:-translate-y-1 hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.6)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] flex items-center justify-center p-2.5"
                    aria-label="TikTok"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.65-2.43 2.3-6.19 3.02-9.28 1.7-2.61-1.1-4.48-3.52-4.9-6.31-.47-2.91.4-5.99 2.45-8.15 2.11-2.2 5.17-3.23 8.16-2.8v4.06c-1.3-.26-2.73-.24-3.95.27-1.4.58-2.47 1.84-2.81 3.32-.38 1.63.1 3.4 1.34 4.54 1.25 1.14 3.05 1.48 4.67 1 1.44-.45 2.5-1.74 2.75-3.27.08-.49.1-.99.1-1.49-.03-5.71-.02-11.43-.02-17.15z" />
                    </svg>
                  </a>
                )}
                <a
                  href={dynamicWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:-translate-y-1 hover:text-[#25D366] hover:drop-shadow-[0_0_8px_rgba(37,211,102,0.8)] flex items-center justify-center p-2.5"
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
                {settings?.contact_email && (
                  <>
                    <div className="h-4 w-px bg-border/60 mx-1" />
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="transition-all duration-300 hover:-translate-y-1 hover:text-[#EA4335] hover:drop-shadow-[0_0_8px_rgba(234,67,53,0.8)] flex items-center gap-2 truncate text-foreground font-medium group p-2.5"
                    >
                      <svg
                        className="w-5 h-5 fill-muted-foreground group-hover:fill-[#EA4335] transition-colors"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      <span className="text-[13px] tracking-wide">{settings.contact_email}</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </figure>
        </div>
      </section>

      <CustomerReviews
        reviews={reviews ?? []}
        isLoading={isPending}
        media={<WorkshopSlider images={sliderImages} />}
      />

      <section
        className="relative bg-muted/20 py-16 bg-dot-pattern border-y border-border/40 shadow-[inset_0_0_40px_rgba(0,0,0,0.02)]"
        aria-labelledby="layanan"
      >
        <div className="mx-auto max-w-5xl px-4">
          <h2
            id="layanan"
            className="text-2xl font-bold md:text-3xl text-gradient text-center mb-2"
          >
            {servicesTitle}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{servicesSubtitle}</p>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {servicesList.map((s, idx) => (
              <li
                key={idx}
                className={`group rounded-2xl border border-border bg-card p-4 shadow-lift hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 transition-all duration-300 ${idx === 4 && servicesList.length === 5 ? "md:col-span-2" : ""}`}
              >
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-xl group-hover:scale-110 group-hover:bg-primary/25 transition-transform duration-300">
                    {s.icon}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                    <p className="mt-2 text-sm font-bold text-gradient inline-block">{s.price}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10" aria-labelledby="kepercayaan">
        <h2 id="kepercayaan" className="sr-only">
          Alasan mempercayai kami
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 text-center hover:shadow-md transition-shadow duration-300">
            <p className="font-display text-5xl font-bold bg-gradient-to-br from-yellow-500 to-amber-700 bg-clip-text text-transparent drop-shadow-sm">
              {Number(shopRating).toFixed(1)}
            </p>
            <p className="mt-1 text-lg flex justify-center">
              <Stars />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              dari {shopReviewsCount} {trustRatingText}
            </p>
            <div className="mt-5 flex flex-col gap-2 border-t border-border/50 pt-4">
              <a
                href={dynamicMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary hover:underline hover:text-primary/80 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                Lihat lokasi & ulasan di Google Maps{" "}
                <span aria-hidden="true" className="text-[10px]">
                  ↗
                </span>
              </a>
              <a
                href="/ulasan"
                className="text-xs font-semibold text-primary hover:underline hover:text-primary/80 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                Lihat galeri foto pelanggan{" "}
                <span aria-hidden="true" className="text-[10px]">
                  ↗
                </span>
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 hover:shadow-lg hover:bg-primary/15 hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
            <div
              className="absolute -right-4 -top-4 size-24 rounded-full bg-primary/20 blur-2xl pointer-events-none"
              aria-hidden="true"
            />
            <h3 className="text-xl font-bold">{trustPickupTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{trustPickupDesc}</p>
            <p className="mt-3 text-sm font-medium">{shopHours}</p>
          </div>
        </div>

        <address className="mt-6 rounded-2xl border border-border bg-card p-5 not-italic hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold">{addressTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{shopAddress}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta className="w-full sm:w-auto" url={dynamicWaUrl} text={ctaWaText} />
            <MapsCta className="w-full sm:w-auto" url={dynamicMapsUrl} text={ctaMapsText} />
          </div>
        </address>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10" aria-labelledby="faq">
        <h2 id="faq" className="text-2xl font-bold md:text-3xl text-center mb-8">
          Pertanyaan Seputar Pesanan
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
            <h3 className="font-bold text-base">Di mana lokasi {shopName}?</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Kami berada di {shopAddress}. Buka {shopHours}, melayani makan di tempat, ambil
              sendiri, maupun pesan antar untuk area Puri Delta dan sekitarnya.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
            <h3 className="font-bold text-base">Berapa lama pesanan siap?</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Ikan dibakar setelah pesanan masuk supaya selalu hangat. Rata-rata 20-30 menit sudah
              siap diantar atau diambil, tergantung jumlah porsi dan antrean.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
            <h3 className="font-bold text-base">Apa saja pilihan sambalnya?</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Tersedia sambal terasi dan sambal bawang, diulek dadakan setiap hari. Gratis di setiap
              porsi dan tingkat pedasnya bisa diminta sesuai selera.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
            <h3 className="font-bold text-base">Bisa pesan untuk acara atau porsi banyak?</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Bisa. Untuk pesanan arisan, syukuran, atau kantor, kabari lewat WhatsApp minimal
              sehari sebelumnya agar ikan dan bumbu kami siapkan cukup.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground bg-muted/30">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {shopName} ·{" "}
        {shopAddress}
      </footer>

      <nav
        aria-label="Aksi cepat"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/60 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-cta backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 md:hidden"
      >
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-2">
          <WhatsAppCta url={dynamicWaUrl} text={ctaWaText} />
          <MapsCta url={dynamicMapsUrl} text={ctaMapsText} />
        </div>
      </nav>
    </div>
  );
}










