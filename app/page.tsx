// app/page.tsx
import { Suspense } from "react"
import ScrollHandler from "@/components/scroll-handler" // Importamos el componente nuevo

import HeroSlider from "@/components/hero-slider"
import CountdownSection from "@/components/countdown-section"
import PrizesSection from "@/components/prizes-section"
import WinnersSlider from "@/components/winners-slider"
import SocialSection from "@/components/social-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-primary-foreground">
      
      {/* El Suspense ahora funcionará correctamente porque ScrollHandler está en su propio archivo */}
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