import { withAuth } from "next-auth/middleware";
import { IDLE_TIMEOUT_MS } from "@/lib/session-idle";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized: ({ token }) => {
      if (!token?.id) return false;
      const lastActivity = Number(token.lastActivity ?? 0);
      return lastActivity > 0 && Date.now() - lastActivity <= IDLE_TIMEOUT_MS;
    },
  },
});

export const config = {
  matcher: [
    /*
     * Público: home (/), quem-somos, login, register, api/auth e assets.
     * Demais rotas exigem autenticação (portal).
     */
    "/((?!$|quem-somos|login|register|api/auth|api/debug-db|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|gif|svg|ico|avif)$).*)",
  ],
};
