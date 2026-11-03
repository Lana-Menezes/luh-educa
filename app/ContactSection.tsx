"use client";

import { useState } from "react";
import { Instagram, Linkedin, Mail } from "lucide-react";
import {
  containsEmoji,
  normalizeEmail,
  stripEmojis,
} from "@/lib/auth-validation";
import { Container, IconTile, SectionHeading, SocialIconLink } from "@/components/ui";

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
      <Container className="py-16 md:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Entre em contato"
            title={
              <>
                Vamos conversar sobre a <br /> recomposição na sua rede.
              </>
            }
            description="Conte um pouco sobre a sua escola ou rede e o momento avaliativo atual. Retornamos para alinhar o próximo passo da assessoria LUH."
            descriptionClassName="max-w-md"
          />

          <div className="shrink-0 space-y-5 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <IconTile shape="square" tone="white">
                <Mail className="h-5 w-5" aria-hidden />
              </IconTile>
              <div>
                <p className="font-semibold text-gray-900">E-mail</p>
                <a
                  href="mailto:contato@luheducacional.com.br"
                  className="mt-1 inline-block text-brand hover:underline"
                >
                 contato@luheducacional.com.br
                </a>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Nos acompanhe Online</p>
              <div className="mt-3 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <SocialIconLink key={social.label} {...social} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
