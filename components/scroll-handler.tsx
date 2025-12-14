// components/scroll-handler.tsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ScrollHandler() {
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