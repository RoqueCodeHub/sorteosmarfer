"use client"

import { use } from "react"
import Image from "next/image"
import CountdownSection from "@/components/countdown-section"
import RegistroSection from "@/components/payment-section"

export default function EventoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  // Mapeamos el slug a la imagen correspondiente (usando rutas públicas)
  const imagenes: Record<string, string> = {
    "chapa-tu-fono": "/phone17.png",
    "chapa-tu-moto": "/yamaha-mt-09-motorcycle.jpg",
  }

  const imagenEvento = imagenes[slug] || "/phone17.png"

  return (
    <main className="min-h-screen bg-white">
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-black">
        <Image
          src={imagenEvento}
          alt={`Imagen del evento ${slug}`}
          fill
          className="object-cover opacity-60"
          priority
        />
        <h1 className="text-white text-5xl font-bold z-10 capitalize drop-shadow-lg">
          {slug.replace(/-/g, " ")}
        </h1>
      </section>

      <CountdownSection />
      <RegistroSection />
    </main>
  )
}
