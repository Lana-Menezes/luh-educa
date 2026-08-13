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
    href: "https://instagram.com/luheduca",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/luheduca",
    icon: Linkedin,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/5500000000000",
    icon: WhatsAppIcon,
  },
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-16 md:grid-cols-2 md:gap-14 md:px-8 md:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Entre em contato
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Vamos conversar sobre a recomposição na sua rede.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Conte um pouco sobre a escola ou rede e o momento avaliativo atual.
            Retornamos para alinhar o próximo passo da consultoria LUH.
          </p>

          <div className="mt-8 space-y-5 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand ring-1 ring-brand-muted/60">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-gray-900">E-mail</p>
                <a
                  href="mailto:contato@luheduca.com.br"
                  className="mt-1 inline-block text-brand hover:underline"
                >
                  contato@luheduca.com.br
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

        <div className="rounded-2xl border border-brand-muted/50 bg-white p-6 shadow-sm md:p-8">
          {sent ? (
            <div className="flex min-h-[280px] flex-col items-start justify-center">
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-900">
                Mensagem enviada
              </p>
              <p className="mt-3 leading-relaxed text-gray-600">
                Recebemos seu contato. Em breve a equipe Luh Educa retorna.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={NAME_MAX_LENGTH}
                  disabled={pending}
                  value={form.name}
                  onBeforeInput={rejectEmojiInput}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-gray-50"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  E-mail
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  maxLength={EMAIL_MAX_LENGTH}
                  disabled={pending}
                  value={form.email}
                  onBeforeInput={rejectEmojiInput}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-gray-50"
                  placeholder="voce@escola.com.br"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-school"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Escola ou rede
                </label>
                <input
                  id="contact-school"
                  name="school"
                  type="text"
                  required
                  maxLength={SCHOOL_MAX_LENGTH}
                  disabled={pending}
                  value={form.school}
                  onBeforeInput={rejectEmojiInput}
                  onChange={(event) =>
                    updateField("school", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-gray-50"
                  placeholder="Nome da escola ou rede"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Mensagem
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  maxLength={MESSAGE_MAX_LENGTH}
                  disabled={pending}
                  value={form.message}
                  onBeforeInput={rejectEmojiInput}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-gray-50"
                  placeholder="Como podemos ajudar?"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                aria-busy={pending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-80"
              >
                {pending ? (
                  <span
                    aria-hidden
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  />
                ) : (
                  <Send className="h-4 w-4" aria-hidden />
                )}
                {pending ? "Enviando..." : "Enviar mensagem"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
