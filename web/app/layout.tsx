import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PaletteProvider } from "@/components/theme/palette-context";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VerifAI - Placement Intelligence for College TPOs",
  description: "Cross-verify student resumes, marksheets, GitHub, and coding evidence into explainable candidate shortlists.",
};

const themeInitScript = `
  try {
    const p = localStorage.getItem('verifai-palette') || 'light';
    document.documentElement.setAttribute('data-palette', p);
    if (p === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <PaletteProvider>
          {children}
          <Toaster position="top-right" />
        </PaletteProvider>
      </body>
    </html>
  );
}
