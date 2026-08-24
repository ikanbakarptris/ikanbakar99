import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Share2, ChevronRight, ChevronLeft, Flame, Star } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateDiscountCode(nama: string): string {
  const clean = nama.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `PURI-${clean || "TAMU"}-${suffix}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated star progress bar */
function StarProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className={`transition-all duration-500 ${
              i < current
                ? "text-amber-400 scale-125 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                : "text-slate-200 scale-100"
            }`}
          >
            <Star
              className="w-7 h-7"
              fill={i < current ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          </div>
          <span className={`text-[9px] font-bold tracking-wider uppercase ${i < current ? "text-amber-500" : "text-slate-300"}`}>
            L{i + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

const MENU_OPTIONS = [
  { id: "Ikan Gurameh Bakar", emoji: "🐟", label: "Gurameh Bakar", desc: "Gurih & lembut", badge: "Paling Favorit" },
  { id: "Ikan Lele Bakar",    emoji: "🐠", label: "Lele Bakar",    desc: "Rasa kuat, bumbu meresap", badge: null },
  { id: "Ikan Nila Bakar",    emoji: "🐡", label: "Nila Bakar",   desc: "Daging tebal, less duri", badge: null },
  { id: "Ayam Bule Bakar",    emoji: "🍗", label: "Ayam Bule",    desc: "Empuk & juicy", badge: "Banyak Dipesan" },
  { id: "Bebek Bakar",        emoji: "🦆", label: "Bebek Bakar",   desc: "Krispi di luar, juicy di dalam", badge: null },
];

/** RPG-style menu card */
function MenuCard({
  option,
  selected,
  onSelect,
}: {
  option: (typeof MENU_OPTIONS)[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex items-center gap-3 rounded-2xl border-2 p-3 transition-all duration-300 cursor-pointer active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
        selected
          ? "border-amber-400 bg-amber-50 shadow-[0_0_12px_rgba(251,191,36,0.4)] scale-[1.02]"
          : "border-border bg-card hover:border-amber-200 hover:bg-amber-50/40"
      }`}
    >
      <span
        className={`text-3xl transition-all duration-300 ${selected ? "scale-125 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" : "scale-100"}`}
      >
        {option.emoji}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-bold text-sm ${selected ? "text-amber-700" : "text-foreground"}`}>
            {option.label}
          </p>
          {option.badge && (
            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-white px-2 py-0.5 rounded-full">
              {option.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          selected ? "border-amber-400 bg-amber-400" : "border-border bg-background"
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </button>
  );
}

const CHILI_LEVELS = [
  { value: "Tidak Pedas / Manis", label: "Tidak Pedas", chilies: 0, emoji: "😊", color: "text-green-500" },
  { value: "Pedas Ringan",        label: "Pedas Ringan", chilies: 1, emoji: "😄", color: "text-lime-500" },
  { value: "Sedang",              label: "Sedang",       chilies: 2, emoji: "😅", color: "text-yellow-500" },
  { value: "Pedas",               label: "Pedas",        chilies: 3, emoji: "🥵", color: "text-orange-500" },
  { value: "Sangat Pedas",        label: "Sangat Pedas", chilies: 4, emoji: "🔥", color: "text-red-600" },
];

/** Visual chili selector */
function ChiliSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const currentIdx = CHILI_LEVELS.findIndex((l) => l.value === value);
  const current = CHILI_LEVELS[currentIdx] ?? CHILI_LEVELS[2];
  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-2">
        {CHILI_LEVELS.map((level, idx) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-300 active:scale-95 ${
              currentIdx === idx
                ? "border-amber-400 bg-amber-50 scale-105 shadow-md"
                : "border-border bg-card hover:border-amber-200"
            }`}
          >
            <span className="text-xl">{level.emoji}</span>
            <span className="text-[9px] font-bold text-center text-muted-foreground leading-tight">
              {level.label}
            </span>
          </button>
        ))}
      </div>
      <div
        className={`flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 transition-all duration-500`}
      >
        <span className="text-2xl">{current.emoji}</span>
        <div>
          <p className={`font-black text-sm ${current.color}`}>{current.label}</p>
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Flame
                key={i}
                className={`w-3 h-3 transition-all duration-300 ${
                  i < current.chilies ? "text-red-500 fill-red-500" : "text-slate-200 fill-slate-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Animated confetti badge reward screen */
function RewardScreen({
  nama,
  kodeDiskon,
  onShare,
}: {
  nama: string;
  kodeDiskon: string;
  onShare: () => void;
}) {
  const [showBadge, setShowBadge] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowBadge(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center p-4">
      {/* Confetti dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {["🎉", "⭐", "🌟", "✨", "🎊", "🏅"].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-bounce"
            style={{
              left: `${10 + i * 15}%`,
              top: `${5 + (i % 3) * 8}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${1.5 + i * 0.3}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div
        className={`w-full max-w-sm transition-all duration-700 ${showBadge ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"}`}
      >
        {/* Badge */}
        <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-center">
            <div className="text-6xl mb-2 drop-shadow-lg">🏅</div>
            <h2 className="text-white font-black text-xl leading-tight">
              Petualang Rasa<br />Puri Delta
            </h2>
            <p className="text-amber-100 text-xs mt-1 font-medium">Batch Perdana — {new Date().getFullYear()}</p>
          </div>

          <div className="p-5 space-y-4">
            <div className="text-center">
              <p className="text-slate-500 text-sm">Selamat, <strong className="text-foreground">{nama}</strong>!</p>
              <p className="text-slate-400 text-xs mt-1">Masukan Anda sangat berarti untuk warung kami 🙏</p>
            </div>

            {/* Discount code */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center">
              <p className="text-xs text-amber-600 font-semibold uppercase tracking-widest mb-1">Kode Diskon Anda</p>
              <p className="font-black text-2xl text-amber-700 tracking-widest">{kodeDiskon}</p>
              <p className="text-[11px] text-slate-400 mt-1">Hemat <strong>10%</strong> untuk pesanan pertama Anda</p>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              📌 Screenshot halaman ini & tunjukkan ke Pak Tris saat pesan. Berlaku untuk pesanan pertama di area Puri Delta.
            </p>

            <Button onClick={onShare} className="w-full gap-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white rounded-full py-5 text-sm font-bold shadow-lg">
              <Share2 className="w-4 h-4" />
              Bagikan ke Grup Warga & Dapat Bonus!
            </Button>

            <a
              href="/"
              className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors py-2"
            >
              Kembali ke Beranda →
            </a>
          </div>
        </div>

        {/* Sharing incentive */}
        <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            🎁 <strong className="text-foreground">Ajak 3 teman mengisi</strong> = dapat <strong className="text-amber-600">minuman gratis</strong> saat makan pertama!
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
const TOTAL_STEPS = 3;
const STEP_META = [
  { level: 1, title: "Mulai Petualangan", subtitle: "Kenalan dulu, 3 langkah beres!" },
  { level: 2, title: "Pilih Senjata Rasa", subtitle: "Mana menu andalanmu?" },
  { level: 3, title: "Tinggalkan Jejak", subtitle: "Satu kata juga cukup!" },
];

export default function KuesionerPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kodeDiskon, setKodeDiskon] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    whatsapp: "",
    menu_favorit: "",
    tingkat_pedas: "Sedang",
    saran: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.nama.trim()) {
        toast.error("Isi nama / panggilan dulu ya 😊");
        return;
      }
      if (formData.whatsapp && !/^[0-9+]{9,15}$/.test(formData.whatsapp)) {
        toast.error("Format nomor WA tidak valid");
        return;
      }
    }
    if (step === 2 && !formData.menu_favorit) {
      toast.error("Pilih satu menu favoritmu dulu! 🍽️");
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const kode = generateDiscountCode(formData.nama);
    try {
      const { error } = await supabase.from("survey_responses").insert([
        {
          nama: formData.nama,
          whatsapp: formData.whatsapp,
          menu_favorit: formData.menu_favorit,
          tingkat_pedas: formData.tingkat_pedas,
          saran: formData.saran,
        },
      ]);
      if (error) throw error;
      setKodeDiskon(kode);
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal mengirim data: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const text = `🏅 Saya baru jadi "Petualang Rasa Puri Delta"!\n\nSaya sudah bantu pilih menu favorit untuk Ikan Bakar P. Tris yang akan buka di Puri Delta. Dapat kode diskon 10% juga! 🎉\n\nYuk ikutan juga, cuma 2 menit:\nhttps://ikanbakar99.vercel.app/kuesioner`;
    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(text), "_blank");
  };

  if (isSuccess) {
    return <RewardScreen nama={formData.nama} kodeDiskon={kodeDiskon} onShare={handleShare} />;
  }

  const currentMeta = STEP_META[step - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex flex-col items-center pt-6 pb-16 px-4">
      {/* Header */}
      <div className="w-full max-w-md mb-2 text-center">
        <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors mb-3 inline-block">
          ← Kembali ke Beranda
        </a>
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-xs font-bold mb-3">
          🗺️ Petualang Rasa Puri Delta
        </div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">
          Jadi Petualang Rasa Pertama!
        </h1>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
          2 menit ngisi → dapat <strong className="text-amber-600">kode diskon 10%</strong> + <strong>Badge eksklusif</strong> 🏅
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden">
        {/* Star Progress */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 px-5 py-2">
          <StarProgress current={step} total={TOTAL_STEPS} />
        </div>

        {/* Step Header */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-[11px] font-black uppercase tracking-widest text-amber-500">
            Level {currentMeta.level} dari {TOTAL_STEPS}
          </p>
          <h2 className="text-lg font-black text-foreground leading-tight">{currentMeta.title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{currentMeta.subtitle}</p>
        </div>

        {/* Step Content */}
        <div className="px-5 pb-4 min-h-[260px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-400 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="nama" className="font-semibold text-sm">
                  Nama / Panggilan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama"
                  placeholder="Misal: Bp. Budi atau Bu Ani"
                  value={formData.nama}
                  onChange={(e) => handleChange("nama", e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp" className="font-semibold text-sm flex items-center gap-2">
                  Nomor WA
                  <span className="text-[10px] font-normal text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                    Opsional
                  </span>
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="Untuk dikirim kode diskon"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  className="rounded-xl"
                />
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  🔒 WA kamu aman, hanya untuk kirim kode diskon. Tidak akan di-broadcast.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-400 pt-2">
              <p className="text-sm font-semibold mb-3">
                Mana lauk andalanmu untuk makan malam? <span className="text-red-500">*</span>
              </p>
              {MENU_OPTIONS.map((opt) => (
                <MenuCard
                  key={opt.id}
                  option={opt}
                  selected={formData.menu_favorit === opt.id}
                  onSelect={() => handleChange("menu_favorit", opt.id)}
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-400 pt-2">
              <div className="space-y-3">
                <p className="text-sm font-semibold">Seberapa pedas sambal idealmu?</p>
                <ChiliSelector
                  value={formData.tingkat_pedas}
                  onChange={(v) => handleChange("tingkat_pedas", v)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="saran" className="font-semibold text-sm flex items-center gap-2">
                  Ada pesan untuk Pak Tris?
                  <span className="text-[10px] font-normal text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                    Opsional
                  </span>
                </Label>
                <Textarea
                  id="saran"
                  placeholder="Misal: Buka sampai jam 10 dong, atau tolong ada paket nasi!"
                  rows={3}
                  value={formData.saran}
                  onChange={(e) => handleChange("saran", e.target.value)}
                  className="rounded-xl resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Nav */}
        <div className="flex items-center justify-between px-5 py-4 bg-amber-50/50 border-t border-amber-100">
          {step > 1 ? (
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              className="gap-1 text-muted-foreground rounded-full"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <Button
              onClick={handleNext}
              className="gap-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 shadow-md shadow-amber-200"
            >
              Lanjut Level {step + 1} <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 shadow-md shadow-orange-200"
            >
              {isSubmitting ? "Memproses..." : "🏅 Klaim Hadiah!"}
            </Button>
          )}
        </div>
      </div>

      {/* Social proof counter */}
      <p className="mt-5 text-xs text-slate-400 text-center">
        Sudah banyak warga Puri Delta yang ikut. Jadilah bagian dari batch pertama!
      </p>
    </div>
  );
}
