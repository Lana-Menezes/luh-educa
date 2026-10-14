"use client";

import { useState } from "react";
import { Instagram, Linkedin, Mail, Send } from "lucide-react";
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  containsEmoji,
  normalizeEmail,
  rejectEmojiInput,
  stripEmojis,
} from "@/lib/auth-validation";

const MESSAGE_MAX_LENGTH = 1000;
const SCHOOL_MAX_LENGTH = 120;

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/luh.educacional/",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/luciana-souza-963351a3/",
    icon: Linkedin,
  },
] as const;


type FormState = {
  name: string;
  email: string;
  school: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  school: "",
  message: "",
};

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: stripEmojis(value) }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const name = form.name.trim();
    const email = normalizeEmail(form.email);
    const school = form.school.trim();
    const message = form.message.trim();

    setError(null);

    if (!name || !email || !school || !message) {
      setError("Preencha todos os campos.");
      return;
    }

    if (
      containsEmoji(name) ||
      containsEmoji(email) ||
      containsEmoji(school) ||
      containsEmoji(message)
    ) {
      setError("Os campos não podem conter emojis.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Informe um e-mail válido.");
      return;
    }

    setPending(true);

    try {
      // Placeholder até integração com backend/e-mail.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSent(true);
      setForm(initialForm);
    } catch {
      setError("Não foi possível enviar agora. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contato" className="border-t border-gray-200 bg-[#f4f6ff]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Entre em contato
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Vamos conversar sobre a <br /> recomposição na sua rede.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-600">
              Conte um pouco sobre a sua escola ou rede e o momento avaliativo atual.
              Retornamos para alinhar o próximo passo da assessoria LUH.
            </p>
          </div>

          <div className="shrink-0 space-y-5 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand ring-1 ring-brand-muted/60">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-gray-900">E-mail</p>
                <a
                  href="mailto:lucianamenezessouza@outlook.com"
                  className="mt-1 inline-block text-brand hover:underline"
                >
                 lucianamenezessouza@outlook.com
                </a>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Nos acompanhe Online</p>
              <div className="mt-3 flex items-center gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand ring-1 ring-brand-muted/60 transition hover:bg-brand hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
