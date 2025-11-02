import React from 'react'; 
// (Necesitarás instalar react-icons: npm install react-icons)
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 py-12 text-center text-gray-500">
      
      {/* --- TEXTO AÑADIDO --- */}
      <h4 className="text-lg font-semibold text-gray-700 mb-3">
        Síguenos y sé parte de la comunidad
      </h4>
      {/* --- FIN DE TEXTO AÑADIDO --- */}

      <div className="flex justify-center space-x-6 mb-4">
        <a href="#" className="hover:text-sky-500 transition-colors">
          <FaFacebookF size={24} />
        </a>
        <a href="#" className="hover:text-sky-500 transition-colors">
          <FaInstagram size={24} />
        </a>
      </div>
      <p>NÜArt © {new Date().getFullYear()}. Todos los derechos reservados.</p>
    </footer>
  )
}