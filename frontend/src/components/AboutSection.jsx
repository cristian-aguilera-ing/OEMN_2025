import React from 'react';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInY = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const designs = [
  { name: 'Franco Colapinto', img: '/img/mi-diseno2.png' },
  { name: 'Valentina', img: '/img/mi-diseno3.png' },
  { name: 'Matero', img: '/img/mi-diseno4.png' },
  { name: 'Mochila Mujer', img: '/img/mi-diseno1.png' },
];

export const AboutSection = () => {
  return (
    <motion.section
      id="nosotros"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="max-w-4xl mx-auto py-24 px-6 text-center"
    >
      <motion.h2 variants={fadeInY} className="text-5xl font-bold tracking-tight">NÜArt</motion.h2>
      <motion.p variants={fadeInY} className="text-xl text-gray-500 mt-2 mb-8 italic">
        Mochilas y bolsos personalizados
      </motion.p>
      
      {/* --- TEXTO REESCRITO CON TU "POR QUÉ"  --- */}
      <motion.p variants={fadeInY} className="text-lg text-gray-700 text-justify mb-4">
        En NÜArt creemos que cada persona tiene una historia que contar y una forma única de expresarse. No vendemos solo bolsos; ofrecemos un lienzo para tu identidad. Nuestra misión es transformar objetos cotidianos en una extensión de tu esencia, permitiendo que lleves tu autenticidad en cada detalle.
      </motion.p>
      <motion.p variants={fadeInY} className="text-lg text-gray-700 text-justify mb-12">
        Buscamos inspirar creatividad y conciencia ambiental, demostrando que la moda puede ser personal, innovadora y sostenible. Combinamos diseño de calidad, producción local y una experiencia digital única para que tu estilo cobre vida.
      </motion.p>
      {/* --- FIN DEL TEXTO REESCRITO --- */}

      <motion.h3 variants={fadeInY} className="text-2xl font-semibold mb-6">
        Algunos diseños creados por nuestro equipo:
      </motion.h3>

      <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
        {designs.map((design) => (
          <motion.div variants={fadeInY} key={design.name} className="text-center">
            <img
              src={design.img}
              alt={design.name}
              className="w-full h-80 object-cover rounded-lg shadow-lg mb-3"
            />
            <p className="text-lg font-medium">{design.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};