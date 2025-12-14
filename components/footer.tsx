"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contenedor centrado */}
        {/* Contenedor centrado */}
<div className="mb-8 flex justify-center text-center">
  <div className="max-w-xl">
    <h3 className="text-2xl font-bold text-orange-600 mb-4">
      SORTEOS
    </h3>
    <p className="text-gray-400">
      La plataforma más confiable para participar en sorteos de premios increíbles.
    </p>
  </div>
</div>


        {/* Pie de página centrado */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-400 text-center">
              © 2025 Sorteos Premium IMPORT'S & Multiservices MC E.I.R.L. Todos los derechos reservados.
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}
