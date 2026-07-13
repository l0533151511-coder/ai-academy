import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { AIMentorWidget } from "@/components/mentor/ai-mentor-widget";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const SITE_URL = "https://ai-academy-three-olive.vercel.app";
const SITE_TITLE = "אקדמיית AI | ללמוד לבנות בינה מלאכותית אמיתית";
const SITE_DESCRIPTION =
  "האקדמיה המקצועית ללימוד הנדסת AI מאפס עד production — מבוססת פרויקטים, בעברית מלאה. Claude Code, Prompt Engineering, MCP, RAG, Agents ובניית מוצרי AI מסחריים.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | אקדמיית AI" },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "אקדמיית AI",
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B1120",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          דלג לתוכן הראשי
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SiteHeader />
          <main id="main-content" className="flex-1 flex flex-col">
            {children}
          </main>
          <AIMentorWidget />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
