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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.verifai.anshbhatt.space";
const siteTitle = "VerifAI - Placement Intelligence for College TPOs";
const siteDescription =
  "Cross-verify student resumes, marksheets, GitHub, and coding evidence into explainable candidate shortlists.";
const ogImage = {
  url: "/og-image.png",
  width: 1280,
  height: 640,
  alt: "VerifAI - placement intelligence, verified. AI-ranked candidate shortlists for college TPOs.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "VerifAI",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage.url],
  },
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
