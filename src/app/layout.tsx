import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "Curriculo Interativo UFSC",
  title: "Curriculo Interativo UFSC - Engenharia de Producao",
  description: "Visualizador interativo do curriculo do curso de Engenharia de Producao da UFSC (2023.1)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (() => {
      try {
        const stored = localStorage.getItem("curriculo-theme");
        const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const resolved = stored === "light" || stored === "dark" ? stored : (dark ? "dark" : "light");
        document.documentElement.dataset.theme = resolved;
        document.documentElement.dataset.themeChoice = resolved;
      } catch {
        document.documentElement.dataset.theme = "light";
        document.documentElement.dataset.themeChoice = "light";
      }
    })();
  `;

  return (
    <html lang="pt-BR" className={geist.className} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
