import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PasswordInput } from "@/components/PasswordInput";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dapur-admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Masuk Panel — Ikanbakar99" },
      { name: "description", content: "Halaman masuk pengelola konten Ikanbakar99." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Masuk Panel — Ikanbakar99" },
      { property: "og:description", content: "Halaman masuk pengelola konten." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Already signed in? Skip the form. Recovery links land here too — forward them.
  useEffect(() => {
    let active = true;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash.includes("type=recovery")) {
      navigate({ to: "/dapur-admin/reset-password", replace: true });
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) navigate({ to: "/dapur-admin/dashboard", replace: true });
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleForgotPassword() {
    setError(null);
    setNotice(null);
    if (!email) {
      setError("Isi email dulu untuk menerima tautan atur ulang.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dapur-admin/reset-password`,
    });
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setNotice("Tautan atur ulang kata sandi sudah dikirim ke email Anda.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) {
      setError("Email atau kata sandi tidak cocok.");
      return;
    }
    navigate({ to: "/dapur-admin/dashboard", replace: true });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10 overflow-hidden">
      <ParticlesBackground />

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/20 bg-background/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 hover:bg-background/70 transition-colors duration-500 group">
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none"></div>
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 -z-10"></div>

        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Panel Pengelola
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masuk untuk mengelola konten Ikanbakar99.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5 group/input">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-border/50 bg-background/50 px-3 text-base text-foreground outline-none backdrop-blur-sm transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
            />
          </div>

          <div className="space-y-1.5 group/input">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary"
            >
              Kata sandi
            </label>
            <PasswordInput id="password" value={password} onChange={setPassword} required />
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive border border-destructive/20 animate-in slide-in-from-top-1 fade-in duration-300"
            >
              {error}
            </p>
          ) : null}

          {notice ? (
            <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-foreground border border-primary/20 animate-in slide-in-from-top-1 fade-in duration-300">
              {notice}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="group/btn relative h-12 w-full overflow-hidden rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/25 disabled:opacity-60 disabled:hover:shadow-none"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover/btn:translate-y-0"></div>
            <span className="relative">{busy ? "Memproses..." : "Masuk"}</span>
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-center text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Lupa kata sandi?
          </button>
        </form>
      </div>
    </main>
  );
}
