"use client"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-orange-600 mb-4">SORTEOS</h3>
            <p className="text-gray-400">
              La plataforma más confiable para participar en sorteos de premios increíbles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-orange-600 transition">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition">
                  Premios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition">
                  Ganadores
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-orange-600 transition">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition">
                  Aviso Legal
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Suscríbete para recibir actualizaciones</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
              <button className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition">
                Suscribir
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              © 2025 Sorteos Premium SAC. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 mt-4 md:mt-0">Hecho con ❤️ para ti</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
