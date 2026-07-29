import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
});

export const config = {
  matcher: [
    /*
     * Protege toda a plataforma. Público apenas:
     * - /login, /register
     * - /api/auth/* (NextAuth)
     * - assets estáticos do Next
     */
    "/((?!login|register|api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
