// app/layout.tsx
import "./globals.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Providers from "./providers";

export const metadata = {
  title: "Luh Educa",
  description: "Plataforma de educação online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <div className="flex h-dvh flex-col overflow-hidden">
            <Header />
            <div className="flex min-h-0 flex-1">
              <Sidebar />
              <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
