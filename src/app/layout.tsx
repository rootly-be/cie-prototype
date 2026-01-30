import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import { APP_NAME } from "@/lib/config";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar, Footer } from "@/components/layout";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Centre d'Initiation à l'Environnement d'Enghien",
};

// FOUC prevention script - runs before React hydration
// Uses documentElement (html) since body may not exist yet when script in head executes
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (stored === 'system' && prefersDark) || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark-mode');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
