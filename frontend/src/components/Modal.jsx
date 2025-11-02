import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Fondo Oscuro (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={onClose} // Cierra el modal si se hace clic fuera
          />

          {/* 2. Contenedor del Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* 3. Panel de Contenido */}
            <div 
              className="relative w-full max-w-lg rounded-xl bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal lo cierre
            >
              {/* 4. Encabezado del Modal */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  {/* Icono de "X" para cerrar */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 5. Contenido (aquí va el formulario o el carrito) */}
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};