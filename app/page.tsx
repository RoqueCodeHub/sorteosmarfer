"use client"

import { useState, useEffect, Suspense } from "react" // 1. Importamos Suspense
import { useSearchParams } from "next/navigation"

import HeroSlider from "@/components/hero-slider"
import CountdownSection from "@/components/countdown-section"
import PrizesSection from "@/components/prizes-section"
import WinnersSlider from "@/components/winners-slider"
import SocialSection from "@/components/social-section"
import Footer from "@/components/footer"

// 2. Creamos este componente pequeño solo para manejar el Scroll
function ScrollHandler() {
  const searchParams = useSearchParams()
  const scrollTarget = searchParams.get("scroll")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && scrollTarget) {
      const element = document.getElementById(scrollTarget)
      if (element) {
        setTimeout(() => {
          const headerHeight = 80
          const elementPosition = element.getBoundingClientRect().top + window.scrollY
          window.scrollTo({
            top: elementPosition - headerHeight,
            behavior: "smooth",
          })
        }, 300)
      }
    }
  }, [mounted, scrollTarget])

  return null // Este componente no dibuja nada, solo hace lógica
}

// 3. Tu componente Home queda limpio y protegido con Suspense
export default function Home() {
  // Nota: He quitado el "if (!mounted) return null" del Home principal
  // para que tu página tenga mejor SEO y se vea contenido inmediatamente.

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-primary-foreground">
      
      {/* Aquí envolvemos la lógica que lee la URL */}
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