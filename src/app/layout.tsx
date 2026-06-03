import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "Currículo Interativo UFSC",
  title: "Currículo Interativo UFSC",
  description: "Visualizador interativo de currículos dos cursos de Engenharia da UFSC",
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
    <html lang="pt-BR" className={`${geist.className} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
