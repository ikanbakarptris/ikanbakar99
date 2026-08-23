import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  EMPTY_REVIEW,
  adminReviewsQueryOptions,
  createReview,
  deleteReview,
  updateReview,
  updateReviewSortOrder,
  type ReviewInput,
  type ReviewRow,
} from "@/lib/admin-reviews";
import {
  DEFAULT_SETTINGS,
  saveSiteSettings,
  siteSettingsQueryOptions,
  type SiteSettingsInput,
} from "@/lib/site-settings";
import { supabase } from "@/integrations/supabase/client";
import { FileUploadButton } from "@/components/FileUploadButton";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { DEFAULT_MEDIA_BASE_URL, resolveMediaUrl, VERCEL_PROJECT_ID } from "@/lib/media";

export const Route = createFileRoute("/dapur-admin/dashboard")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/dapur-admin" });
    return { user: data.user };
  },
  head: () => ({
    meta: [
      { title: "Dashboard Pengelola — Ikanbakar99" },
      { name: "description", content: "Kelola pengaturan, media, dan ulasan Ikanbakar99." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Dashboard Pengelola — Ikanbakar99" },
      { property: "og:description", content: "Panel pengelolaan konten dapur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

/* ---------------------------------- UI bits --------------------------------- */

const inputClass =
  "h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <header className="mb-5">
        <h2 className="font-display text-xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      {children}
    </section>
  );
}

function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="h-12 w-full rounded-lg bg-primary px-4 text-base font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
    >
      {children}
    </button>
  );
}

/* -------------------------------- Dashboard -------------------------------- */

type TabId = "settings" | "hero" | "services" | "theme" | "media" | "reviews" | "ui" | "survey" | "advanced";

const TABS = [
  { id: "settings", label: "Info dapur" },
  { id: "hero", label: "Hero (Teks Utama)" },
  { id: "services", label: "Layanan" },
  { id: "theme", label: "Tema" },
  { id: "media", label: "Media" },
  { id: "reviews", label: "Ulasan" },
  { id: "ui", label: "Label UI" },
  { id: "advanced", label: "SEO & Lanjutan" },
] as const;

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabId>("settings");

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/dapur-admin", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/40 pb-24">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ikanbakar99
            </p>
            <h1 className="font-display text-lg font-bold text-foreground">Dashboard Pengelola</h1>
          </div>
          <button
            onClick={signOut}
            className="rounded-lg border border-input px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24 sm:pb-6">
        {tab === "settings" ? <GlobalSettingsPanel /> : null}
        {tab === "hero" ? <HeroPanel /> : null}
        {tab === "services" ? <ServicesPanel /> : null}
        {tab === "theme" ? <ThemePanel /> : null}
        {tab === "media" ? <MediaPanel /> : null}
        {tab === "reviews" ? <ReviewsPanel /> : null}
        {tab === "ui" ? <UiLabelsPanel /> : null}
        {tab === "advanced" ? <AdvancedPanel /> : null}
      </main>

      {/* Thumb-zone navigation on mobile, inline tabs on desktop. */}
      <nav
        aria-label="Menu dashboard"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur sm:sticky sm:top-16 sm:mx-auto sm:mt-0 sm:max-w-4xl sm:rounded-none sm:border-t-0"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-2 sm:grid-cols-4 md:grid-cols-7 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={`py-3 text-sm font-medium transition ${
                tab === t.id
                  ? "border-t-2 border-primary text-primary sm:border-t-0 sm:border-b-2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ----------------------------- Settings modules ---------------------------- */

function useSettingsForm() {
  const { data, isPending } = useQuery(siteSettingsQueryOptions);
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SiteSettingsInput>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setForm({
        ...DEFAULT_SETTINGS,
        ...data,
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (values: SiteSettingsInput) => saveSiteSettings(data?.id ?? null, values),
    onSuccess: () => {
      setStatus("Perubahan tersimpan.");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (e: Error) => setStatus(`Gagal menyimpan: ${e.message}`),
  });

  return { form, setForm, isPending, mutation, status };
}

function StatusLine({ status }: { status: string | null }) {
  if (!status) return null;
  return (
    <p role="status" className="text-sm text-muted-foreground">
      {status}
    </p>
  );
}

function GlobalSettingsPanel() {
  const { form, setForm, isPending, mutation, status } = useSettingsForm();

  return (
    <Panel
      title="Informasi dapur"
      description="Nama, alamat, jam operasional, dan info dasar lainnya."
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(form);
        }}
      >
        <Field label="Nama dapur" htmlFor="shop_name">
          <input
            id="shop_name"
            className={inputClass}
            value={form.shop_name}
            onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
          />
        </Field>
        <Field label="Alamat dapur" htmlFor="shop_address">
          <textarea
            id="shop_address"
            className={inputClass}
            rows={2}
            value={form.shop_address}
            onChange={(e) => setForm({ ...form, shop_address: e.target.value })}
          />
        </Field>
        <Field label="Jam Operasional" htmlFor="shop_hours">
          <input
            id="shop_hours"
            className={inputClass}
            value={form.shop_hours}
            onChange={(e) => setForm({ ...form, shop_hours: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Rating (1-5)" htmlFor="shop_rating">
            <input
              id="shop_rating"
              type="number"
              step="0.1"
              className={inputClass}
              value={form.shop_rating}
              onChange={(e) => setForm({ ...form, shop_rating: parseFloat(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Jumlah Ulasan" htmlFor="shop_reviews">
            <input
              id="shop_reviews"
              type="number"
              className={inputClass}
              value={form.shop_reviews_count}
              onChange={(e) => setForm({ ...form, shop_reviews_count: parseInt(e.target.value) || 0 })}
            />
          </Field>
        </div>
        <Field label="Nomor WhatsApp" htmlFor="wa" hint="Format internasional tanpa +, contoh 62895382966573.">
          <input
            id="wa"
            className={inputClass}
            value={form.whatsapp_number}
            onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
            inputMode="numeric"
          />
        </Field>
        <Field label="Tautan Google Maps" htmlFor="maps">
          <input
            id="maps"
            className={inputClass}
            value={form.maps_url}
            onChange={(e) => setForm({ ...form, maps_url: e.target.value })}
          />
        </Field>
          <div className="pt-4 border-t border-border mt-4">
            <h4 className="text-sm font-semibold mb-4">Sosial Media & Kontak</h4>
            <div className="space-y-4">
              <Field label="Facebook URL" htmlFor="facebook">
                <input
                  id="facebook"
                  className={inputClass}
                  value={form.social_facebook || ""}
                  onChange={(e) => setForm({ ...form, social_facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </Field>
              <Field label="Instagram URL" htmlFor="instagram">
                <input
                  id="instagram"
                  className={inputClass}
                  value={form.social_instagram || ""}
                  onChange={(e) => setForm({ ...form, social_instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </Field>
              <Field label="Tiktok URL" htmlFor="tiktok">
                <input
                  id="tiktok"
                  className={inputClass}
                  value={form.social_tiktok || ""}
                  onChange={(e) => setForm({ ...form, social_tiktok: e.target.value })}
                  placeholder="https://tiktok.com/..."
                />
              </Field>
              <Field label="Alamat Email" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  value={form.contact_email || ""}
                  onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  placeholder="contoh@gmail.com"
                />
              </Field>
            </div>
          </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <PrimaryButton type="submit" disabled={isPending || mutation.isPending}>
            {mutation.isPending ? "Menyimpan…" : "Simpan perubahan"}
          </PrimaryButton>
          <StatusLine status={status} />
        </div>
      </form>
    </Panel>
  );
}

function HeroPanel() {
  const { form, setForm, isPending, mutation, status } = useSettingsForm();

  return (
    <Panel
      title="Hero Section (Bagian Atas)"
      description="Kalimat promosi utama yang pertama kali dilihat oleh pengunjung."
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(form);
        }}
      >
                <Field label="Gambar Hero (Rekomendasi: 1200x800px, max 2MB)" htmlFor="hero_image" hint="Bisa unggah langsung, atau paste URL gambar.">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="hero_image"
              className={inputClass}
              value={form.hero_image || ""}
              onChange={(e) => setForm({ ...form, hero_image: e.target.value })}
              placeholder="Kosongkan untuk pakai gambar bawaan"
            />
            <FileUploadButton 
              onUploadSuccess={(url) => setForm({ ...form, hero_image: url })}
              label="Unggah"
              className="shrink-0"
            />
          </div>
        </Field>
        <Field label="Teks Label Kecil" htmlFor="hero_badge" hint="Contoh: Puri Delta & sekitarnya">
          <input
            id="hero_badge"
            className={inputClass}
            value={form.hero_badge}
            onChange={(e) => setForm({ ...form, hero_badge: e.target.value })}
          />
        </Field>
        <Field label="Judul Utama (Heading)" htmlFor="hero_title">
          <textarea
            id="hero_title"
            className={inputClass}
            rows={2}
            value={form.hero_title}
            onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
          />
        </Field>
        <Field label="Deskripsi Paragraf 1" htmlFor="hero_desc_1">
          <textarea
            id="hero_desc_1"
            className={inputClass}
            rows={3}
            value={form.hero_desc_1}
            onChange={(e) => setForm({ ...form, hero_desc_1: e.target.value })}
          />
        </Field>
        <Field label="Deskripsi Paragraf 2" htmlFor="hero_desc_2">
          <textarea
            id="hero_desc_2"
            className={inputClass}
            rows={3}
            value={form.hero_desc_2}
            onChange={(e) => setForm({ ...form, hero_desc_2: e.target.value })}
          />
        </Field>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <PrimaryButton type="submit" disabled={isPending || mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan Hero"}
          </PrimaryButton>
          <StatusLine status={status} />
        </div>
      </form>
    </Panel>
  );
}

function ServicesPanel() {
  const { form, setForm, isPending, mutation, status } = useSettingsForm();
  const services = form.services ?? [];

  const addService = () => {
    setForm({ ...form, services: [...services, { title: "Layanan Baru", desc: "", price: "", icon: "🔧" }] });
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = [...services];
    const current = updated[index];
    if (!current) return;
    updated[index] = { ...current, [field]: value };
    setForm({ ...form, services: updated });
  };

  const removeService = (index: number) => {
    setForm({ ...form, services: services.filter((_, i) => i !== index) });
  };

  return (
    <Panel title="Daftar Layanan" description="Kelola layanan dapur dan harga yang ditampilkan.">
      <div className="space-y-4">
        {services.map((s, i) => (
          <div key={i} className="rounded-xl border border-border p-4 bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Layanan #{i + 1}</h4>
              <button
                type="button"
                onClick={() => removeService(i)}
                className="text-xs text-destructive font-medium hover:bg-destructive/10 px-2 py-1 rounded"
              >
                Hapus
              </button>
            </div>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
               <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Ikon</label>
                  <input
                    className={`${inputClass} w-16 text-center text-xl`}
                    value={s.icon}
                    onChange={(e) => updateService(i, "icon", e.target.value)}
                  />
               </div>
               <div>
                 <label className="block text-xs font-medium text-muted-foreground mb-1">Nama Layanan</label>
                  <input
                    className={inputClass}
                    value={s.title}
                    onChange={(e) => updateService(i, "title", e.target.value)}
                  />
               </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Deskripsi</label>
              <textarea
                className={inputClass}
                rows={2}
                value={s.desc}
                onChange={(e) => updateService(i, "desc", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Harga</label>
              <input
                className={inputClass}
                value={s.price}
                onChange={(e) => updateService(i, "price", e.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4">
          <button
             type="button"
             onClick={addService}
             className="px-4 py-2 bg-muted text-foreground text-sm font-semibold rounded-lg hover:bg-muted/80"
          >
            + Tambah Layanan
          </button>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <PrimaryButton type="button" onClick={() => mutation.mutate(form)} disabled={isPending || mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan Layanan"}
            </PrimaryButton>
            <StatusLine status={status} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

const FONT_OPTIONS = ["Inter", "Barlow Condensed", "Poppins", "Rubik", "Work Sans"];

const THEME_TEMPLATES = [
  { name: "Ikanbakar99 (Default)", color: "#F59E0B", font: "Inter" },
  { name: "Racing Red", color: "#DC2626", font: "Barlow Condensed" },
  { name: "Forest Green", color: "#16A34A", font: "Work Sans" },
  { name: "Ocean Blue", color: "#2563EB", font: "Poppins" },
  { name: "Dark Knight", color: "#374151", font: "Rubik" },
];


function UiLabelsPanel() {
  const { form, setForm, isPending, mutation, status } = useSettingsForm();

  return (
    <Panel
      title="Label & Teks UI"
      description="Ubah teks dan judul pada elemen-elemen interface lainnya."
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(form);
        }}
      >
        <Field label="Subtitle Header" htmlFor="header_subtitle">
          <input
            id="header_subtitle"
            className={inputClass}
            value={form.header_subtitle}
            onChange={(e) => setForm({ ...form, header_subtitle: e.target.value })}
          />
        </Field>
        
        <div className="grid gap-4 md:grid-cols-2">
            <Field label="Teks Tombol WhatsApp" htmlFor="cta_whatsapp_text">
            <input
                id="cta_whatsapp_text"
                className={inputClass}
                value={form.cta_whatsapp_text}
                onChange={(e) => setForm({ ...form, cta_whatsapp_text: e.target.value })}
            />
            </Field>
            
            <Field label="Teks Tombol Maps" htmlFor="cta_maps_text">
            <input
                id="cta_maps_text"
                className={inputClass}
                value={form.cta_maps_text}
                onChange={(e) => setForm({ ...form, cta_maps_text: e.target.value })}
            />
            </Field>
        </div>

        <Field label="Judul Bagian Layanan" htmlFor="services_title">
          <input
            id="services_title"
            className={inputClass}
            value={form.services_title}
            onChange={(e) => setForm({ ...form, services_title: e.target.value })}
          />
        </Field>
        
        <Field label="Deskripsi Bagian Layanan" htmlFor="services_subtitle">
          <textarea
            id="services_subtitle"
            className={inputClass}
            rows={2}
            value={form.services_subtitle}
            onChange={(e) => setForm({ ...form, services_subtitle: e.target.value })}
          />
        </Field>
        
        <div className="grid gap-4 md:grid-cols-2">
            <Field label="Teks Pelanggan (Rating)" htmlFor="trust_rating_text">
            <input
                id="trust_rating_text"
                className={inputClass}
                value={form.trust_rating_text}
                onChange={(e) => setForm({ ...form, trust_rating_text: e.target.value })}
            />
            </Field>
            <Field label="Judul Alamat Footer" htmlFor="address_title">
            <input
                id="address_title"
                className={inputClass}
                value={form.address_title}
                onChange={(e) => setForm({ ...form, address_title: e.target.value })}
            />
            </Field>
        </div>

        <Field label="Judul Pickup & Drop-off" htmlFor="trust_pickup_title">
          <input
            id="trust_pickup_title"
            className={inputClass}
            value={form.trust_pickup_title}
            onChange={(e) => setForm({ ...form, trust_pickup_title: e.target.value })}
          />
        </Field>
        
        <Field label="Deskripsi Pickup & Drop-off" htmlFor="trust_pickup_desc">
          <textarea
            id="trust_pickup_desc"
            className={inputClass}
            rows={3}
            value={form.trust_pickup_desc}
            onChange={(e) => setForm({ ...form, trust_pickup_desc: e.target.value })}
          />
        </Field>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <PrimaryButton type="submit" disabled={isPending || mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan Teks UI"}
          </PrimaryButton>
          <StatusLine status={status} />
        </div>
      </form>
    </Panel>
  );
}

function ThemePanel() {
  const { form, setForm, isPending, mutation, status } = useSettingsForm();

  const applyTemplate = (template: typeof THEME_TEMPLATES[0]) => {
    const nextForm = { ...form, theme_color: template.color, font_family: template.font };
    setForm(nextForm);
    mutation.mutate(nextForm);
  };

  return (
    <Panel title="Tema" description="Ubah kostum dan tata letak halaman depan.">
        <div className="mb-6 space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <h4 className="text-sm font-semibold text-primary">Pilih Template Website (Kostum Utama)</h4>
          <p className="text-xs text-muted-foreground mb-3">Ubah total tata letak dan desain website dalam 1 klik tanpa menghilangkan data Anda.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                const nextForm = { ...form, active_template: "modern" };
                setForm(nextForm);
                mutation.mutate(nextForm);
              }}
              className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors hover:border-primary/50 ${form.active_template === 'modern' || !form.active_template ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border bg-card hover:bg-muted/50'}`}
            >
              <span className="font-semibold">Modern (Bawaan)</span>
              <span className="text-xs text-muted-foreground">Tata letak standar dengan hero banner besar.</span>
            </button>
            <button
              type="button"
              onClick={() => {
                // Future templates can go here. For now it just falls back.
                const nextForm = { ...form, active_template: "classic" };
                setForm(nextForm);
                mutation.mutate(nextForm);
              }}
              className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors hover:border-primary/50 opacity-60 cursor-not-allowed`}
              disabled
            >
              <span className="font-semibold flex items-center gap-2">Klasik (Segera Datang)</span>
              <span className="text-xs text-muted-foreground">Desain elegan dan minimalis.</span>
            </button>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-semibold">Pilih Palet Warna & Font</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEME_TEMPLATES.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => applyTemplate(t)}
              className="flex items-center gap-2 rounded-xl border border-border p-3 text-left transition-colors hover:bg-muted"
            >
              <span
                className="size-5 shrink-0 rounded-full border border-border/50"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-sm font-medium">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form
        className="space-y-4 rounded-xl border border-border bg-muted/20 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(form);
        }}
      >
        <h4 className="text-sm font-semibold">Kustomisasi Manual</h4>
        <Field label="Warna utama" htmlFor="color" hint="Dipakai untuk tombol dan aksen utama.">
          <div className="flex items-center gap-3">
            <input
              id="color"
              type="color"
              className="h-12 w-16 cursor-pointer rounded-lg border border-input bg-background p-1"
              value={form.theme_color}
              onChange={(e) => setForm({ ...form, theme_color: e.target.value })}
            />
            <input
              aria-label="Kode warna heksadesimal"
              className={inputClass}
              value={form.theme_color}
              onChange={(e) => setForm({ ...form, theme_color: e.target.value })}
            />
          </div>
        </Field>
        <Field label="Jenis huruf" htmlFor="font">
          <select
            id="font"
            className={inputClass}
            value={form.font_family}
            onChange={(e) => setForm({ ...form, font_family: e.target.value })}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <PrimaryButton type="submit" disabled={isPending || mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan tema"}
          </PrimaryButton>
          <StatusLine status={status} />
        </div>
      </form>
    </Panel>
  );
}

function MediaPanel() {
  const { form, setForm, isPending, mutation, status } = useSettingsForm();

  const mediaList = form.carousel_images ?? [];

  function handleUploadSuccess(url: string) {
    const newMediaList = [...mediaList, url];
    setForm({ ...form, carousel_images: newMediaList });
    mutation.mutate({ ...form, carousel_images: newMediaList });
  }

  function removeMedia(urlToRemove: string) {
    const newMediaList = mediaList.filter((url) => url !== urlToRemove);
    setForm({ ...form, carousel_images: newMediaList });
    
    // Attempt to delete from Supabase storage if it's a supabase URL
    if (urlToRemove.includes('supabase.co/storage/v1/object/public/media/')) {
       const path = urlToRemove.split('/public/media/')[1];
       if (path) supabase.storage.from('media').remove([path]);
    }
  }

  function moveMedia(index: number, direction: 'up' | 'down') {
    const newList = [...mediaList];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newList.length) return;
    const a = newList[index];
    const b = newList[target];
    if (a === undefined || b === undefined) return;
    newList[index] = b;
    newList[target] = a;
    setForm({ ...form, carousel_images: newList });
  }

  function renderMediaItem(url: string, index: number) {
    const isVideo = (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.includes('.mp4') || url.includes('.webm') || url.includes('.mov'));
    return (
      <div
        key={index}
        className="flex items-center gap-2 overflow-hidden rounded-xl border border-border bg-background p-2 shadow-sm"
      >
        <div className="flex flex-col gap-1 shrink-0 px-1">
          <button
            type="button"
            onClick={() => moveMedia(index, 'up')}
            disabled={index === 0}
            className="rounded bg-muted px-1 py-0.5 text-xs font-bold text-muted-foreground hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Pindah ke Atas/Kiri"
          >
            &#9650;
          </button>
          <button
            type="button"
            onClick={() => moveMedia(index, 'down')}
            disabled={index === mediaList.length - 1}
            className="rounded bg-muted px-1 py-0.5 text-xs font-bold text-muted-foreground hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Pindah ke Bawah/Kanan"
          >
            &#9660;
          </button>
        </div>

        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
          {isVideo ? (
            <video src={url} className="h-full w-full object-cover" muted />
          ) : (
            <img src={url} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <p className="min-w-0 grow truncate text-xs text-muted-foreground">{url}</p>
        <div className="flex shrink-0 items-center gap-1 pr-2">
          <button
            type="button"
            onClick={() => removeMedia(url)}
            className="rounded p-2 text-xs font-medium text-destructive hover:bg-destructive/10"
          >
            Hapus
          </button>
        </div>
      </div>
    );
  }

  return (
    <Panel
      title="Media Gallery (Supabase)"
      description="Kelola foto dan video dapur yang tampil di halaman depan. Anda bisa mengatur urutan dengan tombol panah."
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-muted/20 p-5 text-center">
          <FileUploadButton onUploadSuccess={handleUploadSuccess} label="Upload Foto / Video Baru" className="rounded-full shadow-lift" />
          <p className="mt-2 text-xs text-muted-foreground">Mendukung JPG, PNG, MP4. (Auto-upload & simpan)</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Urutan Media ({mediaList.length})</h4>
          {mediaList.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada media.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {mediaList.map((url, i) => renderMediaItem(url, i))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <PrimaryButton 
            type="button" 
            onClick={() => mutation.mutate(form)}
            disabled={isPending || mutation.isPending}
          >
            {mutation.isPending ? "Menyimpan..." : "Simpan Susunan"}
          </PrimaryButton>
          <StatusLine status={status} />
        </div>
      </div>
    </Panel>
  );
}

function ReviewsPanel() {
  const queryClient = useQueryClient();
  const { data: reviews, isPending, error } = useQuery(adminReviewsQueryOptions);
  const [editing, setEditing] = useState<ReviewRow | null>(null);
  const [form, setForm] = useState<ReviewInput>(EMPTY_REVIEW);
  const [status, setStatus] = useState<string | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
  };

  const save = useMutation({
    mutationFn: (values: ReviewInput) =>
      editing ? updateReview(editing.id, values) : createReview(values),
    onSuccess: () => {
      setStatus(editing ? "Ulasan diperbarui." : "Ulasan ditambahkan.");
      setEditing(null);
      setForm(EMPTY_REVIEW);
      invalidate();
    },
    onError: (e: Error) => setStatus(`Gagal menyimpan: ${e.message}`),
  });


  const remove = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      setStatus("Ulasan dihapus.");
      invalidate();
    },
    onError: (e: Error) => setStatus(`Gagal menghapus: ${e.message}`),
  });

  const reorder = useMutation({
    mutationFn: async (updates: { id: string, sort_order: number }[]) => {
      // Lakukan update secara berurutan agar tidak membebani Supabase API
      for (const update of updates) {
        await updateReviewSortOrder(update.id, update.sort_order);
      }
    },
    onSuccess: () => invalidate(),
  });

  function moveReview(index: number, direction: 'up' | 'down') {
    if (!reviews) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= reviews.length) return;

    // Buat salinan array dan tukar posisi dua elemen
    const newReviews = [...reviews];
    const a = newReviews[index];
    const b = newReviews[targetIdx];
    if (!a || !b) return;
    newReviews[index] = b;
    newReviews[targetIdx] = a;

    // Tetapkan sort_order baru berdasarkan urutan index saat ini untuk semua item
    // Ini menyelesaikan masalah jika semua sort_order sebelumnya sama (misal 0 semua)
    const updates = newReviews.map((r, i) => ({ id: r.id, sort_order: i }));
    
    // Terapkan ke Supabase
    reorder.mutate(updates);
  }


  function startEdit(review: ReviewRow) {
    setEditing(review);
    setForm({
      reviewer_name: review.reviewer_name,
      rating: review.rating,
      review_text: review.review_text,
      reviewer_role: review.reviewer_role ?? "",
        reviewer_avatar_url: review.reviewer_avatar_url ?? null,
      is_local_guide: review.is_local_guide,
      media_url: review.media_url ?? null,
      reviewer_url: review.reviewer_url ?? null,
      bike_type: review.bike_type ?? null,
      owner_reply: review.owner_reply ?? null,
    });
  }

  return (
    <div className="space-y-6">
      <Panel
        title={editing ? "Ubah Ulasan" : "Tambah Ulasan"}
        description="Ulasan tampil di bagian trust signal halaman depan."
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(form);
          }}
        >
          <Field label="Nama pengulas" htmlFor="r-name">
            <input
              id="r-name"
              required
              className={inputClass}
              value={form.reviewer_name}
              onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })}
            />
          </Field>
          
          <Field label="Foto Profil (Opsional)" htmlFor="r-avatar" hint="Paste URL foto profil pelanggan atau unggah gambar.">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="r-avatar"
                className={inputClass}
                value={form.reviewer_avatar_url || ""}
                onChange={(e) => setForm({ ...form, reviewer_avatar_url: e.target.value })}
                placeholder="URL Foto atau klik Unggah ->"
              />
              <FileUploadButton 
                onUploadSuccess={(url) => setForm({ ...form, reviewer_avatar_url: url })}
                label="Unggah"
                className="shrink-0"
              />
            </div>
            {form.reviewer_avatar_url && (
              <div className="mt-3 relative size-12 rounded-full border border-border bg-muted overflow-hidden flex items-center justify-center">
                <img src={form.reviewer_avatar_url} alt="Avatar preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, reviewer_avatar_url: null })}
                  className="absolute inset-0 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity text-xs"
                >
                  Hapus
                </button>
              </div>
            )}
          </Field>
          <Field label="Link Review" htmlFor="r-url" hint="Paste URL profil/ulasan Google Maps pelanggan agar nama bisa diklik (menambah trust).">
            <input
              id="r-url"
              className={inputClass}
              value={form.reviewer_url || ""}
              onChange={(e) => setForm({ ...form, reviewer_url: e.target.value })}
              placeholder="https://maps.app.goo.gl/..."
            />
          </Field>
          <Field label="Menu Pesanan (opsional)" htmlFor="r-bike" hint="Contoh: Lele Bakar, Ayam Bule, Nila, Gurameh">
            <input
              id="r-bike"
              className={inputClass}
              value={form.bike_type || ""}
              onChange={(e) => setForm({ ...form, bike_type: e.target.value })}
              placeholder="Lele / Ayam / Nila"
            />
          </Field>
          <Field label="Balasan Pemilik (opsional)" htmlFor="r-reply" hint="Balasan publik dari Pak Sutrisno (meningkatkan kepercayaan).">
            <textarea
              id="r-reply"
              className={inputClass}
              rows={3}
              value={form.owner_reply || ""}
              onChange={(e) => setForm({ ...form, owner_reply: e.target.value })}
              placeholder="Terima kasih atas kepercayaannya..."
            />
          </Field>
                      <Field label="Peran / lokasi (opsional)" htmlFor="r-role">
              <select
                id="r-role"
                className={inputClass}
                value={form.reviewer_role ?? ""}
                onChange={(e) => setForm({ ...form, reviewer_role: e.target.value })}
              >
                <option value="">-- Tidak Ada / Kosong --</option>
                <option value="Local Guide">Local Guide (Tanpa Level)</option>
                <option value="Local Guide Level 1">Local Guide Level 1</option>
                <option value="Local Guide Level 2">Local Guide Level 2</option>
                <option value="Local Guide Level 3">Local Guide Level 3</option>
                <option value="Local Guide Level 4">Local Guide Level 4</option>
                <option value="Local Guide Level 5">Local Guide Level 5</option>
                <option value="Local Guide Level 6">Local Guide Level 6</option>
                <option value="Local Guide Level 7">Local Guide Level 7</option>
                <option value="Local Guide Level 8">Local Guide Level 8</option>
                <option value="Local Guide Level 9">Local Guide Level 9</option>
                <option value="Local Guide Level 10">Local Guide Level 10</option>
                {form.reviewer_role && !form.reviewer_role.startsWith('Local Guide') && (
                  <option value={form.reviewer_role}>{form.reviewer_role} (Data Custom Lama)</option>
                )}
              </select>
            </Field>
          <Field label="Rating (1–5)" htmlFor="r-rating">
            <select
              id="r-rating"
              className={inputClass}
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} bintang
                </option>
              ))}
            </select>
          </Field>
          <Field label="Isi ulasan" htmlFor="r-text">
              <div className="relative">
                <textarea
                  id="r-text"
                  required
                  rows={4}
                  maxLength={500}
                  className="w-full rounded-lg border border-input bg-background p-3 pb-7 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  value={form.review_text}
                  onChange={(e) => setForm({ ...form, review_text: e.target.value })}
                />
                <span className={`absolute bottom-2 right-3 text-[10px] font-medium ${form.review_text.length >= 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {form.review_text.length}/500
                </span>
              </div>
            </Field>
          
          <Field label="Media Ulasan (Foto / Video Opsional)" htmlFor="r-media" hint="Paste URL gambar/video dari luar (untuk hemat bandwidth), atau klik Unggah ke Supabase.">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="r-media"
                className={inputClass}
                value={form.media_url || ""}
                onChange={(e) => setForm({ ...form, media_url: e.target.value })}
                placeholder="Paste URL (https://...) atau klik Unggah 👉"
              />
              <FileUploadButton 
                onUploadSuccess={(url) => setForm({ ...form, media_url: url })}
                label="Unggah"
                className="shrink-0"
              />
            </div>
            {form.media_url && (
              <div className="mt-3 relative w-full h-32 rounded-lg border border-border bg-muted/20 overflow-hidden flex items-center justify-center">
                {(form.media_url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || form.media_url.includes('.mp4') || form.media_url.includes('.webm') || form.media_url.includes('.mov')) ? (
                  <video src={form.media_url} className="h-full object-contain" controls />
                ) : (
                  <img src={form.media_url} alt="Media ulasan" className="h-full object-contain" />
                )}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, media_url: null })}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 backdrop-blur-sm"
                >
                  ✕
                </button>
              </div>
            )}
          </Field>

          <label className="flex items-center gap-3 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              className="size-5 rounded border-input"
              checked={form.is_local_guide}
              onChange={(e) => setForm({ ...form, is_local_guide: e.target.checked })}
            />
            Tandai sebagai Google Local Guide
          </label>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <PrimaryButton type="submit" disabled={save.isPending}>
              {save.isPending ? "Menyimpan…" : editing ? "Simpan perubahan" : "Tambah ulasan"}
            </PrimaryButton>
            {editing ? (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(EMPTY_REVIEW);
                }}
                className="h-12 rounded-lg border border-input px-4 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                Batal
              </button>
            ) : null}
            <StatusLine status={status} />
          </div>
        </form>
      </Panel>

      <Panel title="Daftar Ulasan" description="Kelola semua ulasan yang tersimpan di database.">
        {isPending ? (
          <p className="text-sm text-muted-foreground">Memuat ulasan…</p>
        ) : error ? (
          <p className="text-sm text-destructive">Gagal memuat: {(error as Error).message}</p>
        ) : (reviews?.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada ulasan.</p>
        ) : (
          <ul className="space-y-3">
            {reviews!.map((review, index) => (
              <li key={review.id} className="rounded-xl border border-border bg-background p-4 flex gap-4">
                  <div className="flex flex-col gap-1 shrink-0 pt-1">
                    <button 
                      type="button" 
                      onClick={() => moveReview(index, 'up')}
                      disabled={index === 0 || reorder.isPending}
                      className="rounded bg-muted px-1.5 py-0.5 text-xs font-bold text-muted-foreground hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Pindah ke Atas"
                    >
                      &#9650;
                    </button>
                    <button 
                      type="button"
                      onClick={() => moveReview(index, 'down')}
                      disabled={index === reviews.length - 1 || reorder.isPending}
                      className="rounded bg-muted px-1.5 py-0.5 text-xs font-bold text-muted-foreground hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Pindah ke Bawah"
                    >
                      &#9660;
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{review.reviewer_name}</span>
                  <span className="text-sm text-gold">{"★".repeat(review.rating)}</span>
                  {review.is_local_guide ? (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Local Guide
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.review_text}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(review)}
                    className="rounded-md border border-input px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent"
                  >
                    Ubah
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus ulasan dari ${review.reviewer_name}?`)) {
                        remove.mutate(review.id);
                      }
                    }}
                    className="rounded-md border border-input px-3 py-2 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    Hapus
                  </button>
                </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function AdvancedPanel() {
  const { form, setForm, isPending, mutation, status } = useSettingsForm();

  return (
    <Panel 
      title="SEO & Pengaturan Lanjutan (Advanced Mode)" 
      description="Injeksi kode pelacakan analitik (GA4/Meta), kustomisasi desain (CSS), dan skema mesin pencari (JSON-LD)."
    >
      <div className="space-y-6">
        
        {/* PANDUAN SINGKAT */}
        <div className="rounded-xl border-l-4 border-l-blue-500 bg-blue-500/10 p-4 mb-6">
          <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-2">Panduan Penggunaan (Untuk Pemula)</h4>
          <p className="text-xs text-blue-900/80 dark:text-blue-200/80 mb-2">
            Halaman ini khusus untuk kode teknis pihak ketiga. Jika Anda tidak paham, <strong>biarkan saja kosong</strong> (website akan tetap berjalan 100% normal).
          </p>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-semibold">1. Injeksi Script Head (GTM, GA4, Meta Pixel)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Kegunaan:</strong> Untuk memasang alat pelacak pengunjung seperti Google Analytics, Google Tag Manager, atau Facebook Pixel. 
                <br/><br/>
                <strong>Cara Pakai:</strong> Copy kode yang diberikan oleh Google/Facebook, lalu paste ke kotak di bawah ini. Kode akan otomatis ditanam di dalam tag <code>&lt;head&gt;</code> website Anda.
              </p>
              <div className="bg-background rounded p-2 border border-border/50 text-[10px] text-muted-foreground font-mono mt-2">
                Contoh (Google Analytics):<br/>
                &lt;script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"&gt;&lt;/script&gt;<br/>
                &lt;script&gt;<br/>
                &nbsp;&nbsp;window.dataLayer = window.dataLayer || [];<br/>
                &nbsp;&nbsp;function gtag() {'{'}dataLayer.push(arguments);{'}'}<br/>
                &nbsp;&nbsp;gtag('js', new Date());<br/>
                &nbsp;&nbsp;gtag('config', 'G-XXXXX');<br/>
                &lt;/script&gt;
              </div>
            </div>
            <div className="w-full md:w-[60%] shrink-0">
              <textarea
                className="w-full h-48 rounded-lg border border-input bg-background p-3 text-xs text-foreground outline-none font-mono focus:border-primary transition-colors"
                placeholder="<!-- Paste kode <script> Anda di sini -->"
                value={form.advanced_head_scripts || ""}
                onChange={(e) => setForm({ ...form, advanced_head_scripts: e.target.value })}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-semibold">2. Skema Pencarian (Custom JSON-LD)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Kegunaan:</strong> Membantu robot Google memahami bahwa website ini adalah "Ikan Bakar", sehingga SEO lokal Anda lebih kuat.
                <br/><br/>
                <strong>Penting:</strong> Jika dikosongkan, sistem kami <strong>sudah otomatis</strong> membuatkan skema yang sangat baik berdasarkan info di tab "Info dapur". Isi ini HANYA jika Pakar SEO Anda meminta format khusus.
              </p>
            </div>
            <div className="w-full md:w-[60%] shrink-0">
              <textarea
                className="w-full h-40 rounded-lg border border-input bg-background p-3 text-xs text-foreground outline-none font-mono focus:border-primary transition-colors"
                placeholder='{
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "name": "Ikanbakar99"
}'
                value={form.advanced_json_ld || ""}
                onChange={(e) => setForm({ ...form, advanced_json_ld: e.target.value })}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-semibold">3. Custom CSS (Gaya Visual Khusus)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Kegunaan:</strong> Memaksa perubahan warna, ukuran, atau menyembunyikan elemen tertentu tanpa harus mengubah kode asli website.
                <br/><br/>
                <strong>Hati-hati:</strong> Salah isi bisa membuat tampilan website berantakan. Gunakan hanya jika mengerti kode CSS dasar.
              </p>
              <div className="bg-background rounded p-2 border border-border/50 text-[10px] text-muted-foreground font-mono mt-2">
                Contoh (Ubah warna latar belakang murni hitam):<br/>
                body {'{'} background-color: #000000 !important; {'}'}<br/><br/>
                Contoh (Menyembunyikan logo/teks di navigasi):<br/>
                .nav-logo {'{'} display: none !important; {'}'}
              </div>
            </div>
            <div className="w-full md:w-[60%] shrink-0">
              <textarea
                className="w-full h-48 rounded-lg border border-input bg-background p-3 text-xs text-foreground outline-none font-mono focus:border-primary transition-colors"
                placeholder="/* Paste kode CSS Anda di sini */
body {
  /* ... */
}"
                value={form.advanced_css || ""}
                onChange={(e) => setForm({ ...form, advanced_css: e.target.value })}
                spellCheck={false}
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <PrimaryButton type="button" onClick={() => mutation.mutate(form)} disabled={isPending || mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan Pengaturan Lanjutan"}
          </PrimaryButton>
          <StatusLine status={status} />
        </div>
      </div>
    </Panel>
  );
}

/* ---------------------------------- Survey Tab --------------------------------- */

function SurveyTab() {
  const { data: responses, isLoading, error } = useQuery({
    queryKey: ['survey_responses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('survey_responses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const exportToCSV = () => {
    if (!responses || responses.length === 0) return;
    
    // Create CSV header
    const headers = ['Waktu', 'Nama', 'WhatsApp', 'Menu Favorit', 'Tingkat Pedas', 'Saran'];
    
    // Create CSV rows
    const rows = responses.map(r => [
      new Date(r.created_at).toLocaleString('id-ID'),
      '"' + (r.nama || '').replace(/"/g, '""') + '"',
      '"' + (r.whatsapp || '').replace(/"/g, '""') + '"',
      '"' + (r.menu_favorit || '').replace(/"/g, '""') + '"',
      '"' + (r.tingkat_pedas || '').replace(/"/g, '""') + '"',
      '"' + (r.saran || '').replace(/"/g, '""') + '"'
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kuesioner_ikanbakar99_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Panel title="Hasil Kuesioner Warga" description="Data langsung dari warga Puri Delta / sekitarnya.">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-muted/50 rounded-xl">
          <div>
            <p className="text-sm text-muted-foreground">Total Responden</p>
            <p className="text-3xl font-display font-bold text-foreground">
              {isLoading ? '...' : (responses?.length || 0)}
            </p>
          </div>
          <PrimaryButton onClick={exportToCSV} disabled={!responses?.length}>
            Download CSV
          </PrimaryButton>
        </div>

        {error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">Gagal memuat data: {(error as Error).message}</div>
        ) : isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Memuat data kuesioner...</div>
        ) : responses?.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
            Belum ada warga yang mengisi kuesioner.<br/>
            Bagikan link <strong>https://ikanbakar99.vercel.app/kuesioner</strong> ke grup WhatsApp warga!
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Menu Favorit</th>
                    <th className="px-4 py-3">Tingkat Pedas</th>
                    <th className="px-4 py-3 hidden md:table-cell">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {responses?.map((r, i) => (
                    <tr key={i} className="bg-card hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {r.nama}
                        {r.whatsapp && <div className="text-xs font-normal text-muted-foreground mt-0.5">{r.whatsapp}</div>}
                      </td>
                      <td className="px-4 py-3">{r.menu_favorit}</td>
                      <td className="px-4 py-3">{r.tingkat_pedas}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                        {new Date(r.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

