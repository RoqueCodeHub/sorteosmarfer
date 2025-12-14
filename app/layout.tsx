import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react"; // <--- Importamos Suspense
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SocialSection from "@/components/social-section";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sorteos Marfer",
  description: "Participa y gana grandes premios",
};

// 👇 ESTA LÍNEA ES LA SOLUCIÓN DEFINITIVA.
// Le dice a Next.js: "No intentes construir esto estático, hazlo al momento".
// Esto elimina el error de useSearchParams en el Header/Footer.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {/* Envolvemos el Header en Suspense por seguridad */}
        <Suspense fallback={<div className="h-20 bg-black" />}>
          <Header />
        </Suspense>

        <main className="min-h-screen">{children}</main>

        <SocialSection />
        <Footer />
      </body>
    </html>
  );
}