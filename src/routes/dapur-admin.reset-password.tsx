import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PasswordInput } from "@/components/PasswordInput";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dapur-admin/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Atur Ulang Kata Sandi — Ikanbakar99" },
      { name: "description", content: "Halaman atur ulang kata sandi pengelola Ikanbakar99." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Atur Ulang Kata Sandi — Ikanbakar99" },
      { property: "og:description", content: "Halaman atur ulang kata sandi pengelola." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  // Supabase returns the recovery tokens in the URL hash.
  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
        history.replaceState(null, "", window.location.pathname);
      }

      const { data } = await supabase.auth.getUser();
      if (!active) return;
      setHasSession(Boolean(data.user));
      setReady(true);
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/dapur-admin/dashboard", replace: true }), 1200);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-lift sm:p-8">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Atur Ulang Kata Sandi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masukkan kata sandi baru untuk akun pengelola.
          </p>
        </header>

        {!ready ? (
          <p className="text-sm text-muted-foreground">Memeriksa tautan…</p>
        ) : !hasSession ? (
          <div className="space-y-4">
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Tautan tidak valid atau sudah kedaluwarsa. Minta tautan reset baru lalu buka kembali
              halaman ini.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/dapur-admin" })}
              className="h-12 w-full rounded-lg border border-border text-base font-semibold text-foreground transition hover:bg-muted"
            >
              Kembali ke halaman masuk
            </button>
          </div>
        ) : done ? (
          <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-foreground">
            Kata sandi berhasil diperbarui. Mengalihkan ke dasbor…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="block text-sm font-medium text-foreground">
                Kata sandi baru
              </label>
              <PasswordInput
                id="new-password"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-foreground"
              >
                Ulangi kata sandi baru
              </label>
              <PasswordInput
                id="confirm-password"
                value={confirm}
                onChange={setConfirm}
                autoComplete="new-password"
                required
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? "Menyimpan…" : "Simpan kata sandi"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
