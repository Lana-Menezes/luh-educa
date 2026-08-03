import "./globals.css";
import { Figtree, Syne } from "next/font/google";
import Providers from "./providers";
import AppShell from "./AppShell";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Luh Educa | Consultoria em TRI",
  description:
    "Consultoria especializada na implementação da Teoria de Resposta ao Item com o método Luh Educa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
