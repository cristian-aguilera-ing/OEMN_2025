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
  { name: 'Jean y Cuero', img: '/img/mi-diseno3.png' },
  { name: 'Jean y Cuero', img: '/img/mi-diseno4.png' },
  { name: 'Flor de Ciruelo', img: '/img/mi-diseno1.png' },
  { name: 'Todo Cuero', img: '/img/mi-diseno5.png' },
  { name: 'Jean y Textura Gris', img: '/img/mi-diseno9.png' },
  { name: 'Jean', img: '/img/fondo1.png' },
  { name: 'Jean y Mariposas', img: '/img/mi-diseno6.png' },
  { name: 'Todo Rosa', img: '/img/mi-diseno8.png' },
  
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
          <strong>¡Diseñá, creá y destacá con NÜArt!</strong> <br/>
          Tu estilo no se copia, se diseña. En NÜArt transformamos mochilas y bolsos en piezas únicas hechas a tu medida. Elegí colores, texturas y detalles que hablen de vos.
      </motion.p>
      <motion.p variants={fadeInY} className="text-lg text-gray-700 text-justify mb-12">
        Hecho con pasión local y conciencia ambiental, cada pieza es una mezcla perfecta de diseño, innovación y sostenibilidad.<br></br>
        <strong>Mostrá quién sos. Cargá tu mundo con identidad.</strong>
      </motion.p>
      {/* --- FIN DEL TEXTO REESCRITO --- */}

      <motion.h3 variants={fadeInY} className="text-2xl font-semibold mb-6">
        Algunos diseños creados por nuestros clientes:
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