import React from 'react'; // <-- ¡AÑADE ESTA LÍNEA!
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
  { name: 'Girly back🌸', img: 'https://i.pinimg.com/736x/4f/62/f6/4f62f66e63851259dee6116f10d1bfdb.jpg' },
  { name: 'Casual🎮', img: 'https://i.pinimg.com/1200x/fb/c9/9e/fbc99e160718e5d0d127351a75fda8b2.jpg' },
  { name: 'Woman Bag', img: 'https://i.pinimg.com/736x/f6/fd/17/f6fd17c2665140fa863105a8dad57936.jpg' },
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
      <motion.p variants={fadeInY} className="text-lg text-gray-700 text-justify mb-4">
        En NÜArt creemos que cada persona tiene una historia para contar...
      </motion.p>
      <motion.p variants={fadeInY} className="text-lg text-gray-700 text-justify mb-12">
        Nuestra visión es ser la marca argentina líder...
      </motion.p>

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