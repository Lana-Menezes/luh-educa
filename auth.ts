import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {
  hasAuthFieldErrors,
  normalizeEmail,
  readPassword,
  validateLoginCredentials,
} from "@/lib/auth-validation";
import {
  clearLoginFailures,
  clientIpFromHeaders,
  getLoginRateLimitKey,
  isLoginRateLimited,
  registerLoginFailure,
} from "@/lib/login-rate-limit";

const isProduction = process.env.NODE_ENV === "production";
const dummyHash = bcrypt.hash(
  "luh-educa-timing-dummy",
  10,
);

async function passwordsMatch(password: string, hash: string) {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export const authOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 30,
  },
  useSecureCookies: isProduction,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
        company: { label: "Empresa", type: "text" },
      },
      async authorize(credentials, req) {
        const email = normalizeEmail(credentials?.email);
        const password = readPassword(credentials?.password);
        const honeypot = String(credentials?.company ?? "").trim();
        const ip = clientIpFromHeaders(req.headers ?? {});
        const rateLimitKey = getLoginRateLimitKey(ip, email);

        if (isLoginRateLimited(rateLimitKey)) {
          return null;
        }

        if (
          honeypot ||
          hasAuthFieldErrors(validateLoginCredentials(email, password))
        ) {
          registerLoginFailure(rateLimitKey);
          await passwordsMatch(password || "invalid", await dummyHash);
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, password: true },
        });

        const hash = user?.password ?? (await dummyHash);
        const isCorrectPassword = await passwordsMatch(password, hash);

        if (!user || !isCorrectPassword) {
          registerLoginFailure(rateLimitKey);
          return null;
        }

        clearLoginFailures(rateLimitKey);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, id: token.id ?? user?.id };
    },
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.id } };
    },
  },
} satisfies NextAuthOptions;
