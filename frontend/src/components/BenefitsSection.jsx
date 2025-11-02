import React from 'react';
import { motion } from 'framer-motion';
// (Necesitarás instalar react-icons: npm install react-icons)
import { FaGift, FaUsers, FaGraduationCap, FaLeaf } from 'react-icons/fa';

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
});

const benefits = [
  {
    icon: <FaGift size={32} />,
    title: 'NÜArt Points',
    desc: 'Acumula puntos con cada diseño y canjéalos por descuentos, productos exclusivos o envíos gratis. ¡Premiamos tu creatividad y fidelidad! ',
  },
  {
    icon: <FaGraduationCap size={32} />,
    title: 'Descuento Estudiante',
    desc: 'Sabemos que la vida de estudiante es un desafío. Presenta tu credencial y obtén un descuento especial en tus diseños.',
  },
  {
    icon: <FaLeaf size={32} />,
    title: 'Garantía y Sostenibilidad',
    desc: 'Tu diseño viene con packaging ecológico y garantía extendida. Ofrecemos servicio postventa para reparación o reciclaje.',
  },
];

export const BenefitsSection = () => {
  return (
    // Sección con un fondo gris claro para separarla
    <section id="comunidad" className="bg-gray-50 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.h2 variants={fadeIn()} className="text-5xl font-bold text-center mb-16 tracking-tight">
            Más que un Bolso, una Comunidad
          </motion.h2>
        </motion.div>

        {/* Grid de Beneficios */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-3 gap-10 mb-20"
        >
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeIn(index * 0.2)}
              className="flex items-start space-x-4 p-4"
            >
              <div className="flex-shrink-0 text-sky-500 mt-1">{item.icon}</div>
              <div>
                <h4 className="text-2xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sección de Redes Sociales */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn()}
          className="bg-gray-800 text-white p-12 rounded-lg flex flex-col md:flex-row items-center justify-between shadow-2xl"
        >
          <div>
            <h3 className="text-3xl font-bold mb-2">¡Únete a la Familia NÜArt!</h3>
            <p className="text-lg text-gray-300">
              Síguenos en redes para enterarte de promos, sorteos y nuevos lanzamientos.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <a
              href="#" // <-- Aquí va tu link de Instagram
              className="bg-sky-500 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-sky-600 transition-colors duration-300"
            >
              Seguir en Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};