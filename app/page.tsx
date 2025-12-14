"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

import HeroSlider from "@/components/hero-slider"
import CountdownSection from "@/components/countdown-section"
import PrizesSection from "@/components/prizes-section"
import WinnersSlider from "@/components/winners-slider"
import SocialSection from "@/components/social-section"
import Footer from "@/components/footer"

// --- COMPONENTE AUXILIAR PARA EL SCROLL ---
// Este componente se encarga solo de leer la URL
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

  return null
}

// --- COMPONENTE PRINCIPAL ---
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-primary-foreground">
      
      {/* AQUÍ ESTÁ LA SOLUCIÓN: Envolvemos el manejador en Suspense */}
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
