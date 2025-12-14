"use client"

import { use } from "react"
import Image from "next/image"

// Importamos los componentes
import CountdownSection from "@/components/countdown-section"
import RegistroSection from "@/components/payment-section"

export default function EventoPage({ params }: { params: Promise<{ slug: string }> }) {
  // Desempaquetamos los params (Next.js 15+)
  const { slug } = use(params)

  // Mapeamos el slug a la imagen correspondiente
  const imagenes: Record<string, string> = {
    "chapa-tu-fono": "/phone17.png",
    "chapa-tu-moto": "/yamaha-mt-09-motorcycle.jpg",
  }

  const imagenEvento = imagenes[slug] || "/phone17.png"

  return (
    <main className="min-h-screen bg-white">
      
      {/* SECCIÓN HERO (Imagen y Título) */}
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-black">
        <Image
          src={imagenEvento}
          alt={`Imagen del evento ${slug}`}
          fill
          className="object-cover opacity-60"
          priority
        />
        <h1 className="text-white text-4xl md:text-6xl font-bold z-10 capitalize drop-shadow-lg text-center px-4">
          {slug.replace(/-/g, " ")}
        </h1>
      </section>

      {/* CONTADOR */}
      <CountdownSection />

      {/* BUSCADOR DE TICKET */}
      {/* Lo colocamos aquí para que el usuario pueda verificar si ya participa */}
      

      {/* SECCIÓN DE REGISTRO / PAGO */}
      <RegistroSection />
      
    </main>
  )
}