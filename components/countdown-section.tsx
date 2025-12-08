"use client"

import { useState, useEffect } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date("2025-12-31").getTime()
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-orange-600 text-white rounded-lg p-4 md:p-6 min-w-20 md:min-w-24 flex items-center justify-center">
        <span className="text-3xl md:text-4xl font-bold">{String(value).padStart(2, "0")}</span>
      </div>
      <p className="text-black font-semibold mt-2 text-sm md:text-base">{label}</p>
    </div>
  )

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-black mb-4">No te pierdas esta oportunidad única</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">EL SORTEO EMPIEZA EN</p>

        <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
          <TimeBox value={timeLeft.days} label="Días" />
          <TimeBox value={timeLeft.hours} label="Horas" />
          <TimeBox value={timeLeft.minutes} label="Minutos" />
          <TimeBox value={timeLeft.seconds} label="Segundos" />
        </div>
      </div>
    </section>
  )
}
