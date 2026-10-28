"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  hasAuthFieldErrors,
  normalizeEmail,
  readPassword,
  rejectEmojiInput,
  safeInternalPath,
  stripEmojis,
  validateLoginCredentials,
} from "@/lib/auth-validation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const formData = new FormData(event.currentTarget);
    const email = normalizeEmail(formData.get("email"));
    const password = readPassword(formData.get("password"));
    const nextErrors = validateLoginCredentials(email, password);

    setFieldErrors(nextErrors);
    setError(null);

    if (hasAuthFieldErrors(nextErrors)) {
      return;
    }

    setPending(true);

    try {
      const callbackUrl = safeInternalPath(searchParams.get("callbackUrl"));
      const response = await signIn("credentials", {
        email,
        password,
        company: String(formData.get("company") ?? ""),
        redirect: false,
        callbackUrl,
      });

      if (!response || response.error) {
        setError("Credenciais inválidas. Verifique os dados e tente novamente.");
        setPending(false);
        return;
      }

      router.push(safeInternalPath(response.url) || callbackUrl);
      router.refresh();
    } catch {
      setError("Não foi possível acessar agora. Tente novamente.");
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-[#eef1ff] py-12 px-4 sm:px-6 lg:px-8">
      {pending && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-sm"
        >
          <span
            aria-hidden
            className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent"
          />
          <span className="text-sm font-medium text-gray-700">Acessando...</span>
        </div>
      )}
      <div className="w-full max-w-md space-y-8">
        <div>
          <Image
            src="/logo-luh.png"
            alt="Logo LUH Educa"
            width={577}
            height={521}
            priority
            className="mx-auto h-32 w-auto"
          />
          <h2 className="mt-6 text-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900">
            Acesse o Portal LUH Educa
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company">Empresa</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="-space-y-px rounded-md shadow-xs">
            <div>
              <label htmlFor="email" className="sr-only">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                maxLength={EMAIL_MAX_LENGTH}
                disabled={pending}
                onBeforeInput={rejectEmojiInput}
                onChange={(event) => {
                  event.target.value = stripEmojis(event.target.value);
                }}
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand focus:outline-hidden focus:ring-brand disabled:bg-gray-100 sm:text-sm"
                placeholder="E-mail"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  maxLength={PASSWORD_MAX_LENGTH}
                  disabled={pending}
                  onBeforeInput={rejectEmojiInput}
                  onChange={(event) => {
                    event.target.value = stripEmojis(event.target.value);
                  }}
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand focus:outline-hidden focus:ring-brand disabled:bg-gray-100 sm:text-sm"
                  placeholder="Senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={pending}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute inset-y-0 right-0 z-20 flex items-center px-3 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {(fieldErrors.email || fieldErrors.password || error) && (
            <div
              role="alert"
              aria-live="polite"
              className="text-center text-sm text-danger"
            >
              {fieldErrors.email || fieldErrors.password || error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              className="group relative flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-80"
            >
              {pending && (
                <span
                  aria-hidden
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                />
              )}
              {pending ? "Acessando..." : "Acessar"}
            </button>
          </div>
        </form>
        {/* <div className="text-center">
          <Link href="/register" className="text-brand hover:underline">
            Não tem uma conta? Criar conta
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 items-center justify-center bg-[#eef1ff] text-sm text-gray-500">
          Carregando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
