// app/page.tsx
import { Suspense } from "react"
import ScrollHandler from "@/components/scroll-handler"

import HeroSlider from "@/components/hero-slider"
import CountdownSection from "@/components/countdown-section"
import PrizesSection from "@/components/prizes-section"
import WinnersSlider from "@/components/winners-slider"
import SocialSection from "@/components/social-section"
import Footer from "@/components/footer"

// 👇 ESTA ES LA LÍNEA CLAVE. SI NO ESTÁ, EL BUILD FALLA.
export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-primary-foreground">
      
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