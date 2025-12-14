// app/page.tsx
import { Suspense } from "react"
import ScrollHandler from "@/components/scroll-handler"

import HeroSlider from "@/components/hero-slider"
import CountdownSection from "@/components/countdown-section"
import PrizesSection from "@/components/prizes-section"
import WinnersSlider from "@/components/winners-slider"
import SocialSection from "@/components/social-section"
import Footer from "@/components/footer"

// 👇 ESTA LÍNEA ES OBLIGATORIA PARA ARREGLAR EL ERROR DE BUILD
// Le dice a Next.js que construya la página al momento y no estática.
export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-primary-foreground">
      
      {/* El Suspense protege la lectura de parámetros de la URL */}
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>

      <HeroSlider />
      <CountdownSection />
      <PrizesSection />
      <WinnersSlider />
      <SocialSection />
      <Footer />
    </main>
  )
}