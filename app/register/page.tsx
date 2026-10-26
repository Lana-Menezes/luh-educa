"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { registerUser } from "./actions";
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  hasAuthFieldErrors,
  normalizeEmail,
  readPassword,
  rejectEmojiInput,
  stripEmojis,
  validateRegisterCredentials,
} from "@/lib/auth-validation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = normalizeEmail(formData.get("email"));
    const password = readPassword(formData.get("password"));
    const confirmPassword = readPassword(formData.get("confirmPassword"));
    const fieldErrors = validateRegisterCredentials(
      name,
      email,
      password,
      confirmPassword,
    );

    setError(null);

    if (hasAuthFieldErrors(fieldErrors)) {
      setError(
        fieldErrors.name ||
          fieldErrors.email ||
          fieldErrors.password ||
          fieldErrors.confirmPassword ||
          "Dados inválidos",
      );
      return;
    }

    setPending(true);

    try {
      const result = await registerUser(formData);
      if (result.error) {
        setError(result.error);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Conta criada, mas o acesso falhou. Tente entrar novamente.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Falha no cadastro");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900">
            Crie sua conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="-space-y-px rounded-md shadow-xs">
            <div>
              <label htmlFor="name" className="sr-only">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={NAME_MAX_LENGTH}
                disabled={pending}
                onBeforeInput={rejectEmojiInput}
                onChange={(event) => {
                  event.target.value = stripEmojis(event.target.value);
                }}
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand focus:outline-hidden focus:ring-brand disabled:bg-gray-100 sm:text-sm"
                placeholder="Nome completo"
              />
            </div>
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
                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand focus:outline-hidden focus:ring-brand disabled:bg-gray-100 sm:text-sm"
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
                  required
                  autoComplete="new-password"
                  maxLength={PASSWORD_MAX_LENGTH}
                  disabled={pending}
                  onBeforeInput={rejectEmojiInput}
                  onChange={(event) => {
                    event.target.value = stripEmojis(event.target.value);
                  }}
                  className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand focus:outline-hidden focus:ring-brand disabled:bg-gray-100 sm:text-sm"
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
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  maxLength={PASSWORD_MAX_LENGTH}
                  disabled={pending}
                  onBeforeInput={rejectEmojiInput}
                  onChange={(event) => {
                    event.target.value = stripEmojis(event.target.value);
                  }}
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand focus:outline-hidden focus:ring-brand disabled:bg-gray-100 sm:text-sm"
                  placeholder="Confirmar senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  disabled={pending}
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                  className="absolute inset-y-0 right-0 z-20 flex items-center px-3 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div role="alert" className="text-center text-sm text-danger">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Criando conta..." : "Criar conta"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link href="/login" className="text-brand hover:underline">
            Já possui uma conta? Acessar
          </Link>
        </div>
      </div>
    </div>
  );
}
