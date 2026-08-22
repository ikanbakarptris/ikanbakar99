import { useState } from "react";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete = "current-password",
  required,
  placeholder,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-lg border border-input bg-background px-3 pr-20 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        aria-pressed={visible}
        className="absolute right-1.5 top-1.5 h-9 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        {visible ? "Sembunyikan" : "Lihat"}
      </button>
    </div>
  );
}
