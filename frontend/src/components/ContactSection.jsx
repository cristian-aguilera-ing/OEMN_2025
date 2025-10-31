import React from 'react'; // <-- ¡AÑADE ESTA LÍNEA!
import { motion } from 'framer-motion';
import { ContactForm } from './ContactForm';
// Usamos texto simple en lugar de íconos
// Si quieres los íconos, tendrías que instalar @heroicons/react

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
});

export const ContactSection = () => {
  return (
    <section id="contactanos" className="max-w-4xl mx-auto py-24 px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.h2 variants={fadeIn()} className="text-5xl font-bold text-center mb-3 tracking-tight">
          CONTÁCTANOS
        </motion.h2>
        <motion.p variants={fadeIn(0.2)} className="text-xl text-gray-500 text-center mb-16 italic">
          Si tienes dudas, no dudes en escribir
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn(0.4)}
        >
          <h3 className="text-2xl font-semibold mb-6">Información de Contacto</h3>
          <div className="space-y-4 text-lg text-gray-700">
            <p className="flex items-center">
              <span className="text-indigo-600 mr-3">📍</span>
              San Salvador de Jujuy, Argentina
            </p>
            <p className="flex items-center">
              <span className="text-indigo-600 mr-3">📞</span>
              +54 0388 416 2648
            </p>
            <p className="flex items-center">
              <span className="text-indigo-600 mr-3">✉️</span>
              nuart@design.com
            </p>
          </div>
        </motion.div>
        <ContactForm />
      </div>
    </section>
  );
};