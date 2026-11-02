import "./globals.css";
import { Figtree, Fraunces } from "next/font/google";
import AppShell from "./AppShell";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://www.luheducacional.com.br";
const title = "LUH Educa";
const description =
  "Assessoria educacional especializada com o método LUH Educa.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/logo-luh.png",
        width: 577,
        height: 521,
        alt: "Logo LUH Educa",
      },
    ],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/logo-luh.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
