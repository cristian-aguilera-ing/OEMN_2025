import React from 'react'; // <-- ¡AÑADE ESTA LÍNEA!
// (Necesitarás instalar react-icons: npm install react-icons)
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 py-12 text-center text-gray-500">
      <div className="flex justify-center space-x-6 mb-4">
        <a href="#" className="hover:text-indigo-600 transition-colors">
          <FaFacebookF size={24} />
        </a>
        <a href="#" className="hover:text-indigo-600 transition-colors">
          <FaInstagram size={24} />
        </a>
      </div>
      <p>NÜArt © {new Date().getFullYear()}. Todos los derechos reservados.</p>
    </footer>
  )
}