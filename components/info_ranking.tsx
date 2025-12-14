"use client"

import { useEffect, useState } from "react"

// Componente individual para cada Contador (Maneja la animación)
const CounterItem = ({ end, label, suffix = "+" }: { end: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Lógica simple de animación de conteo
    let start = 0
    const duration = 2000 // 2 segundos
    const incrementTime = (duration / end) * 1000

    // Si el número es muy grande, ajustamos el incremento para que no sea lento
    const step = end > 100 ? Math.ceil(end / 100) : 1
    
    const timer = setInterval(() => {
      start += step
      if (start > end) {
        start = end
        clearInterval(timer)
      }
      setCount(start)
    }, 20) // Velocidad de actualización

    return () => clearInterval(timer)
  }, [end])

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-4xl md:text-5xl font-extrabold text-yellow-500 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-300 font-medium uppercase tracking-wider text-sm md:text-base text-center">
        {label}
      </div>
    </div>
  )
}

export default function InfoRanking() {
  return (
    // Sección con fondo oscuro e imagen de fondo simulada (Overlay)
    <section className="relative w-full py-20 bg-gray-900 overflow-hidden">
      
      
      {/* Contenedor principal */}
      <div className="container relative mx-auto px-4 z-10">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-700">
          
          {/* 1. Register Members */}
          <CounterItem end={105} label="Miembros Registrados" />

          {/* 2. Played Poker Today */}
          <CounterItem end={26} label="sE UNIERON HOY" />

          {/* 3. Total Winners */}
          <CounterItem end={30} label="TOTAL DE GANADORES" />

          {/* 4. Today Winners */}
          <CounterItem end={2} label="GANADORES DEL MES" />

        </div>
      </div>
    </section>
  )
}