import type { Metadata } from "next";
import { Hanken_Grotesk, Open_Sans, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Shell } from "@/components/layout/shell";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Marketplace Agro — Agroinsumos regulados para Latinoamérica",
    template: "%s | Marketplace Agro",
  },
  description:
    "Plataforma B2B para compra, venta y cotización de fertilizantes, biológicos, herbicidas, fungicidas e insecticidas. Múltiples vendedores, productos regulados y asesoría agronómica.",
  keywords: [
    "agroinsumos",
    "fertilizantes",
    "herbicidas",
    "fungicidas",
    "marketplace agro",
    "B2B agricola",
    "latinoamerica",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL ?? "https://marketplace-agro.com",
  ),
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Marketplace Agro",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        hankenGrotesk.variable,
        openSans.variable,
        inter.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-on-surface)]">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
