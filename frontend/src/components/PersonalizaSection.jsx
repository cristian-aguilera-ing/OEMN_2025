import React from 'react'; // <-- ¡AÑADE ESTA LÍNEA!
{/*import { Link } from 'react-router-dom'; */}
import { MagicButton } from './MagicButton'; // <-- 1. IMPORTA TU NUEVO BOTÓN
import { motion } from 'framer-motion';

const products = [
  {
    name: 'Mochila',
    path: 'backpack',
    img: '/img/mi-diseno-mochila.png',
    desc: 'Materiales: Jean, nylon, poliéster',
  },
  {
    name: 'Bolso',
    path: 'bag',
    img: '/img/mi-diseno-bolso.png',
    desc: 'Materiales: Lona, cuero sintético, poliester.',
  },
  {
    name: 'Bolso para Mate',
    path: 'mate',
    img: '/img/mi-diseno-mate.png',
    desc: 'Material interno impermeable.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export const PersonalizaSection = () => {
  return (
    <section id="personaliza" className="bg-black text-white py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-bold mb-3 tracking-tight"
        >
          PERSONALIZA CON NOSOTROS
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 mb-16 italic"
        >
          Lleva tu identidad en cada detalle
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.path}
              variants={cardVariants}
              className="bg-white text-black rounded-lg overflow-hidden shadow-lg flex flex-col"
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-72 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-4 flex-grow">{product.desc}</p>
                
                {/* ¡¡AQUÍ ESTÁ LA MAGIA!!
                  Esto te llevará a /designer, que cargará tu app.
                  (El path: 'backpack' no lo usamos aún, pero es buena idea) 
                */}
                <MagicButton to="/designer">
                  Diseña aquí
                </MagicButton>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};