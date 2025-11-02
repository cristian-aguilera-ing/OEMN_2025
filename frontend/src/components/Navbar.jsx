import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Importa los componentes de modal
import { Modal } from './Modal';
import { LoginForm } from './LoginForm';
import { CartView } from './CartView';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado del menú móvil
  
  // Estados para los modales
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
  // Añadido el enlace a la sección de beneficios
  const navItems = [
    { name: 'Nosotros', path: '/#nosotros' },
    { name: 'Personaliza', path: '/#personaliza' },
    { name: 'Beneficios', path: '/#comunidad' }, // <-- NUEVA LÍNEA AÑADIDA
    { name: 'Contáctanos', path: '/#contactanos' },
  ];
  // --- FIN DEL CAMBIO ---

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* --- Logo (Sin cambios) --- */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-white font-bold text-2xl tracking-wider"
                onClick={() => window.scrollTo(0, 0)}
              >
                NÜArt
              </Link>
            </div>
            
            {/* --- Links de Escritorio (Se actualiza solo) --- */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* --- Botones de Escritorio (Login/Carrito) --- */}
            <div className="hidden md:flex items-center space-x-2 ml-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="p-2 rounded-full text-gray-300 hover:text-white transition-colors"
                title="Iniciar Sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-full text-gray-300 hover:text-white transition-colors"
                title="Ver Carrito"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>

            {/* --- Botón de Hamburguesa (Móvil) --- */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              >
                <span className="text-2xl">{isOpen ? '×' : '≡'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* --- Menú móvil (Se actualiza solo) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-black shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Links de navegación móvil */}
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </a>
              ))}
              
              {/* Botones de móvil (Login/Carrito) */}
              <div className="pt-2 mt-2 border-t border-gray-700">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Iniciar Sesión
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
Ciòe
                    setIsCartOpen(true);
                  }}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Carrito
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* --- Modales (Sin cambios) --- */}
      <Modal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        title="Iniciar Sesión"
      >
        <LoginForm />
      </Modal>

      <Modal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        title="Mi Carrito"
      >
        <CartView />
      </Modal>
    </>
  );
};